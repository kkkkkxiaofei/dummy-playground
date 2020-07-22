import React from 'react';
import ReactReduxContext from './ReactReduxContext';

const Provider = ({ store, context, children }) => {
  const Context = context || ReactReduxContext;
  
  return (
    <Context.Provider value={{ store }}>
      {children}
    </Context.Provider>
  )
};

export default Provider;