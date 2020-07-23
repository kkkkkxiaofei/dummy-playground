import React, { useContext, memo } from 'react';
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

  const wrappedSelectFactory = selectFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  );

  const { store } = useContext(ReactReduxContext);

  const finalPropsSelector = wrappedSelectFactory(store);
  
  return WrappedComponent => {
    const ConnectFunction = ownProps => <WrappedComponent {...finalPropsSelector(ownProps)} />
    return pure ? memo(ConnectFunction) : ConnectFunction;
  };
}

export default connect;