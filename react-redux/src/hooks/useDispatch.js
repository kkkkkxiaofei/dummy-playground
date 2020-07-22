import { useContext } from 'react';
import ReactReduxContext from '../components/ReactReduxContext';

export default () => {
  const { store } = useContext(ReactReduxContext);
  return store.dispatch;
};