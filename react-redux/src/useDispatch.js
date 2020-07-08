import { useContext } from 'react';
import ReactReduxContext from './ReactReduxContext';

export default () => {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
};