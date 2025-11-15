"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Leaf, Zap, Globe2, Trophy, Users, Coins, Shield, Sparkles } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import PurifyLogo from "@/components/PurifyLogo";

// Fixed particles data
const fixedParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: 2 + (i * 0.3),
  height: 2 + (i * 0.25),
  left: 5 + (i * 4.7),
  top: 5 + (i * 4.5),
}));

export default function PurifyLanding() {
  const [isClient, setIsClient] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const protocolStats = [
    { icon: <Coins size={24} />, label: "Total Purged", value: "1.2M", unit: "Tokens" },
    { icon: <Users size={24} />, label: "Active Purifiers", value: "189", unit: "Users" },
    { icon: <Trophy size={24} />, label: "Certificates", value: "458", unit: "NFTs" },
    { icon: <Shield size={24} />, label: "Security Score", value: "100%", unit: "Safe" },
  ];

  // Simple wallet state management
  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleGoToDashboard = () => {
    window.location.href = '/dashboard';
  };

  // Fallback loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400">Loading Purify Protocol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white overflow-hidden font-sans">
      
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {fixedParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-emerald-400/20"
            style={{
              width: particle.width,
              height: particle.height,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + (particle.id * 0.3),
              repeat: Infinity,
              delay: particle.id * 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-20 border-b border-emerald-800/30 bg-[#03150f]/80 backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <PurifyLogo />
            
            {/* Simple Wallet Button - No useWallet hook */}
            <div className="wallet-button-container">
              <WalletMultiButton 
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !px-6 !py-2 !rounded-lg !transition-colors !duration-200"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center py-32 px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg mb-6">
            Purify the Blockchain.
          </h1>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="text-yellow-400" size={32} />
          </motion.div>
        </motion.div>

        <motion.p
          className="max-w-2xl text-gray-300 text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Mengubah token rusak menjadi nilai murni. <br />
          Protokol hijau pertama di Solana untuk ekosistem yang bersih dan berkelanjutan.
        </motion.p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          {protocolStats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-emerald-400 mb-2 flex justify-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-emerald-400">{stat.unit}</div>
            </motion.div>
          ))}
        </div>

        {/* Buttons - Simplified tanpa wallet state */}
        <div className="flex gap-4">
          <motion.button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={20} />
            <span>Launch Purify App</span>
          </motion.button>
          
          <motion.button 
            className="bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-8 py-3 rounded-full text-lg transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read Whitepaper
          </motion.button>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-24 px-6 text-center z-10 relative">
        <h2 className="text-4xl font-bold text-emerald-400 mb-4">How Purify Works</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          Protokol DeFi pertama yang mendaur ulang token rug menjadi nilai yang berguna
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Leaf size={40} />, title: "Deposit Dead Tokens", desc: "Kirim token rug/scam ke Vault Purify yang aman" },
            { icon: <Zap size={40} />, title: "Automatic Recycling", desc: "Protokol mendaur ulang token menjadi PURE tokens" },
            { icon: <Globe2 size={40} />, title: "Earn Rewards", desc: "Dapatkan PURE tokens + Exclusive NFT Certificate" },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="bg-[#102620]/70 backdrop-blur-md rounded-2xl p-8 border border-emerald-700/30 shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-emerald-400 mb-4 flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-y border-emerald-700/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            Ready to Clean the Blockchain?
          </h2>
          
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users already purifying the Solana ecosystem
          </p>
          
          <div className="flex gap-4 justify-center">
            <WalletMultiButton 
              className="!bg-gradient-to-r !from-emerald-500 !to-cyan-500 !text-white !px-8 !py-4 !rounded-full !text-lg !font-semibold !shadow-lg"
            />
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-gray-500 border-t border-emerald-800/30 bg-[#03150f]">
        <div className="container mx-auto px-6">
          <p className="mb-4">Purify Protocol (PURE) — The Green Blockchain Recycling Protocol</p>
          <div className="flex justify-center space-x-6 text-xs">
            <span>📍 Live on DevNet</span>
            <span>🔐 Audited</span>
            <span>🔄 v1.0.0</span>
            <span>🌱 Carbon Neutral</span>
          </div>
        </div>
      </footer>
    </div>
  );
}