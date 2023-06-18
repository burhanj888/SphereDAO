

import React, { createContext, useState } from 'react';

export const MyContext = createContext(['', () => {}]);

export const MyProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <MyContext.Provider value={[walletAddress, setWalletAddress]}>
      {children}
    </MyContext.Provider>
  );
};