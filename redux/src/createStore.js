import { INIT, REPLACE } from "./ActionTypes";

const createStore = (reducer, initState, enhancer) => {
  if (typeof initState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initState;
    initState = undefined;
  }

  if (enhancer) {
    return enhancer(createStore)(reducer, initState || {});
  }
  
  let state = initState, 
  listeners = [],
  currentReducer = reducer;
  
  const getState = () => state;

  const subscribe = listener => {
    listeners.push(listener);
    //unsubsribe
    return () => listeners.splice(listeners.indexOf(listener), 1);
  }

  const dispatch = action => {
    if (action) {

      if (action.type === INIT) {
        state = currentReducer(initState, { type: INIT });
        return;
      }

      // include @@REPLACE 
      state = currentReducer(state, action);
      
      listeners.forEach(listener => listener());
    }
  }

  const replaceReducer = newReducer => {
    currentReducer = newReducer;
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

export default createStore;