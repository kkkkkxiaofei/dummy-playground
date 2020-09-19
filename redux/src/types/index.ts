export type State = any;

export interface Action {
  type: string
}

export type Listener = (arg?: any) => any | any[];

export type Dispatch = (action: Action) => void;

export type StateGetter = () => State;

export interface Store {
  dispatch: Dispatch,
  getState: StateGetter,
  subscribe: (listener: Listener) => () => void,
  replaceReducer: (newReducer: Reducer) => void
}

export type Reducer = (state: any, action: Action) => any;

export type Enhancer = (createStore: StoreFactory) => StoreFactory;

export type StoreFactory = (reducer: Reducer, initialState: any, enhancer?: Enhancer) => Store;

export type ReducerMap<A = any> = {
  [K in keyof A]: Reducer;
}

export type Middleware = (dispatch: Dispatch) => (action: Action) => any;
