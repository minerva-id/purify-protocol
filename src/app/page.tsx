"use client";

// =============================================
// REACT & ANIMATION IMPORTS
// =============================================
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// =============================================
// UI COMPONENTS & ICONS IMPORTS
// =============================================
import { Leaf, Zap, Globe2, Trophy, Users, Coins, Shield, Sparkles, FileText, Languages, Menu, X } from "lucide-react";

// =============================================
// WALLET & BLOCKCHAIN IMPORTS
// =============================================
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

// =============================================
// CUSTOM COMPONENTS IMPORTS
// =============================================
import ImageLogo from "@/components/common/ImageLogo";

// =============================================
// NEXT.JS & NAVIGATION IMPORTS
// =============================================
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// =============================================
// INTERNATIONALIZATION IMPORTS
// =============================================
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';

// =============================================
// BACKGROUND PARTICLE CONFIGURATION
// =============================================
// Fixed particles untuk background animation
const fixedParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: 2 + (i * 0.3),
  height: 2 + (i * 0.25),
  left: 5 + (i * 4.7),
  top: 5 + (i * 4.5),
}));

// =============================================
// LANGUAGE SWITCHER COMPONENT
// =============================================
function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const baseDropdown = "absolute top-full right-0 mt-2 w-32 bg-[#03150f] border border-emerald-700/30 rounded-lg shadow-xl transition-all duration-200 z-50 backdrop-blur-sm";
  const visibility = open ? 'opacity-100 visible' : 'opacity-0 invisible';

  return (
    <div className="relative group" ref={langRef}>
      {/* Language switcher button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200 px-3 py-2 rounded-lg border border-emerald-800/30 hover:border-emerald-600/50"
      >
        <Languages size={18} />
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
      </button>
      
      {/* Dropdown language options */}
      <div className={`${baseDropdown} ${visibility} md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible`}>
        <button
          onClick={() => { setLocale('en'); setOpen(false); }}
          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
            locale === 'en' 
              ? 'bg-emerald-600 text-white' 
              : 'text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'
          } first:rounded-t-lg last:rounded-b-lg`}
        >
          English
        </button>
        <button
          onClick={() => { setLocale('id'); setOpen(false); }}
          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
            locale === 'id' 
              ? 'bg-emerald-600 text-white' 
              : 'text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'
          } first:rounded-t-lg last:rounded-b-lg`}
        >
          Indonesia
        </button>
      </div>
    </div>
  );
}

// =============================================
// MAIN LANDING PAGE COMPONENT
// =============================================
export default function PurifyLanding() {
  // =============================================
  // STATE MANAGEMENT
  // =============================================
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // =============================================
  // WALLET & ROUTING HOOKS
  // =============================================
  const { connected } = useWallet();
  const router = useRouter();
  
  // =============================================
  // INTERNATIONALIZATION HOOKS
  // =============================================
  const { locale } = useLanguage();
  const t = useTranslations(locale);

  // =============================================
  // REF FOR WALLET BUTTON
  // =============================================
  const walletButtonRef = useRef<HTMLButtonElement>(null);

  // =============================================
  // USE EFFECT FOR CLIENT-SIDE DETECTION
  // =============================================
  useEffect(() => {
    setIsClient(true);
  }, []);

  // =============================================
  // PROTOCOL STATISTICS DATA
  // =============================================
  const protocolStats = [
    { icon: <Coins size={24} />, label: t('stats.totalPurged'), value: "1.2M", unit: t('stats.tokens') },
    { icon: <Users size={24} />, label: t('stats.activePurifiers'), value: "189", unit: t('stats.users') },
    { icon: <Trophy size={24} />, label: t('stats.certificates'), value: "458", unit: t('stats.nfts') },
    { icon: <Shield size={24} />, label: t('stats.securityScore'), value: "100%", unit: t('stats.safe') },
  ];

  // =============================================
  // NAVIGATION HANDLERS
  // =============================================
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleWhitepaperClick = () => {
    router.push('/whitepaper');
  };

  // =============================================
  // WALLET MODAL HANDLER
  // =============================================
  const handleLaunchAppClick = () => {
    if (connected) {
      handleGoToDashboard();
    } else {
      // Trigger wallet connection modal dengan approach yang lebih robust
      const walletButtons = document.querySelectorAll('.wallet-adapter-button');
      if (walletButtons.length > 0) {
        // Gunakan button pertama yang ditemukan
        const walletButton = walletButtons[0] as HTMLButtonElement;
        if (walletButton && typeof walletButton.click === 'function') {
          walletButton.click();
        }
      } else {
        // Fallback: coba cari button dengan attribute tertentu
        const fallbackWalletButton = document.querySelector('button[data-wallet-adapter]') as HTMLButtonElement;
        if (fallbackWalletButton && typeof fallbackWalletButton.click === 'function') {
          fallbackWalletButton.click();
        }
      }
    }
  };

  // =============================================
  // LOADING FALLBACK UI
  // =============================================
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

  // =============================================
  // MAIN COMPONENT RENDER
  // =============================================
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white overflow-hidden font-sans">
      
      {/* ============================================= */}
      {/* BACKGROUND PARTICLES ANIMATION */}
      {/* ============================================= */}
      <div className="Absolute inset-0 overflow-hidden">
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

      {/* ============================================= */}
      {/* HEADER SECTION WITH NAVIGATION */}
      {/* ============================================= */}
      <motion.header 
        className="sticky top-0 z-50 border-b border-emerald-800/30 bg-[#03150f]/80 backdrop-blur-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            
            {/* Logo Section - Left Side */}
            <button
              className="flex items-center"
              onClick={() => router.push('/')}
              aria-label="Go to Home"
            >
              <ImageLogo />
            </button>
            
            {/* Navigation & Actions - Right Side */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6 mr-4">
                  <Link 
                    href="/whitepaper" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <FileText size={16} />
                    <span>{t('nav.whitepaper')}</span>
                  </Link>
                  <Link 
                    href="/docs" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {t('nav.docs')}
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {t('nav.about')}
                  </Link>
                </nav>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Dashboard Button (Visible when wallet connected) */}
                {connected && (
                  <motion.button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoToDashboard}
                  >
                    {t('nav.dashboard')}
                  </motion.button>
                )}
                
                {/* Wallet Connection Button */}
                <WalletMultiButton 
                  className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !px-8 !py-3 !rounded-full !text-lg !shadow-lg !shadow-emerald-500/30"
                />
              </div>
              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg border border-emerald-800/30 text-emerald-300 hover:text-emerald-400 hover:border-emerald-600/50"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {mobileOpen && (
            <div className="md:hidden mt-2 border-t border-emerald-800/30 bg-[#03150f]/95 rounded-b-xl shadow-lg">
              <div className="p-4 space-y-4">
                <nav className="flex flex-col space-y-2">
                  <Link 
                    href="/whitepaper" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors flex items-center space-x-2"
                  >
                    <FileText size={16} />
                    <span>{t('nav.whitepaper')}</span>
                  </Link>
                  <Link 
                    href="/docs" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {t('nav.docs')}
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {t('nav.about')}
                  </Link>
                </nav>
                <LanguageSwitcher />
                {connected ? (
                  <motion.button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoToDashboard}
                  >
                    {t('nav.dashboard')}
                  </motion.button>
                ) : (
                  <WalletMultiButton className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !px-8 !py-3 !rounded-full !text-lg !shadow-lg !shadow-emerald-500/30 !w-full !justify-center" />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.header>

      {/* ============================================= */}
      {/* HERO SECTION - MAIN LANDING CONTENT */}
      {/* ============================================= */}
      <motion.section
        className="relative flex flex-col items-center justify-center text-center py-32 px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        
        {/* Main Title with Animation */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg mb-6">
            {t('hero.title')}
          </h1>

          {/* Decorative Sparkles Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="text-yellow-400" size={32} />
          </motion.div>
        </motion.div>

        {/* Hero Subtitle */}
        <motion.p
          className="max-w-2xl text-gray-300 text-lg mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* ============================================= */}
        {/* PROTOCOL STATISTICS GRID */}
        {/* ============================================= */}
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
              {/* Stat Icon with Hover Animation */}
              <div className="text-emerald-400 mb-2 flex justify-center">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              
              {/* Stat Value and Labels */}
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-emerald-400">{stat.unit}</div>
            </motion.div>
          ))}
        </div>

        {/* ============================================= */}
        {/* CALL-TO-ACTION BUTTONS */}
        {/* ============================================= */}
        <div className="flex gap-4 flex-wrap justify-center">
          
          {/* Main CTA Button - Launch App / Go to Dashboard */}
          <motion.button 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLaunchAppClick}
          >
            <Zap size={20} />
            <span>{connected ? t('hero.goToDashboard') : t('hero.launchApp')}</span>
          </motion.button>
          
          {/* Secondary CTA Button - Whitepaper */}
          <motion.button 
            className="bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-8 py-3 rounded-full text-lg transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhitepaperClick}
          >
            <FileText size={20} />
            <span>{t('hero.readWhitepaper')}</span>
          </motion.button>
        </div>
      </motion.section>

      {/* ============================================= */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================= */}
      <section className="py-24 px-6 text-center z-10 relative">
        
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-emerald-400 mb-4">{t('howItWorks.title')}</h2>
        <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
          {t('howItWorks.subtitle')}
        </p>
        
        {/* Process Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Leaf size={40} />, title: t('howItWorks.step1.title'), desc: t('howItWorks.step1.desc') },
            { icon: <Zap size={40} />, title: t('howItWorks.step2.title'), desc: t('howItWorks.step2.desc') },
            { icon: <Globe2 size={40} />, title: t('howItWorks.step3.title'), desc: t('howItWorks.step3.desc') },
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
              {/* Step Icon */}
              <div className="text-emerald-400 mb-4 flex justify-center">{step.icon}</div>
              
              {/* Step Title & Description */}
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================= */}
      {/* CALL-TO-ACTION SECTION */}
      {/* ============================================= */}
      <section className="py-20 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-y border-emerald-700/30">
        <div className="container mx-auto px-6 text-center">
          
          {/* CTA Title */}
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            {t('cta.title')}
          </h2>
          
          {/* CTA Subtitle */}
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            
            {/* Wallet Connection CTA */}
            <WalletMultiButton 
              className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !px-8 !py-3 !rounded-full !text-lg !shadow-lg !shadow-emerald-500/30"
            />
            
            {/* Learn More CTA */}
            <motion.button 
              className="bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-6 py-4 rounded-full text-lg transition-all duration-200 flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhitepaperClick}
            >
              <FileText size={20} />
              <span>{t('cta.learnMore')}</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FOOTER SECTION */}
      {/* ============================================= */}
      <footer className="py-12 text-center text-sm text-gray-500 border-t border-emerald-800/30 bg-[#03150f] relative z-10">
        <div className="container mx-auto px-6">
          
          {/* Footer Content Layout */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Left Section - Protocol Info */}
            <div className="text-left">
              <p className="text-emerald-400 font-semibold mb-2">{t('footer.tagline')}</p>
              <div className="flex flex-wrap justify-center md:justify-start space-x-4 text-xs">
                <span>📍 {t('footer.live')}</span>
                <span>🔐 {t('footer.audited')}</span>
                <span>🔄 {t('footer.version')}</span>
                <span>🌱 {t('footer.carbonNeutral')}</span>
              </div>
            </div>
            
            {/* Right Section - Footer Links */}
            <div className="flex space-x-6">
              <Link href="/whitepaper" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {t('nav.whitepaper')}
              </Link>
              <Link href="/docs" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {t('nav.docs')}
              </Link>
              <Link href="/about" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                {t('nav.about')}
              </Link>
            </div>
          </div>
          
          {/* Copyright Notice */}
          <div className="mt-6 pt-6 border-t border-emerald-800/20">
            <p className="text-xs text-gray-600">
              {locale === 'id' 
                ? '© 2025 Purify Protocol. Semua hak dilindungi.'
                : '© 2025 Purify Protocol. All rights reserved.'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}