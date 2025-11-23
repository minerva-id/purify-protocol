// src/components/VaultManager/VaultManager.tsx
import React, { useState } from 'react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { usePurifyProgram } from '../../utils/program';
import { initializeVault } from '../../utils/transactions';

export const VaultManager: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { getProgram } = usePurifyProgram();
  const [mintAddress, setMintAddress] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateVault = async () => {
    if (!publicKey || !mintAddress) return;

    setIsLoading(true);
    try {
      const program = getProgram();
      const mint = new PublicKey(mintAddress);

      const [vaultState] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), mint.toBuffer()],
        program.programId
      );

      console.log('🏗️ Initializing vault for mint:', {
        mint: mint.toString(),
        vaultState: vaultState.toString(),
        authority: publicKey.toString()
      });

      const instruction = await initializeVault(program, mint, publicKey, metadataUri);
      
      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      
      console.log('📤 Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      
      console.log('⏳ Confirming transaction...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      
      alert(`✅ Vault initialized successfully!\n\n📍 Mint: ${mint.toString()}\n🏦 Vault State: ${vaultState.toString()}\n📝 Signature: ${signature}`);
      setMintAddress('');
      setMetadataUri('');
      
    } catch (error) {
      console.error('❌ Error initializing vault:', error);
      alert(`❌ Failed to initialize vault: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vault-manager">
      <h2>🏦 Initialize Recycling Vault</h2>
      <p className="description">
        Create a new vault for a specific token. The vault will manage deposits, burns, and issue recycling certificates.
      </p>
      
      <div className="vault-form">
        <div className="form-group">
          <label>Token Mint Address:</label>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter the token mint address"
            disabled={isLoading}
            className="vault-input"
          />
        </div>
        
        <div className="form-group">
          <label>Vault Metadata URI (Optional):</label>
          <input
            type="text"
            value={metadataUri}
            onChange={(e) => setMetadataUri(e.target.value)}
            placeholder="https://arweave.net/vault-metadata"
            disabled={isLoading}
            className="vault-input"
          />
        </div>
        
        <button 
          onClick={handleCreateVault}
          disabled={!publicKey || !mintAddress || isLoading}
          className="vault-button"
        >
          {isLoading ? '🔄 Initializing...' : '🏗️ Initialize Vault'}
        </button>
      </div>
      
      {mintAddress && publicKey && (
        <div className="vault-preview">
          <h4>🔍 Vault Preview:</h4>
          <div className="preview-info">
            <p><strong>Token Mint:</strong> {mintAddress.slice(0, 8)}...{mintAddress.slice(-8)}</p>
            <p><strong>Authority:</strong> {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</p>
            <p><strong>Vault State:</strong> {
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
            }</p>
          </div>
        </div>
      )}
      
      {!publicKey && (
        <div className="wallet-warning">
          🔗 Please connect your wallet to create a vault
        </div>
      )}
    </div>
  );
};

export default VaultManager;