"use client";

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useState } from 'react'; // Hapus useEffect yang tidak dipakai
import { createPortal } from 'react-dom';

export function CustomWalletButton({ centerOnOpen = false }: { centerOnOpen?: boolean }) {
  const { connected, disconnect, publicKey, select, wallets, connecting } = useWallet();
  const [showModal, setShowModal] = useState(false);

  // --- HAPUS BAGIAN INI ---
  // useEffect(() => {
  //   const clearWalletHistory = () => { ... }
  //   ...
  // }, []);
  // ------------------------

  const handleConnect = () => {
    setShowModal(true);
  };

  const handleWalletSelect = (walletName: string) => {
    // --- HAPUS BAGIAN INI ---
    // localStorage.removeItem('walletName');
    // localStorage.removeItem('walletAdapter');
    // ------------------------

    // Cukup panggil select, library akan otomatis simpan ke localStorage
    select(walletName as any);
    setShowModal(false);
  };

  const handleDisconnect = () => {
      disconnect();
      setShowModal(false);
      // Tidak perlu manual remove localStorage, disconnect() sudah menanganinya
  };

  const truncatedAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';

  const modal = (
    <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex ${centerOnOpen ? 'items-center' : 'items-end md:items-center'} justify-center p-4`}>
      <div className="bg-[#03150f] border border-emerald-700/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Select Wallet</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet.adapter.name)}
              className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-emerald-800/30 hover:border-emerald-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-8 h-8 rounded"
                />
                <span className="text-white font-medium">{wallet.adapter.name}</span>
              </div>

              {wallet.readyState === WalletReadyState.NotDetected ? (
                <a
                  href={getWalletInstallUrl(wallet.adapter.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Install
                </a>
              ) : (
                <span className="text-xs text-emerald-400 bg-emerald-400/20 px-3 py-1 rounded">Connect</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-3 text-center">Select a wallet to connect.</p>
          {connected && (
            <div className="flex justify-center">
              <button
                onClick={handleDisconnect}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleConnect();
        }}
        disabled={connecting}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white px-6 py-3 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 flex items-center space-x-2"
      >
        {connecting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </>
        ) : connected ? (
          <>
            <span>🔗</span>
            <span>{truncatedAddress}</span>
          </>
        ) : (
          <>
            <span>💳</span>
            <span>Connect Wallet</span>
          </>
        )}
      </button>

      {showModal && typeof document !== 'undefined' && createPortal(modal, document.body)}
    </>
  );
}

function getWalletInstallUrl(walletName: string): string {
  const urls: { [key: string]: string } = {
    Phantom: 'https://phantom.app/',
    Solflare: 'https://solflare.com/',
    Backpack: 'https://www.backpack.app/',
    Glow: 'https://glow.app/',
  };
  return urls[walletName] || 'https://solana.com/ecosystem/explore?categories=wallet';
}
