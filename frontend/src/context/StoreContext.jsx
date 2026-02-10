import React from 'react';
import { createRootStore } from '../stores/RootStore';
import { ApiClient } from '../api/client';
import { useAuth } from '@clerk/clerk-react';
import { StoreContext } from './storeContextValue';

export { StoreContext };

export const StoreProvider = ({ children }) => {
  const { getToken, userId } = useAuth();
  const [context] = React.useState(() => {
    const store = createRootStore();
    const api = new ApiClient();
    
    getToken().then(token => {
      if (token) api.setToken(token);
    });

    return { store, api };
  });

  // Reset all stores when user changes (sign in/out)
  React.useEffect(() => {
    if (!userId) {
      // User signed out - clear all data
      context.store.reset();
      context.api.setToken(null);
    } else {
      // User signed in - update token
      getToken().then(token => {
        if (token) {
          context.api.setToken(token);
          // Clear old data and let components refetch with new user
          context.store.reset();
        }
      });
    }
  }, [userId, context, getToken]);

  return (
    <StoreContext.Provider value={context}>
      {children}
    </StoreContext.Provider>
  );
};
