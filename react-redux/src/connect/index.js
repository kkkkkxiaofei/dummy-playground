import selectFactory from './selectFactory';

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

  const finalPropsSelector = selectFactory(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  );
  
  return WrappedComponent => ownProps => <WrappedComponent {...finalPropsSelector(ownProps)} />;
}

export default connect;