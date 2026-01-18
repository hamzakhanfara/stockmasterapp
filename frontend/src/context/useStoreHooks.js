import { useContext } from 'react';
import { StoreContext } from './storeContextValue';

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context.store;
};

export const useApi = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useApi must be used within StoreProvider');
  }
  return context.api;
};
