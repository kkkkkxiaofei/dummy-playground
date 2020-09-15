import combineReducers from '../src/combineReducers';

describe('Combine Reducers', () => {
  it('signle reducer', () => {
    const userReducer = (state = {}, action) => {
      if (action.type === 'FETCH_NAME') {
        return { ...state, name: 'Zeo' };
      }

      return state;
    }

    const combination = combineReducers({ user: userReducer });
    const nextState = combination({}, { type: 'FETCH_NAME' });

    expect(nextState).toEqual({
      user: { 
        name: 'Zeo'
      }
    });
  });

  it('multiple reducers', () => {
    const userReducer = (state = {}, action) => {
      if (action.type === 'FETCH_NAME') {
        return { ...state, name: 'Zeo' };
      }

      return state;
    }

    const orderReducer = (state = {}, action) => {
      if (action.type === 'FETCH_ORDER') {
        return { ...state, price: '$100' };
      }

      return state;
    }

    const mockUserReducer = jest.fn(userReducer);
    const mockOrderReducer = jest.fn(orderReducer);

    const combination = combineReducers({ 
      user: mockUserReducer,
      order: mockOrderReducer 
    });

    const nextState = combination({}, { type: 'FETCH_NAME' });

    expect(nextState).toEqual({
      user: { 
        name: 'Zeo'
      },
      order: {}
    });
    expect(mockUserReducer.mock.calls.length).toBe(1);
    expect(mockOrderReducer.mock.calls.length).toBe(1);

    const nextNextState = combination(nextState, { type: 'FETCH_ORDER' });

    expect(nextNextState).toEqual({
      user: { 
        name: 'Zeo'
      },
      order: {
        price: '$100'
      }
    });
    expect(mockUserReducer.mock.calls.length).toBe(2);
    expect(mockOrderReducer.mock.calls.length).toBe(2);

    const finalState = combination(nextNextState, { type: 'FETCH_ORDER' });

    expect(finalState).toEqual(nextNextState);
    expect(mockUserReducer.mock.calls.length).toBe(3);
    expect(mockOrderReducer.mock.calls.length).toBe(3);

  });
});