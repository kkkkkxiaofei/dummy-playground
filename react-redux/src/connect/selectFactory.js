const defaultMergeProps = (ownProps, stateProps, dispatchProps) => 
({...ownProps, ...stateProps, ...dispatchProps});

export default (
  mapStateToProps = () => ({}),
  mapDispatchToProps = () => ({}),
  mergeProps = defaultMergeProps,
  {
    areStatesEqual,
    areOwnPropsEqual,
    areStatePropsEqual,
    areMergedPropsEqual
  }
) => store => {
  let stateProps, dispatchProps, finalProps, state, ownProps;

  return (nextState, nextOwnProps) => { 
    if (!stateProps && !dispatchProps && !finalProps) {
      stateProps = mapStateToProps(nextState);
      dispatchProps = mapDispatchToProps(store.dispatch);
      finalProps = mergeProps(nextOwnProps, stateProps, dispatchProps);
    } else {
      const stateChanged = !areStatesEqual(nextState, state);
      const ownPropsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
      //todo: consider mapStateToProps, mapDispatchToProps depend on ownProps
      if (stateChanged) {
        const nextStateProps = mapStateToProps(nextState);
        const statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
        stateProps = nextStateProps;

        if (statePropsChanged) {
          dispatchProps = mapDispatchToProps(store.dispatch);
          finalProps = mergeProps(nextOwnProps, stateProps, dispatchProps);
        }
      }
    }
    
    state = nextState;
    ownProps = nextOwnProps;
    return finalProps;
  }
}