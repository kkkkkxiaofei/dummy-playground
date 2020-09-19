import { INIT, REPLACE } from "./ActionTypes";
import { 
  Action, 
  Reducer, 
  State, 
  Enhancer, 
  Listener,
  StateGetter,
  Store,
} from './types/index';

const createStore = (reducer: Reducer, initState?: State, enhancer?: Enhancer): Store => {
  if (typeof initState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initState;
    initState = undefined;
  }

  if (enhancer) {
    return enhancer(createStore)(reducer, initState || {});
  }
  
  let state: State = initState,
  listeners: Listener[] = [],
  currentReducer: Reducer = reducer;
  
  const getState: StateGetter = () => state;

  const subscribe = (listener: Listener) => {
    listeners.push(listener);
    //unsubsribe
    return () => listeners.splice(listeners.indexOf(listener), 1);
  }

  const dispatch = (action: Action): void => {
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

  const replaceReducer = (newReducer: Reducer): void => {
    currentReducer = newReducer;
    dispatch({ type: REPLACE });
  };

  dispatch({ type: INIT });

  const store: Store = {
    dispatch,
    getState,
    subscribe,
    replaceReducer
  }

  return store;
}

export default createStore;