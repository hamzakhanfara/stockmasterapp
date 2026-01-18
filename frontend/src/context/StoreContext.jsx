import React from 'react';
import { createRootStore } from '../stores/RootStore';
import { ApiClient } from '../api/client';
import { useAuth } from '@clerk/clerk-react';
import { StoreContext } from './storeContextValue';

export { StoreContext };

export const StoreProvider = ({ children }) => {
  const { getToken } = useAuth();
  const [context] = React.useState(() => {
    const store = createRootStore();
    const api = new ApiClient();
    
    getToken().then(token => {
      if (token) api.setToken(token);
    });

    return { store, api };
  });

  return (
    <StoreContext.Provider value={context}>
      {children}
    </StoreContext.Provider>
  );
};
