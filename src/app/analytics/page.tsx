"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Coins, 
  Flame,
  BarChart3,
  PieChart,
  Clock,
  Award,
  Zap,
  Globe
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useProtocolStats } from '@/hooks/useOnChainData';

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('24h');
  const { connected } = useWallet();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = useTranslations(locale);
  const { stats, loading: statsLoading } = useProtocolStats();

  // Calculate derived metrics
  const analytics = {
    protocol: {
      totalVaults: stats.totalVaults,
      totalDeposited: stats.totalDeposited,
      totalBurned: stats.totalBurned,
      activeVaults: stats.activeVaults,
      totalValue: stats.totalDeposited + stats.totalBurned, // Simplified calculation
    },
    trends: {
      deposits24h: 0, // Would need event filtering for 24h data
      burns24h: 0,
      newUsers24h: 0,
      certificates24h: 0,
    },
    distribution: {
      deposits: stats.totalDeposited > 0 
        ? Math.round((stats.totalDeposited / (stats.totalDeposited + stats.totalBurned)) * 100)
        : 0,
      burns: stats.totalBurned > 0
        ? Math.round((stats.totalBurned / (stats.totalDeposited + stats.totalBurned)) * 100)
        : 0,
    },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !connected) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [connected, isClient, router]);

  if (!isClient || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Analytics..." />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-400 mb-4">Please connect your wallet to view analytics</p>
          <p className="text-gray-400 text-sm">Redirecting to homepage...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white overflow-hidden font-sans">
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Page Title - UPDATED FOR MOBILE RESPONSIVENESS */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Changed layout: Stack vertically on mobile, horizontal on sm/desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {locale === 'id' ? 'Analitik Protokol' : 'Protocol Analytics'}
              </h1>
              <p className="text-gray-300">
                {locale === 'id' 
                  ? 'Statistik real-time dan metrik performa protokol' 
                  : 'Real-time statistics and protocol performance metrics'
                }
              </p>
            </div>
            
            {/* Time Range Selector - Scrollable on very small screens if needed */}
            <div className="flex space-x-2 bg-white/5 rounded-lg p-1 border border-emerald-500/20 w-full sm:w-auto overflow-x-auto no-scrollbar">
              {(['24h', '7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-1 sm:flex-none text-center ${
                    timeRange === range
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <Coins className="text-emerald-400" size={24} />,
              label: locale === 'id' ? 'Total Disetor' : 'Total Deposited',
              value: formatNumber(analytics.protocol.totalDeposited),
              change: 'Live',
              changeType: 'positive' as const,
            },
            {
              icon: <Flame className="text-orange-400" size={24} />,
              label: locale === 'id' ? 'Total Dibakar' : 'Total Burned',
              value: formatNumber(analytics.protocol.totalBurned),
              change: 'Live',
              changeType: 'positive' as const,
            },
            {
              icon: <Users className="text-cyan-400" size={24} />,
              label: locale === 'id' ? 'Vault Aktif' : 'Active Vaults',
              value: analytics.protocol.activeVaults.toString(),
              change: 'Live',
              changeType: 'positive' as const,
            },
            {
              icon: <Award className="text-yellow-400" size={24} />,
              label: locale === 'id' ? 'Total Vault' : 'Total Vaults',
              value: analytics.protocol.totalVaults.toString(),
              change: 'Live',
              changeType: 'positive' as const,
            },
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  {metric.icon}
                </div>
                <div className={`text-xs font-semibold ${
                  metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Charts */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Protocol Overview */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="text-emerald-400" size={24} />
                  <span>{locale === 'id' ? 'Ringkasan Protokol' : 'Protocol Overview'}</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">
                    {locale === 'id' ? 'Total Vault' : 'Total Vaults'}
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {analytics.protocol.totalVaults}
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">
                    {locale === 'id' ? 'Nilai Total' : 'Total Value'}
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {formatNumber(analytics.protocol.totalValue)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Top Vaults */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <PieChart className="text-emerald-400" size={24} />
                <span>{locale === 'id' ? 'Statistik Protokol' : 'Protocol Statistics'}</span>
              </h2>
              
              <div className="space-y-4">
                {/* Placeholder - would need to fetch individual vaults for top vaults */}
                <div className="bg-black/20 rounded-lg p-4 text-center text-gray-400">
                  {locale === 'id' 
                    ? 'Data vault individual akan ditampilkan setelah implementasi lengkap'
                    : 'Individual vault data will be displayed after full implementation'
                  }
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Trends */}
          <div className="space-y-8">
            
            {/* 24h Trends */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="text-emerald-400" size={24} />
                <span>{locale === 'id' ? 'Tren 24 Jam' : '24h Trends'}</span>
              </h2>
              
              <div className="space-y-4">
                {[
                  { label: locale === 'id' ? 'Total Deposito' : 'Total Deposits', value: formatNumber(analytics.protocol.totalDeposited), icon: <Coins size={16} /> },
                  { label: locale === 'id' ? 'Total Pembakaran' : 'Total Burns', value: formatNumber(analytics.protocol.totalBurned), icon: <Flame size={16} /> },
                  { label: locale === 'id' ? 'Vault Aktif' : 'Active Vaults', value: analytics.protocol.activeVaults, icon: <Users size={16} /> },
                  { label: locale === 'id' ? 'Total Vault' : 'Total Vaults', value: analytics.protocol.totalVaults, icon: <Award size={16} /> },
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-emerald-400">{trend.icon}</div>
                      <span className="text-gray-300 text-sm">{trend.label}</span>
                    </div>
                    <span className="text-white font-semibold">{trend.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Clock className="text-emerald-400" size={24} />
                <span>{locale === 'id' ? 'Aktivitas Terbaru' : 'Recent Activity'}</span>
              </h2>
              
              <div className="space-y-3">
                {/* Placeholder - would need event filtering for recent activity */}
                <div className="text-center text-gray-400 text-sm py-4">
                  {locale === 'id' 
                    ? 'Aktivitas terbaru akan ditampilkan setelah implementasi event filtering'
                    : 'Recent activity will be displayed after event filtering implementation'
                  }
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Distribution Chart */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <PieChart className="text-emerald-400" size={24} />
            <span>{locale === 'id' ? 'Distribusi Aktivitas' : 'Activity Distribution'}</span>
          </h2>
          
          {/* UPDATED FOR MOBILE: Changed from grid-cols-2 to grid-cols-1 on mobile, grid-cols-2 on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                  <span className="text-gray-300">{locale === 'id' ? 'Deposito' : 'Deposits'}</span>
                </div>
                  <span className="text-white font-semibold">{analytics.distribution.deposits}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-emerald-500 h-4 rounded-full"
                  style={{ width: `${analytics.distribution.deposits}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span className="text-gray-300">{locale === 'id' ? 'Pembakaran' : 'Burns'}</span>
                </div>
                <span className="text-white font-semibold">{analytics.distribution.burns}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-orange-500 h-4 rounded-full"
                  style={{ width: `${analytics.distribution.burns}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
