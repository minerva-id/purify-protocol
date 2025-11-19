// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { 
  Leaf, 
  Shield, 
  Users, 
  Globe2, 
  Target,
  Zap,
  Trophy,
  Recycle,
  Cpu,
  Wallet,
  Award,
  Sparkles,
  FileText,
  Languages,
  Menu,
  X
} from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import ImageLogo from "@/components/common/ImageLogo";

// Background particles configuration
const fixedParticles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width: 2 + (i * 0.3),
  height: 2 + (i * 0.25),
  left: 5 + (i * 6),
  top: 5 + (i * 5),
}));

// Language Switcher Component (inline dalam file yang sama)
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
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200 px-3 py-2 rounded-lg border border-emerald-800/30 hover:border-emerald-600/50"
      >
        <Languages size={18} />
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
      </button>
      
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

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const { connected } = useWallet();
  const t = useTranslations(locale);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const teamMembers = [
    {
      name: "Minerva",
      role: "Founder & CEO", 
      bio: "Visionary leader dengan latar belakang blockchain engineering dan sustainability tech. Menginisiasi Purify Protocol untuk menyelesaikan masalah ecological debt di ekosistem Web3.",
      expertise: ["Blockchain Architecture", "Sustainability Tech", "Protocol Design"]
    },
    {
      name: "Bambang Irawan",
      role: "Head of Marketing & Partnership",
      bio: "Marketing strategist dengan jejak terbukti dalam membangun brand awareness dan jaringan partnership di ekosistem blockchain Asia Tenggara.",
      expertise: ["Growth Strategy", "Partnership Development", "Community Building"]
    },
    {
      name: "Aria Kusmana",
      role: "Head of Sustainability",
      bio: "Environmental scientist dan carbon credit expert, memastikan setiap token yang dipurify memberikan dampak lingkungan yang terukur dan terverifikasi.",
      expertise: ["Carbon Accounting", "Environmental Impact", "ESG Compliance"]
    }
  ];

  const protocolFeatures = [
    {
      icon: <Recycle size={32} />,
      title: "Token Recycling",
      description: "Mengubah token mati menjadi sertifikat NFT bernilai melalui mekanisme vault yang aman dan terdesentralisasi"
    },
    {
      icon: <Shield size={32} />,
      title: "Transparent Verification",
      description: "Semua aktivitas pembersihan tercatat on-chain dengan bukti yang dapat diverifikasi oleh siapa saja"
    },
    {
      icon: <Cpu size={32} />,
      title: "Blockchain Efficiency",
      description: "Mengurangi penyumbatan storage blockchain dan meningkatkan performa jaringan secara keseluruhan"
    },
    {
      icon: <Trophy size={32} />,
      title: "Economic Incentives",
      description: "Sistem reward yang mendorong partisipasi aktif dalam menjaga kebersihan ekosistem Web3"
    }
  ];

  const roadmap = [
    { 
      phase: "Phase 1: Foundation", 
      period: "Q4 2025",
      milestones: ["Core Protocol Development", "DevNet Deployment", "Basic Frontend Interface"],
      status: "completed"
    },
    { 
      phase: "Phase 2: Growth", 
      period: "Q1 2026", 
      milestones: ["MainNet Launch", "Advanced Features", "Community Building"],
      status: "current"
    },
    { 
      phase: "Phase 3: Expansion", 
      period: "Q2 2026", 
      milestones: ["Cross-chain Compatibility", "Governance System", "Mobile App"],
      status: "upcoming"
    },
    { 
      phase: "Phase 4: Maturity", 
      period: "Q4 2026", 
      milestones: ["DAO Transition", "Ecosystem Grants", "Protocol-owned Liquidity"],
      status: "upcoming"
    }
  ];

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
            className="absolute rounded-full bg-emerald-400/10"
            style={{
              width: particle.width,
              height: particle.height,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + (particle.id * 0.3),
              repeat: Infinity,
              delay: particle.id * 0.2,
            }}
          />
        ))}
      </div>

      {/* Header Section */}
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
<<<<<<< HEAD
              
              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6 mr-4">
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  href="/whitepaper" 
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
                >
                  <FileText size={16} />
                  <span>{t('nav.whitepaper')}</span>
                </Link>
                <Link 
                  href="/about" 
                  className="text-emerald-400 border-b-2 border-emerald-400 transition-colors duration-200"
                >
                  {t('nav.about')}
                </Link>
                <Link 
                  href="/docs" 
                  className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                >
                  {t('nav.docs')}
                </Link>
              </nav>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Dashboard Button (Visible when wallet connected) */}
              {connected && (
                <Link href="/dashboard">
                  <motion.button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
=======
              <div className="hidden md:flex items-center space-x-3">
                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center space-x-6 mr-4">
                  <Link 
                    href="/" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
>>>>>>> d75abbd (update struktur folder)
                  >
                    {t('nav.home')}
                  </Link>
                  <Link 
                    href="/whitepaper" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <FileText size={16} />
                    <span>{t('nav.whitepaper')}</span>
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-emerald-400 border-b-2 border-emerald-400 transition-colors duration-200"
                  >
                    {t('nav.about')}
                  </Link>
                  <Link 
                    href="/docs" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
                  >
                    {t('nav.docs')}
                  </Link>
                </nav>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Dashboard Button (Visible when wallet connected) */}
                {connected && (
                  <Link href="/dashboard">
                    <motion.button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t('nav.dashboard')}
                    </motion.button>
                  </Link>
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
                    href="/" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors"
                  >
                    {t('nav.home')}
                  </Link>
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
                  <Link href="/dashboard" className="block">
                    <motion.button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('nav.dashboard')}
                    </motion.button>
                  </Link>
                ) : (
                  <WalletMultiButton className="!bg-emerald-500 hover:!bg-emerald-600 !text-white !px-8 !py-3 !rounded-full !text-lg !shadow-lg !shadow-emerald-500/30 !w-full !justify-center" />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="relative py-24 text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <Sparkles className="text-yellow-400" size={32} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto px-6 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#102620]/70 backdrop-blur-md rounded-2xl p-8 border border-emerald-700/30"
          >
            <div className="flex items-center mb-6">
              <Target className="text-emerald-400 mr-3" size={32} />
              <h2 className="text-3xl font-bold text-white">
                {t('about.missionTitle')}
              </h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {t('about.missionText')}
            </p>
            <div className="flex items-center text-emerald-400">
              <Zap size={20} className="mr-2" />
              <span className="font-semibold">Building a Sustainable Web3 Future</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#102620]/70 backdrop-blur-md rounded-2xl p-8 border border-cyan-700/30"
          >
            <div className="flex items-center mb-6">
              <Globe2 className="text-cyan-400 mr-3" size={32} />
              <h2 className="text-3xl font-bold text-white">
                {t('about.visionTitle')}
              </h2>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {t('about.visionText')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Protocol Features */}
      <section className="relative py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center text-emerald-400 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('about.valuesTitle')}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locale === 'id' 
              ? 'Nilai-nilai inti yang mendorong misi kami membersihkan ekosistem blockchain'
              : 'Core values that drive our mission to clean the blockchain ecosystem'
            }
          </motion.p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protocolFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#102620]/70 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/30 group hover:border-emerald-500/50 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-emerald-400 mb-4 flex justify-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-16 px-6 max-w-6xl mx-auto z-10">
        <motion.h2 
          className="text-4xl font-bold text-center text-emerald-400 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('about.teamTitle')}
        </motion.h2>
        <motion.p
          className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {locale === 'id'
            ? 'Tim berpengalaman yang berdedikasi untuk membangun masa depan Web3 yang berkelanjutan'
            : 'Experienced team dedicated to building a sustainable Web3 future'
          }
        </motion.p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-[#102620]/70 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/30 text-center group hover:border-emerald-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {member.name}
              </h3>
              <p className="text-emerald-400 mb-4 font-medium">{member.role}</p>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {locale === 'id' ? member.bio : 
                  member.name === "Minerva" ? "Visionary leader with background in blockchain engineering and sustainability tech. Initiated Purify Protocol to solve ecological debt in Web3 ecosystem." :
                  member.name === "Bambang Irawan" ? "Marketing strategist with proven track record in building brand awareness and partnership networks in Southeast Asian blockchain ecosystem." :
                  "Environmental scientist and carbon credit expert, ensuring every purified token delivers measurable and verifiable environmental impact."
                }
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {member.expertise.map((skill, skillIndex) => (
                  <span key={skillIndex} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative py-16 bg-white/5 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-4xl font-bold text-center text-emerald-400 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('about.timelineTitle')}
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {locale === 'id'
              ? 'Perjalanan kami menuju ekosistem blockchain yang lebih bersih dan berkelanjutan'
              : 'Our journey towards a cleaner and more sustainable blockchain ecosystem'
            }
          </motion.p>
          
          <div className="space-y-8">
            {roadmap.map((phase, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row items-start"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                  <div className={`rounded-full p-4 mr-4 ${
                    phase.status === 'completed' ? 'bg-emerald-500' : 
                    phase.status === 'current' ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}>
                    <Award size={24} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                    <p className="text-gray-400">{phase.period}</p>
                  </div>
                </div>
                <div className="flex-1 bg-[#102620]/70 backdrop-blur-md rounded-2xl p-6 border border-emerald-700/30">
                  <ul className="space-y-2">
                    {phase.milestones.map((milestone, milestoneIndex) => (
                      <li key={milestoneIndex} className="flex items-center text-gray-300">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          phase.status === 'completed' ? 'bg-emerald-400' : 
                          phase.status === 'current' ? 'bg-cyan-400' : 'bg-gray-500'
                        }`} />
                        {milestone}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-center z-10">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">
            {t('about.ctaTitle')}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            {t('about.ctaText')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard">
              <motion.button
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={20} />
                <span>{t('about.ctaButton')}</span>
              </motion.button>
            </Link>
            <Link href="/whitepaper">
              <motion.button
                className="bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-6 py-3 rounded-full text-lg transition-all duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText size={20} />
                <span>{t('hero.readWhitepaper')}</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
