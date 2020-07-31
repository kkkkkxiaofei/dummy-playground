import React, { useMemo } from 'react';
import ReactReduxContext from './ReactReduxContext';
import Subscription from '../utils/Subscription';

const Provider = ({ store, context, children }) => {
  const Context = context || ReactReduxContext;
  const subscription = useMemo(() => {
    return new Subscription(store);
  }, [store]);

  subscription.onStateChange = subscription.notify;
  subscription.trySubscribe();

  const contextValue = useMemo(() => {
    return {
      store,
      subscription
    };
  }, [store, subscription]);

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
};

export default Provider;