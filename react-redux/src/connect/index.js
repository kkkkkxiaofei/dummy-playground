import React, { 
  useContext, 
  memo, 
  useMemo, 
  useRef, 
  useReducer,
  useEffect, 
} from 'react';
import selectFactory from './selectFactory';
import ReactReduxContext from '../components/ReactReduxContext';
import Subscription from '../utils/Subscription';
import shallowEqual from '../utils/shallowEqual';

const strictEqual = (a, b) => a === b;

const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    pure = true,
    areStatesEqual = strictEqual,
    //todo: use shallow equal
    areOwnPropsEqual = shallowEqual,
    areStatePropsEqual = shallowEqual,
    areMergedPropsEqual = shallowEqual,
  } = {}
) => {

  //todo: memorize
  const wrappedSelectFactory = selectFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual
    }
  );
  
  return WrappedComponent => {
    const ConnectFunction = ownProps => {
      const contextValue = useContext(ReactReduxContext);
      const { store, subscription: parentSub } = contextValue;
      const subscription = useMemo(() => {
        return new Subscription(store, parentSub)
      }, [store, parentSub]);
      const finalPropsSelector = useMemo(() => {
        return wrappedSelectFactory(store);
      }, [store]);
      const [any, forceRender] = useReducer(i => i + 1, 0);
      const latestOwnProps = useRef(ownProps);
      const latestFinalProps = useRef();
      const latestfinalPropsFromStoreUpdated = useRef();
      const usePure = pure ? useMemo : cb => cb();
      const actualFinalProps = usePure(() => {
        if (latestfinalPropsFromStoreUpdated.current) {
          return latestfinalPropsFromStoreUpdated.current;
        }
        return finalPropsSelector(store.getState(), ownProps);
      }, [ownProps, any, latestfinalPropsFromStoreUpdated]);
      
      useEffect(() => {
        if (latestfinalPropsFromStoreUpdated.current) {
          subscription.notify();
        } else {
          latestFinalProps.current = actualFinalProps;
        }
      });

      useEffect(() => {
        const check = () => {
          const newProps = finalPropsSelector(store.getState(), latestOwnProps.current);
          if (newProps === latestFinalProps.current) {
            subscription.notify();
          } else {
            latestOwnProps.current = ownProps;
            latestFinalProps.current = newProps;
            latestfinalPropsFromStoreUpdated.current = newProps;
            forceRender();
          }
        };
        subscription.onStateChange = check;
        subscription.trySubscribe();

        check();
      }, [subscription, latestOwnProps, latestFinalProps, latestfinalPropsFromStoreUpdated]);
      
      const newContextValue = useMemo(() => {
        return {
          ...contextValue,
          subscription 
        } 
      }, [contextValue, subscription]);

      return (
        <ReactReduxContext.Provider value={newContextValue}>
          <WrappedComponent {...actualFinalProps} />
        </ReactReduxContext.Provider>
      );
    }
    return pure ? memo(ConnectFunction) : ConnectFunction;
  };
}

export default connect;