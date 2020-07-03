export default reducer => {
  let state = null;
  const dispatch = action => reducer(action, state);
  const getState = () => state;

  return {
    dispatch,
    getState
  }
}