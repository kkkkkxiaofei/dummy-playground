import createStore from '../libs/createStore';
import applyMiddleware from '../libs/applyMiddleware';
import { INIT } from '../libs/ActionTypes';

describe('Create Store', () => {
  it('store check', () => {
    const reducer = $ => $;
    const { dispatch, getState } = createStore(reducer);

    expect(typeof dispatch).toEqual('function');
    expect(typeof getState).toEqual('function');
  });

  it('dispatch', () => {
    const mockReducer = jest.fn($ => $);
    const { dispatch } = createStore(mockReducer);

    const action = { type: 'TEST_ACTION' };

    dispatch(action);

    expect(mockReducer.mock.calls.length).toBe(2);
    expect(mockReducer.mock.calls[0][1]).toEqual({ type: INIT });
    expect(mockReducer.mock.calls[1][1]).toBe(action);

  });

  it('subscribe', () => {
    const reducer = $ => $;
    const action = {type: 'TEST_ACTION'};
    const { dispatch, subscribe } = createStore(reducer);

    const mockListener1 = jest.fn($ => $);
    const mockListener2 = jest.fn($ => $);

    const unsubcribe1 = subscribe(mockListener1);
    const unsubcribe2 = subscribe(mockListener2);

    dispatch(action);

    expect(mockListener1.mock.calls.length).toBe(1);
    expect(mockListener2.mock.calls.length).toBe(1);
    
    unsubcribe1();
    unsubcribe2();
    dispatch(action);

    expect(mockListener1.mock.calls.length).toBe(1);
    expect(mockListener2.mock.calls.length).toBe(1);
  });
  
  it('create store via enhancer', () => {
    const reducer = $ => $;
    const mockFn1 = jest.fn($ => $);
    const mockFn2 = jest.fn($ => $);
    const middleware1 = store => next => action => {
      mockFn1(action);
      return next(action);
    };
    const middleware2 = store => next => action => {
      mockFn2(action);
      return next(action);
    };
    
    const enhancer = applyMiddleware(middleware1, middleware2);

    const { dispatch } = createStore(reducer, null, enhancer);

    const action = { type: 'TEST_ACTION' };

    dispatch(action);

    expect(mockFn1.mock.calls.length).toBe(1);
    expect(mockFn2.mock.calls.length).toBe(1);
    expect(mockFn1.mock.calls[0][0]).toBe(action);
    expect(mockFn2.mock.calls[0][0]).toBe(action);
   });

});