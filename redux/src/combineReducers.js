export default reducersMap => {
  let nextState = {}, 
  finalReducer = {};

  const reducerKeys = Object.keys(reducersMap);

  // make sure all reducers are function
  finalReducer = reducerKeys
    .filter(key => typeof reducersMap[key] === 'function')
    .reduce((result, key) => ({ ...result, [key]: reducersMap[key] }), finalReducer);

  // combination
  return (state = {}, action) => {
    const finalReducerKeys = Object.keys(finalReducer);

    let hasChanged = false;

    finalReducerKeys.forEach(key => {
      const currentStateOfKey = state[key];
      const nextStateOfKey = finalReducer[key](currentStateOfKey, action);
      nextState[key] = nextStateOfKey;

      hasChanged = currentStateOfKey !== nextStateOfKey;
    })

    return hasChanged ? nextState : state;
  }
};