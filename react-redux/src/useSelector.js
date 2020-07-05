import { useContext, useRef, useEffect, useReducer } from 'react';
import ReactReduxContext from './ReactReduxContext';

const refEqual = (a, b) => a === b;

const useSelector = (selector, equalFn = refEqual) => {
  const { store } = useContext(ReactReduxContext);
  const storeState = store.geState();
  const latestSelector = useRef();
  const latestSelectorState = useRef();
  let selectorState;

  const forceRender = useReducer(i => i + 1, 0);

  if (selector !== latestSelector.current || selectorState !== latestSelectorState.current) {
    selectorState = selector(storeState);
  }

  useEffect(() => {
    latestSelector.current = selector;
    latestSelectorState.current = selectorState;
  });

  const check = () => {
    if (equalFn(selectorState, selector(store.geState())))
      return;
    
    forceRender();
  }

  store.subscribe(check);

  check();

  return selectorState;
};

export default useSelector;