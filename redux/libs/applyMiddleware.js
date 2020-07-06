import compose from './compose';

export default (...middlewares) => {
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
     *   (...arg) => next1(next2(next3(...arg)))
     * 
     */
    const nexters = middlewares.map(middleware => middleware(store));
    dispatch = compose(...nexters)(dispatch);

    return {
      ...store,
      dispatch,
    }
  }

  return enhancer;
}
  