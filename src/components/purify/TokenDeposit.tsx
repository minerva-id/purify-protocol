"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { useProtocolConfig } from '@/hooks/useOnChainData';
import { motion } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingButton } from '@/components/common/LoadingButton';
import { calculateFee } from '@/utils/governance';

export default function TokenDeposit() {
  const { programId, wallet, connection, Transaction, createDepositInstruction } = usePurifyProgram();
  const { success, error, info } = useNotification();
  const [amount, setAmount] = useState('');
  const [vaultName, setVaultName] = useState('plastic-waste');
  const [isLoading, setIsLoading] = useState(false);
  const { config, loading: configLoading } = useProtocolConfig();
  const parsedAmount = amount ? parseFloat(amount) : 0;
  const estimatedFee = config ? calculateFee(isNaN(parsedAmount) ? 0 : parsedAmount, config.feeBasisPoints) : 0;
  const netAmount = config ? Math.max((isNaN(parsedAmount) ? 0 : parsedAmount) - estimatedFee, 0) : (isNaN(parsedAmount) ? 0 : parsedAmount);

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

    if (config?.paused) {
      error('Protocol Paused', 'Deposits are temporarily disabled by protocol authority');
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
        {config?.paused && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-lg p-3">
            Protocol is currently paused. Deposits are disabled until resumed by the authority.
          </div>
        )}
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

        <div className="bg-black/20 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-200 space-y-1">
          {configLoading ? (
            <p>Loading protocol fee info...</p>
          ) : config ? (
            <>
              <p>Protocol fee: {(config.feeBasisPoints / 100).toFixed(2)}% (~{estimatedFee.toFixed(4)} tokens)</p>
              <p>Net amount received: {netAmount.toFixed(4)} tokens</p>
              {config.paused && <p className="text-red-300">Protocol is currently paused.</p>}
            </>
          ) : (
            <p>No protocol fee configured. Deposits are fee-free for now.</p>
          )}
        </div>
        
        <LoadingButton
          isLoading={isLoading}
          onClick={depositTokens}
          disabled={!amount || config?.paused}
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
