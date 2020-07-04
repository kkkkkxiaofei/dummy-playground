export default reducer => {
  let state = null, listeners = [];
  
  const getState = () => state;
  const subscribe = listener => {
    listeners.push(listener);
    //unsubsribe
    return () => listeners.splice(listeners.indexOf(listener), 1);
  }

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  return {
    dispatch,
    getState,
    subscribe
  }
}