"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingButton } from '@/components/common/LoadingButton';

export default function TokenDeposit() {
  const { programId, wallet, connection, Transaction, createDepositInstruction } = usePurifyProgram();
  const { success, error, info } = useNotification();
  const [amount, setAmount] = useState('');
  const [vaultName, setVaultName] = useState('plastic-waste');
  const [isLoading, setIsLoading] = useState(false);

  const depositTokens = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
      error('Wallet Not Connected', 'Please connect your wallet first');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      error('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);
    info('Preparing Transaction', 'Creating deposit instruction...');

    try {
      console.log('🔥 Depositing tokens...', {
        amount: depositAmount,
        vault: vaultName
      });

      // Create deposit instruction
      const instruction = await createDepositInstruction(vaultName, depositAmount);

      // Create transaction
      const transaction = new Transaction().add(instruction);
      
      // Set recent blockhash
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      info('Sending Transaction', 'Please approve the transaction in your wallet...');
      
      // Send transaction
      const signature = await wallet.sendTransaction(transaction, connection, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      console.log('✅ Deposit transaction submitted! Signature:', signature);
      
      info('Confirming Transaction', 'Waiting for blockchain confirmation...');
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      success(
        'Tokens Deposited Successfully!',
        `${depositAmount} tokens deposited to ${vaultName} vault`,
        8000
      );
      
      // Add action to view on explorer
      setTimeout(() => {
        success(
          'Transaction Confirmed',
          `View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          10000
        );
      }, 1000);
      
      setAmount('');

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ Deposit failed:', message);

      if (message.includes('User rejected') || message.includes('User cancelled')) {
        error('Transaction Cancelled', 'You rejected the transaction');
      } else {
        error(
          'Deposit Failed',
          message.length > 100 ? `${message.substring(0, 100)}...` : message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-orange-400 mb-2">🔥 Purge Tokens</h4>
        <p className="text-sm text-orange-300">Please connect wallet to purge tokens</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="font-semibold text-orange-400 mb-2">🔥 Purge Tokens</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-orange-300 mb-1 block">Select Vault</label>
          <select
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-orange-500/30 rounded-lg text-white focus:outline-none focus:border-orange-400 text-sm"
          >
            <option value="plastic-waste">♻️ Plastic Waste Vault</option>
            <option value="e-waste">🔌 E-Waste Vault</option>
            <option value="carbon-credit">🌱 Carbon Credit Vault</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs text-orange-300 mb-1 block">Amount to Purge (SOL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 bg-black/20 border border-orange-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 text-sm"
          />
        </div>
        
        <LoadingButton
          isLoading={isLoading}
          onClick={depositTokens}
          disabled={!amount}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
          loadingText="Purging Tokens..."
        >
          <span className="text-lg">🔥</span>
          <span>Purge Tokens</span>
        </LoadingButton>
        
        <div className="text-xs text-orange-300 space-y-1">
          <p>💡 Burning tokens increases scarcity</p>
          <p>🌍 Contributes to environmental impact</p>
          <p>📈 Creates value through tokenomics</p>
        </div>
      </div>
    </motion.div>
  );
}
