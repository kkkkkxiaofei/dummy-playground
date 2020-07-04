import { INIT, REPLACE } from "./ActionTypes";

export default reducer => {
  let state = null, 
  listeners = [],
  currenReducer = reducer;
  
  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    //unsubsribe
    return () => listeners.splice(listeners.indexOf(listener), 1);
  }

  const dispatch = action => {
    if (action) {

      if (action.type === INIT) {
        state = currenReducer(null, { type: INIT }) || {};
        return;
      }

      // include @@REPLACE 
      state = currenReducer(state, action) || {};
      
      listeners.forEach(listener => listener());
    }
  }

  const replaceReducer = newReducer => {
    currenReducer = newReducer;
    dispatch({ type: REPLACE });
  };

  dispatch({ type: INIT });

  return {
    dispatch,
    getState,
    subscribe,
    replaceReducer
  }
}