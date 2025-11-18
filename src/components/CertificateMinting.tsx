"use client";

import { useState } from 'react';
import { usePurifyProgram } from '@/hooks/usePurifyProgram';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion } from 'framer-motion';

export default function CertificateMinting() {
  const { programId, wallet, connection, Transaction } = usePurifyProgram();
  const [vaultName, setVaultName] = useState('plastic-waste');
  const [isLoading, setIsLoading] = useState(false);
  const [certificateId, setCertificateId] = useState('');

  const mintCertificate = async () => {
    if (!wallet.connected || !wallet.publicKey || !wallet.sendTransaction) {
      alert('Please connect wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Generate PDA untuk certificate
      const certificateId = `cert-${vaultName}-${Date.now()}`;
      const [certificatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('certificate'), Buffer.from(certificateId)],
        programId
      );

      const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('vault'), Buffer.from(vaultName)],
        programId
      );

      console.log('🎨 Minting certificate...', {
        certificateId,
        vault: vaultName,
        certificatePda: certificatePda.toString()
      });

      // Instruction data untuk mintCertificate (instruction discriminator biasanya 2)
      const instructionData = Buffer.concat([
        Buffer.from([2]), // mintCertificate instruction discriminator
        Buffer.from(certificateId, 'utf-8'), // certificate ID
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
      
      console.log('✅ Certificate minted! Signature:', signature);
      
      setCertificateId(certificateId);
      alert(`🎉 Environmental Certificate Minted!\n\n📜 Certificate ID: ${certificateId}\n✅ Transaction: ${signature}\n\n🔍 View on Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`);

    } catch (error: any) {
      console.error('❌ Certificate minting failed:', error);
      alert(`❌ Failed to mint certificate: ${error.message}`);
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
        
        <motion.button
          onClick={mintCertificate}
          disabled={isLoading}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Minting Certificate...</span>
            </>
          ) : (
            <>
              <span className="text-lg">📜</span>
              <span>Mint Environmental Certificate</span>
            </>
          )}
        </motion.button>
        
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