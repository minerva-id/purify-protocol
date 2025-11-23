"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion } from 'framer-motion';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingButton } from '@/components/common/LoadingButton';

export default function CertificateMinting() {
  const { programId, wallet, connection, Transaction } = usePurifyProgram();
  const { success, error, info } = useNotification();
  const [vaultName, setVaultName] = useState('plastic-waste');
  const [isLoading, setIsLoading] = useState(false);
  const [certificateId, setCertificateId] = useState('');

  const mintCertificate = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
      error('Wallet Not Connected', 'Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    info('Preparing Certificate', 'Generating certificate PDA...');

    try {
      // Generate PDA untuk certificate
      const certId = `cert-${vaultName}-${Date.now()}`;
      const [certificatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('certificate'), Buffer.from(certId)],
        programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), Buffer.from(vaultName)],
        programId
      );

      console.log('🎨 Minting certificate...', {
        certificateId: certId,
        vault: vaultName,
        certificatePda: certificatePda.toString()
      });

      info('Creating Transaction', 'Please approve the transaction in your wallet...');

      // Instruction data untuk mintCertificate (instruction discriminator biasanya 2)
      const instructionData = Buffer.concat([
        Buffer.from([2]), // mintCertificate instruction discriminator
        Buffer.from(certId, 'utf-8'), // certificate ID
        Buffer.from([0]), // null terminator
      ]);

      const instruction = {
        keys: [
          { pubkey: vaultPda, isSigner: false, isWritable: false },
          { pubkey: certificatePda, isSigner: false, isWritable: true },
          { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        ],
        programId: programId,
        data: instructionData,
      };

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      console.log('📤 Sending certificate minting transaction...');
      
      const signature = await wallet.sendTransaction(transaction, connection, {
        skipPreflight: true,
        maxRetries: 3
      });
      
      info('Confirming Transaction', 'Waiting for blockchain confirmation...');
      
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('✅ Certificate minted! Signature:', signature);
      
      setCertificateId(certId);
      
      success(
        'Certificate Minted Successfully!',
        `Certificate ID: ${certId}`,
        8000
      );

      setTimeout(() => {
        success(
          'Transaction Confirmed',
          `View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`,
          10000
        );
      }, 1000);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('❌ Certificate minting failed:', message);
      
      if (message.includes('User rejected') || message.includes('User cancelled')) {
        error('Transaction Cancelled', 'You rejected the transaction');
      } else {
        error(
          'Certificate Minting Failed',
          message.length > 100 ? `${message.substring(0, 100)}...` : message
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <h4 className="font-semibold text-purple-400 mb-2">📜 Mint Certificate</h4>
        <p className="text-sm text-purple-300">Please connect wallet to mint certificates</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="font-semibold text-purple-400 mb-2">📜 Mint Certificate</h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-purple-300 mb-1 block">Select Vault</label>
          <select
            value={vaultName}
            onChange={(e) => setVaultName(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm"
          >
            <option value="plastic-waste">♻️ Plastic Waste Vault</option>
            <option value="e-waste">🔌 E-Waste Vault</option>
            <option value="carbon-credit">🌱 Carbon Credit Vault</option>
          </select>
        </div>
        
        <LoadingButton
          onClick={mintCertificate}
          isLoading={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3"
          loadingText="Minting Certificate..."
        >
          <span className="text-lg">📜</span>
          <span>Mint Environmental Certificate</span>
        </LoadingButton>
        
        {certificateId && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <h5 className="font-semibold text-green-400 mb-1">✅ Certificate Created</h5>
            <p className="text-xs text-green-300">ID: {certificateId}</p>
          </div>
        )}
        
        <div className="text-xs text-purple-300 space-y-1">
          <p>🎨 Mint NFT certificates for contributions</p>
          <p>📊 Track environmental impact</p>
          <p>🏆 Showcase your eco-friendly actions</p>
        </div>
      </div>
    </motion.div>
  );
}
