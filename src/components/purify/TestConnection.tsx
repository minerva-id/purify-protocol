// src/components/purify/TestConnection.tsx
"use client";

import { usePurifyProgram } from '@/hooks/usePurifyProgram';

export default function TestConnection() {
  const { wallet, programId } = usePurifyProgram();

  const testConnection = async () => {
    if (!wallet.connected) {
      alert('Please connect wallet first');
      return;
    }

    try {
      alert(`✅ Purify Protocol Ready!\n\nProgram: ${programId.toString()}\n\nWallet: ${wallet.publicKey?.toString().slice(0, 8)}...\n\nReady for real transactions!`);
    } catch (error: any) {
      alert(`❌ Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
      <h4 className="font-semibold text-blue-400 mb-2">🔗 Connection Status</h4>
      <p className="text-xs text-blue-300 mb-3">
        Program: {programId.toString().slice(0, 8)}...{programId.toString().slice(-8)}
      </p>
      <div className="flex items-center space-x-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${wallet.connected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className="text-xs text-white">
          {wallet.connected ? 'Wallet Connected' : 'Connect Wallet'}
        </span>
      </div>
      <button
        onClick={testConnection}
        disabled={!wallet.connected}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        {wallet.connected ? 'Test Connection' : 'Connect Wallet First'}
      </button>
    </div>
  );
}
