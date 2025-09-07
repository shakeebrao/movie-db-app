import React, { createContext } from 'react';

export const ApiContext = createContext();

export const ApiProvider = ({ api, apiFetcher, children }) => (
  <ApiContext.Provider value={{ api, apiFetcher}}>
    {children}
  </ApiContext.Provider>
);
