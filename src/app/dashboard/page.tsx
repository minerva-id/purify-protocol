"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { Coins, Trophy, TrendingUp, Activity, Zap, Sparkles, Languages, Home, Menu, X } from "lucide-react";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import ImageLogo from "@/components/common/ImageLogo";
import { VaultManager } from "@/components/VaultManager/VaultManager";
import TokenDeposit from "@/components/purify/TokenDeposit";
import TestConnection from "@/components/purify/TestConnection";
import CertificateMinting from '@/components/purify/CertificateMinting';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';

// Fixed particles data
const fixedParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: 2 + (i * 0.3),
  height: 2 + (i * 0.25),
  left: 5 + (i * 4.7),
  top: 5 + (i * 4.5),
}));

// Header is provided globally via `src/components/common/Header` and rendered in layout

// Mock data untuk dashboard
const mockDashboardData = {
  portfolio: {
    totalValue: 2450.75,
    todayChange: "+5.2%",
    tokens: [
      { name: 'SOL', amount: 12.5, value: 1875.00, change: '+2.5%', color: 'bg-purple-500' },
      { name: 'USDC', amount: 500.00, value: 500.00, change: '0%', color: 'bg-blue-500' },
      { name: 'PURIFY', amount: 1000, value: 75.75, change: '+15.3%', color: 'bg-emerald-500' },
    ],
  },
  burningStats: {
    totalBurned: "1,250",
    purifyBurned: "600",
    impact: "+8.7%",
    weeklyActivity: [45, 52, 48, 60, 55, 58, 52],
  },
  recentActivity: [
    { type: 'burn', token: 'SOL', amount: 0.5, date: '2025-01-15', impact: '+1.2%' },
    { type: 'burn', token: 'PURIFY', amount: 100, date: '2025-01-14', impact: '+0.8%' },
    { type: 'reward', token: 'PURIFY', amount: 25, date: '2025-01-13', impact: 'Reward' },
    { type: 'stake', token: 'SOL', amount: 5.0, date: '2025-01-12', impact: 'Staked' },
  ],
  achievements: [
    { name: 'First Purge', unlocked: true, icon: '🔥' },
    { name: 'Eco Warrior', unlocked: true, icon: '🌱' },
    { name: 'Volume Master', unlocked: false, icon: '📊' },
    { name: 'Community Leader', unlocked: false, icon: '👑' },
  ]
};

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(() => typeof window !== 'undefined');
  const [activeTab, setActiveTab] = useState('portfolio');
  const { locale } = useLanguage();
  const t = useTranslations(locale);
  const { connected, publicKey } = useWallet();
  const router = useRouter();

  // client detection handled by initial state

  // ✅ ADD EFFECT UNTUK HANDLE WALLET DISCONNECT
  useEffect(() => {
    if (isClient && !connected) {
      // Redirect ke homepage jika wallet disconnected
      console.log('Wallet disconnected, redirecting to home...');
      const timer = setTimeout(() => {
        router.push('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [connected, isClient, router]);

  // Dashboard-specific translations
  const dashboardTranslations = {
    en: {
      welcomeTitle: "My Purify Dashboard",
      welcomeSubtitle: "Track your portfolio performance, burning impact, and eco-friendly achievements",
      portfolioValue: "Portfolio Value",
      totalBurned: "Total Burned",
      scarcityImpact: "Scarcity Impact", 
      achievements: "Achievements",
      valueIncrease: "Value Increase",
      unlocked: "Unlocked",
      myPortfolio: "My Portfolio",
      tokens: "Tokens",
      staking: "Staking",
      recentActivity: "Recent Activity",
      purifyActions: "Purify Actions",
      protocolStatus: "🚀 Purify Protocol Status",
      smartContract: "Smart Contract: Deployed",
      vaultSystem: "Vault System: Active", 
      tokenBurning: "Token Burning: Ready",
      certificates: "Certificates: Enabled",
      network: "🌍 Network: Solana DevNet",
      backToHome: "Back to Home",
      loading: "Loading Dashboard...",
      accessDenied: "Please connect your wallet to access the dashboard",
      redirecting: "Redirecting to homepage...",
      burn: "burn",
      reward: "reward", 
      stake: "stake"
    },
    id: {
      welcomeTitle: "Dashboard Purify Saya",
      welcomeSubtitle: "Lacak performa portfolio, dampak pembakaran, dan pencapaian ramah lingkungan",
      portfolioValue: "Nilai Portfolio",
      totalBurned: "Total Dibakar",
      scarcityImpact: "Dampak Kelangkaan",
      achievements: "Pencapaian",
      valueIncrease: "Peningkatan Nilai",
      unlocked: "Terkunci",
      myPortfolio: "Portfolio Saya",
      tokens: "Token",
      staking: "Staking", 
      recentActivity: "Aktivitas Terbaru",
      purifyActions: "Aksi Purify",
      protocolStatus: "🚀 Status Purify Protocol",
      smartContract: "Smart Contract: Terdeploy",
      vaultSystem: "Sistem Vault: Aktif",
      tokenBurning: "Pembakaran Token: Siap",
      certificates: "Sertifikat: Diaktifkan",
      network: "🌍 Jaringan: Solana DevNet",
      backToHome: "Kembali ke Beranda",
      loading: "Memuat Dashboard...",
      accessDenied: "Silakan hubungkan wallet untuk mengakses dashboard",
      redirecting: "Mengalihkan ke beranda...",
      burn: "bakar",
      reward: "hadiah",
      stake: "staking"
    }
  };

  const dt = (key: keyof typeof dashboardTranslations.en) => 
    dashboardTranslations[locale][key] || dashboardTranslations.en[key];

  // Fallback loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400">{dt('loading')}</p>
        </div>
      </div>
    );
  }

  // ✅ ADD AUTH GUARD - Tampilkan loading/redirect jika tidak connected
  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-bold text-emerald-400 mb-4">
            {locale === 'id' ? 'Akses Ditolak' : 'Access Denied'}
          </h3>
          <p className="text-gray-300 mb-4">
            {dt('accessDenied')}
          </p>
          <p className="text-emerald-400 text-sm animate-pulse">
            {dt('redirecting')}
          </p>
          <div className="mt-6">
            <WalletMultiButton className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !px-8 !py-3 !rounded-full !text-lg !shadow-lg !shadow-emerald-500/30 !mx-auto" />
          </div>
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

      {/* Header provided globally in RootLayout/Header */}

      {/* Dashboard Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Welcome Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {dt('welcomeTitle')}
          </motion.h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {dt('welcomeSubtitle')}
          </p>
        </motion.div>

        {/* Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <Coins className="text-emerald-400" size={24} />, 
              label: dt('portfolioValue'), 
              value: `$${mockDashboardData.portfolio.totalValue.toLocaleString()}`, 
              change: mockDashboardData.portfolio.todayChange,
              changeColor: "text-green-400"
            },
            { 
              icon: <Activity className="text-orange-400" size={24} />, 
              label: dt('totalBurned'), 
              value: mockDashboardData.burningStats.totalBurned, 
              change: mockDashboardData.burningStats.purifyBurned + " PURE",
              changeColor: "text-emerald-400"
            },
            { 
              icon: <TrendingUp className="text-cyan-400" size={24} />, 
              label: dt('scarcityImpact'), 
              value: mockDashboardData.burningStats.impact, 
              change: dt('valueIncrease'),
              changeColor: "text-green-400"
            },
            { 
              icon: <Trophy className="text-yellow-400" size={24} />, 
              label: dt('achievements'), 
              value: "2/4", 
              change: dt('unlocked'),
              changeColor: "text-yellow-400"
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20 relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  {stat.icon}
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Sparkles className="text-emerald-400/50" size={16} />
                </motion.div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className={`text-xs font-semibold ${stat.changeColor}`}>{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Portfolio & Activity */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Portfolio Tokens */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{dt('myPortfolio')}</h2>
                <div className="flex space-x-2">
                  {['portfolio', 'staking'].map(tab => (
                    <button
                      key={tab}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'portfolio' ? dt('tokens') : dt('staking')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {mockDashboardData.portfolio.tokens.map((token, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"
                    whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full ${token.color} flex items-center justify-center`}>
                        <Zap size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{token.name}</div>
                        <div className="text-gray-400 text-sm">{token.amount} {locale === 'id' ? 'token' : 'tokens'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">${token.value.toLocaleString()}</div>
                      <div className={token.change.includes('+') ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                        {token.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{dt('recentActivity')}</h2>
              <div className="space-y-4">
                {mockDashboardData.recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'burn' ? 'bg-orange-500/20 text-orange-400' :
                        activity.type === 'reward' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {activity.type === 'burn' ? '🔥' : activity.type === 'reward' ? '🎁' : '🔒'}
                      </div>
                      <div>
                        <div className="font-semibold text-white capitalize">
                          {dt(activity.type as keyof typeof dashboardTranslations.en)} {activity.amount} {activity.token}
                        </div>
                        <div className="text-gray-400 text-sm">{activity.date}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      activity.impact.includes('+') ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {activity.impact}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Purify Actions & Achievements */}
          <div className="space-y-8">
            
            {/* Achievements */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{dt('achievements')}</h2>
              <div className="space-y-4">
                {mockDashboardData.achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-4 p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className={`font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                        {achievement.name}
                      </div>
                      <div className={`text-xs ${achievement.unlocked ? 'text-emerald-400' : 'text-gray-500'}`}>
                        {achievement.unlocked ? dt('unlocked') : 'Locked'}
                      </div>
                    </div>
                    {achievement.unlocked && (
                      <Sparkles size={16} className="text-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Purify Actions Section */}
            <motion.div 
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{dt('purifyActions')}</h2>
              <div className="space-y-6">
                
                {/* Test Connection */}
                <TestConnection />
                
                {/* Vault Creation */}
                <VaultManager />
                
                {/* Token Deposit/Burning */}
                <TokenDeposit />
                
                {/* Certificate Minting */}
                <CertificateMinting />

                {/* Info Panel */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <h4 className="font-semibold text-emerald-400 mb-2">{dt('protocolStatus')}</h4>
                  <div className="text-xs space-y-1">
                    <p className="text-emerald-300">✅ {dt('smartContract')}</p>
                    <p className="text-emerald-300">✅ {dt('vaultSystem')}</p>
                    <p className="text-emerald-300">✅ {dt('tokenBurning')}</p>
                    <p className="text-emerald-300">✅ {dt('certificates')}</p>
                    <p className="text-cyan-300">{dt('network')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}