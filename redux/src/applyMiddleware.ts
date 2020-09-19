import compose from './compose';
import { Middleware, Enhancer, Store } from './types/index';

export default (...middlewares: Middleware[]): Enhancer => {
  const enhancer = createStore => (...args) => {
    const store = createStore(...args);

    let dispatch = store.dispatch;
    /**
     *   middileware: store => next => action => {}
     *   
     *   nexters : [
     *     next => action => next(action), // next1
     *     next => action => next(action), // next2
     *     next => action => next(action), // next3
     *     ...
     *   ] 
     *   
     *   after compose:
     *   
     *   dispatch => next1(next2(next3(dispatch)))`
     * 
     */
    const nexters = middlewares.map(middleware => middleware(store));
    dispatch = compose(...nexters)(dispatch);

    const enhancedStore: Store = {
      ...store,
      dispatch,
    }

    return enhancedStore;
  }

  return enhancer;
}
  