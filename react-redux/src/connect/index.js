import React, { useContext, memo, useMemo, useRef, useReducer } from 'react';
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

  const { store } = useContext(ReactReduxContext);

  const finalPropsSelector = wrappedSelectFactory(store);
  
  return WrappedComponent => {
    const ConnectFunction = ownProps => {
      const [, forceRender] = useReducer(i => i + 1, 0);
      let latestOwnProps = useRef(ownProps);

      const usePure = pure ? useMemo : cb => cb();

      const actualFinalProps = usePure(() => {
        return finalPropsSelector(ownProps);
      }, [ownProps]);

      useEffect(() => {
        latestOwnProps.current = ownProps;
      });

      const check = () => {
        const finalPropsFromStoreUpdated = finalPropsSelector(ownProps);
        if (finalPropsFromStoreUpdated !== actualFinalProps) {
          forceRender();
        }
      };

      store.subscribe(check);

      return <WrappedComponent {...actualFinalProps} />
    }
    return pure ? memo(ConnectFunction) : ConnectFunction;
  };
}

export default connect;