"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';

export default function TokenDeposit() {
  const { programId, wallet, connection, Transaction, createDepositInstruction } = usePurifyProgram();
  const [amount, setAmount] = useState('');
  const [vaultName, setVaultName] = useState('plastic-waste');
  const [isLoading, setIsLoading] = useState(false);

  const depositTokens = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
      alert('Please connect wallet first');
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
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

      console.log('📤 Sending deposit transaction...');
      
      // Send transaction
      const signature = await wallet.sendTransaction(transaction, connection, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      console.log('✅ Deposit transaction submitted! Signature:', signature);
      
      alert(`🔥 Successfully deposited ${depositAmount} SOL!\n\n✅ Transaction: ${signature}\n\n🔍 View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet\n\n🌱 Tokens burned to create scarcity!`);
      
      setAmount('');

    } catch (error: any) {
      console.error('❌ Deposit failed:', error);
      
      if (error.message.includes('User rejected')) {
        alert('❌ Transaction was rejected by user');
      } else {
        alert(`❌ Failed to deposit tokens: ${error.message}\n\nMake sure you have enough SOL and the vault exists.`);
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
        
        <motion.button
          onClick={depositTokens}
          disabled={isLoading || !amount}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Purging Tokens...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🔥</span>
              <span>Purge Tokens</span>
            </>
          )}
        </motion.button>
        
        <div className="text-xs text-orange-300 space-y-1">
          <p>💡 Burning tokens increases scarcity</p>
          <p>🌍 Contributes to environmental impact</p>
          <p>📈 Creates value through tokenomics</p>
        </div>
      </div>
    </motion.div>
  );
}