// contexts/WalletContext.tsx
"use client";

import React, { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

export function WalletProviders({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

  const wallets: never[] = [];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={wallets}
        autoConnect
        onError={(error: WalletError) => {
          console.log('Wallet Error:', error);
        }}
      >
        <WalletModalProvider>
          <WalletAutoConnect />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

function WalletAutoConnect() {
  const { connected, select, connect, wallet } = useWallet();

  React.useEffect(() => {
    try {
      const name = wallet?.adapter?.name;
      if (name) localStorage.setItem('walletName', name);
    } catch { }
  }, [wallet]);

  React.useEffect(() => {
    if (connected) return;
    try {
      const saved = localStorage.getItem('walletName');
      if (saved) {
        select(saved as any);
        setTimeout(() => {
          connect().catch(() => { });
        }, 0);
      }
    } catch { }
  }, [connected, select, connect]);

  return null;
}
