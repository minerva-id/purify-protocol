// src/components/VaultManager.tsx
"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion } from 'framer-motion';

export default function VaultManager() {
  const { programId, wallet, connection, SystemProgram, Transaction } = usePurifyProgram();
  const [vaultName, setVaultName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createVault = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
      alert('Please connect wallet first');
      return;
    }

    if (!vaultName.trim()) {
      alert('Please enter a vault name');
      return;
    }

    setIsLoading(true);
    try {
      // Generate PDA untuk vault
      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), Buffer.from(vaultName)],
        programId
      );

      console.log('🚀 Creating vault...', {
        vaultName,
        vaultPda: vaultPda.toString(),
        authority: wallet.publicKey.toString()
      });

      // Create instruction data manual untuk initializeVault
      const instructionData = Buffer.concat([
        Buffer.from([0]), // instruction discriminator
        Buffer.from(vaultName, 'utf-8'), // vault name
        Buffer.from([0]) // null terminator untuk string
      ]);

      // Create transaction instruction
      const instruction = {
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: programId,
        data: instructionData,
      };

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      
      // Set recent blockhash untuk transaction
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      console.log('📤 Sending transaction...');
      
      // Send transaction menggunakan wallet (TANPA CONFIRMATION)
      const signature = await wallet.sendTransaction(transaction, connection, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      console.log('✅ Transaction submitted! Signature:', signature);
      
      // SUCCESS - Tidak perlu confirm, langsung anggap berhasil
      alert(`🎉 Vault "${vaultName}" creation submitted!\n\n✅ Transaction Signature: ${signature}\n\n🔍 View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet\n\n💡 Note: Transaction might take a few moments to confirm on blockchain.`);
      
      setVaultName('');

    } catch (error: any) {
      console.error('❌ Vault creation failed:', error);
      
      if (error.message.includes('User rejected')) {
        alert('❌ Transaction was rejected by user');
      } else if (error.message.includes('Timeout')) {
        alert('⏰ Transaction timeout - but may still succeed. Check your wallet for pending transactions.');
      } else {
        alert(`❌ Failed to create vault: ${error.message}\n\nMake sure you have enough SOL for transaction fees.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-emerald-400 mb-2">🔄 Create Vault</h4>
        <p className="text-sm text-emerald-300">Please connect wallet to create recycling vaults</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="font-semibold text-emerald-400 mb-2">🔄 Create Recycling Vault</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-emerald-300 mb-1 block">Vault Name</label>
          <input
            type="text"
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            placeholder="e.g., plastic-waste, e-waste"
            className="w-full px-3 py-2 bg-black/20 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 text-sm"
          />
        </div>
        
        <motion.button
          onClick={createVault}
          disabled={isLoading || !vaultName.trim()}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating on Blockchain...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🔄</span>
              <span>Create Recycling Vault</span>
            </>
          )}
        </motion.button>
        
        <div className="text-xs text-emerald-300 space-y-1">
          <p>💡 Creates real vault on Solana DevNet</p>
          <p>🔍 Check transaction in Phantom wallet</p>
          <p>🌱 Ready for token recycling operations</p>
        </div>
      </div>
    </motion.div>
  );
}