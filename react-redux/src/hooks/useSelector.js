import { useMemo, useContext, useRef, useEffect, useReducer } from 'react';
import ReactReduxContext from '../components/ReactReduxContext';
import Subscription from '../utils/Subscription';

const refEqual = (a, b) => a === b;

const useSelector = (selector, equalFn = refEqual) => {
  const { store, subscription: parentSub } = useContext(ReactReduxContext);
  
  const latestState = useRef();
  const latestSelector = useRef();
  const latestSelectorState = useRef();
  
  const subscription = useMemo(() => 
    new Subscription(store, parentSub),
    [store, parentSub]
  );
  
  const [, forceRender] = useReducer(i => i + 1, 0);
  const storeState = store.getState();

  let selectorState;

  if (selector !== latestSelector.current || storeState !== latestState.current) {
    selectorState = latestSelectorState.current = selector(storeState);
    latestSelector.current = selector;
    latestState.current = storeState;
  } else {
    selectorState = latestSelectorState.current;
  }

  useEffect(() => {
    const check = () => {
      const nextState = latestSelector.current(storeState);
      if (equalFn(latestSelectorState.current, nextState)) {
        return;
      }
      
      latestSelectorState.current = nextState;  
      forceRender();
    }
    subscription.onStateChange = check;
    subscription.trySubscribe();
    
    check();
  }, [subscription, store])

  return selectorState;
};

export default useSelector;