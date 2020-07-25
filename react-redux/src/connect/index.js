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

const strictEqual = (a, b) => a === b;

const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    pure = true,
    areStatesEqual = strictEqual,
    //todo: use shallow equal
    areOwnPropsEqual = strictEqual,
    areStatePropsEqual = strictEqual,
    areMergedPropsEqual = strictEqual,
    ...extraOptions
  } = {}
) => {

  //todo: memorize
  const wrappedSelectFactory = selectFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  );
  
  return WrappedComponent => {
    const ConnectFunction = ownProps => {
      const { store } = useContext(ReactReduxContext);
      const finalPropsSelector = wrappedSelectFactory(store);
      const [any, forceRender] = useReducer(i => i + 1, 0);
      let latestOwnProps = useRef(ownProps);
      const usePure = pure ? useMemo : cb => cb();

      const actualFinalProps = usePure(() => {
        return finalPropsSelector(ownProps);
      }, [ownProps, any]);

      useEffect(() => {
        latestOwnProps.current = ownProps;
      });
      
      const check = () => {
        const finalPropsFromStoreUpdated = finalPropsSelector(latestOwnProps.current);
        if (finalPropsFromStoreUpdated !== actualFinalProps) {
          forceRender();
        }
      };

      //consider how many times the render will be invoked if there are nested connected component, need subscription?
      store.subscribe(check);

      return <WrappedComponent {...actualFinalProps} />
    }
    return pure ? memo(ConnectFunction) : ConnectFunction;
  };
}

export default connect;