import createStore from '../createStore';

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

    const action = {type: 'TEST_ACTION'};

    dispatch(action);

    expect(mockReducer.mock.calls.length).toBe(1);
    expect(mockReducer.mock.calls[0][1]).toBe(action);

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

});