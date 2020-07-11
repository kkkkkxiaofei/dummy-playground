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
        state = currenReducer(initState, { type: INIT });
        return;
      }

      // include @@REPLACE 
      state = currenReducer(state, action);
      
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

export default createStore;