// purify-dapp/src/components/TokenOperations/BurnForm.tsx
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { burnFromVault } from '../../utils/transactions';
import { usePurifyProgram } from '../../utils/program';
import { Transaction } from '@solana/web3.js';

export const BurnForm: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { getProgram } = usePurifyProgram();
  const [amount, setAmount] = useState('');
  const [vaultAddress, setVaultAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBurn = async () => {
    if (!publicKey || !amount || !vaultAddress) return;

    setIsLoading(true);
    try {
        const program = getProgram();

      const instruction = await burnFromVault(
        program,
        new PublicKey(vaultAddress),
        publicKey,
        parseFloat(amount)
      );

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      alert(`Tokens burned successfully! Signature: ${signature}`);
      setAmount('');
    } catch (error) {
      console.error('Error burning tokens:', error);
      alert('Failed to burn tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="burn-form">
      <h3>Burn Tokens for Certificate</h3>
      <div className="form-group">
        <label>Vault Address:</label>
        <input
          type="text"
          value={vaultAddress}
          onChange={(e) => setVaultAddress(e.target.value)}
          placeholder="Enter vault address"
        />
      </div>
      <div className="form-group">
        <label>Amount to Burn:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>
      <button 
        onClick={handleBurn}
        disabled={!publicKey || !amount || !vaultAddress || isLoading}
      >
        {isLoading ? 'Burning...' : 'Burn Tokens & Mint Certificate'}
      </button>
    </div>
  );
};