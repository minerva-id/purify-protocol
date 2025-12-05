"use client";

import React, { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import style default jika belum ada di global.css
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProviders({ children }: { children: ReactNode }) {
  // 1. Tentukan network
  const network = WalletAdapterNetwork.Devnet;

  // 2. Gunakan useMemo untuk endpoint agar tidak berubah setiap render
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 3. Gunakan useMemo untuk wallets adapter
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  // 4. Handler error
  const onError = (error: WalletError) => {
    console.error('Wallet Error:', error);
    
    // HANYA hapus localStorage jika walletnya benar-benar tidak ada (LoadError).
    // JANGAN hapus jika hanya NotConnectedError, karena autoConnect mungkin sedang mencoba.
    if (error?.name === 'WalletLoadError') {
      localStorage.removeItem('walletName');
    }
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={onError}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
