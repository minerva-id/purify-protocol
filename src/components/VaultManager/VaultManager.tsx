// src/components/VaultManager/VaultManager.tsx
import React, { useState } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { usePurifyProgram } from '../../utils/program';
import { initializeVault } from '../../utils/transactions';
import { PURIFY_PROGRAM_ID } from '../../utils/constants';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingButton } from '@/components/common/LoadingButton';

export const VaultManager: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { getProgram } = usePurifyProgram();
  const { success, error, info } = useNotification();
  const [mintAddress, setMintAddress] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateVault = async () => {
    if (!publicKey || !mintAddress) {
      error('Missing Information', 'Please provide a mint address');
      return;
    }

    setIsLoading(true);
    info('Preparing Vault', 'Validating mint address and creating vault...');

    try {
      const mint = new PublicKey(mintAddress);

      // Use constant program id for PDA derivation to avoid constructing Program just for a PDA
      const [vaultState] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), mint.toBuffer()],
        PURIFY_PROGRAM_ID
      );

      // Now construct program (may still fail but we postpone it until after PDAs are computed)
      const program = getProgram();

      console.log('🏗️ Initializing vault for mint:', {
        mint: mint.toString(),
        vaultState: vaultState.toString(),
        authority: publicKey.toString()
      });

      info('Creating Transaction', 'Please approve the transaction in your wallet...');

      const instruction = await initializeVault(program, mint, publicKey, metadataUri);
      
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      console.log('📤 Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      
      info('Confirming Transaction', 'Waiting for blockchain confirmation...');
      
      console.log('⏳ Confirming transaction...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      
      success(
        'Vault Initialized Successfully!',
        `Vault created for mint: ${mint.toString().slice(0, 8)}...${mint.toString().slice(-8)}`,
        8000
      );

      setTimeout(() => {
        success(
          'Transaction Confirmed',
          `View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          10000
        );
      }, 1000);
      
      setMintAddress('');
      setMetadataUri('');
      
    } catch (err) {
      console.error('❌ Error initializing vault:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('User rejected') || errorMessage.includes('User cancelled')) {
        error('Transaction Cancelled', 'You rejected the transaction');
      } else if (errorMessage.includes('Invalid')) {
        error('Invalid Mint Address', 'Please check the mint address format');
      } else {
        error(
          'Vault Initialization Failed',
          errorMessage.length > 100 ? `${errorMessage.substring(0, 100)}...` : errorMessage
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // (removed dev-only diagnostics helper)

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-emerald-400">🏦 Initialize Recycling Vault</h4>
          <p className="text-sm text-gray-300 mt-1">Create a new vault for a specific token. The vault will manage deposits, burns, and issue recycling certificates.</p>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Token Mint Address</label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter the token mint address"
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/20 border border-emerald-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
            aria-label="Token mint address"
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 block mb-1">Vault Metadata URI (Optional)</label>
          <input
            type="text"
            value={metadataUri}
            onChange={(e) => setMetadataUri(e.target.value)}
            placeholder="https://arweave.net/vault-metadata"
            disabled={isLoading}
            className="w-full px-3 py-2 bg-black/20 border border-emerald-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
            aria-label="Vault metadata URI"
          />
        </div>

        <LoadingButton
          onClick={handleCreateVault}
          disabled={!publicKey || !mintAddress}
          isLoading={isLoading}
          className="w-full py-3"
          loadingText="Initializing Vault..."
        >
          🏗️ Initialize Vault
        </LoadingButton>
      </div>

      {mintAddress && publicKey && (
        <div className="bg-black/20 border border-white/5 rounded-lg p-3 text-sm text-gray-200">
          <h5 className="font-medium text-emerald-300 mb-2">🔍 Vault Preview</h5>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div><span className="font-semibold text-white">Token Mint:</span> {mintAddress.slice(0, 8)}...{mintAddress.slice(-8)}</div>
            <div><span className="font-semibold text-white">Authority:</span> {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</div>
            <div><span className="font-semibold text-white">Vault State:</span> {
              (() => {
                try {
                  const mint = new PublicKey(mintAddress);
                  const [vaultState] = PublicKey.findProgramAddressSync(
                    [Buffer.from('vault'), mint.toBuffer()],
                    new PublicKey('6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ')
                  );
                  return vaultState.toString().slice(0, 8) + '...' + vaultState.toString().slice(-8);
                } catch {
                  return 'Invalid mint address';
                }
              })()
            }</div>
          </div>
        </div>
      )}

      {!publicKey && (
        <div className="mt-4 text-sm text-yellow-300">🔗 Please connect your wallet to create a vault</div>
      )}
    </div>
  );
};

export default VaultManager;