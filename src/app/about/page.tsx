// app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
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
import { CustomWalletButton } from '@/components/common/CustomWalletButton';
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

// Header is provided globally via `src/components/common/Header` and rendered in layout

export default function AboutPage() {
  const [isClient, setIsClient] = useState(() => typeof window !== 'undefined');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const { connected } = useWallet();
  const t = useTranslations(locale);
  const router = useRouter();

  const protocolFeatures = [
    { icon: <Leaf size={28} className="text-emerald-400" />, title: locale === 'id' ? 'Ramah Lingkungan' : 'Eco-friendly', description: locale === 'id' ? 'Mengurangi jejak karbon dan limbah digital.' : 'Reduce carbon footprint and digital waste.' },
    { icon: <Shield size={28} className="text-cyan-400" />, title: locale === 'id' ? 'Aman & Terpercaya' : 'Secure & Trusted', description: locale === 'id' ? 'Pendekatan audit dan transparansi.' : 'Auditable approach with transparency.' },
    { icon: <Recycle size={28} className="text-emerald-300" />, title: locale === 'id' ? 'Sirkular' : 'Circular', description: locale === 'id' ? 'Tokenisasi yang mendukung daur ulang ekosistem.' : 'Tokenization that supports ecosystem recycling.' },
    { icon: <Trophy size={28} className="text-yellow-400" />, title: locale === 'id' ? 'Berkinerja Tinggi' : 'High Performance', description: locale === 'id' ? 'Skalabilitas dan interoperabilitas.' : 'Scalability and interoperability.' },
  ];

  const teamMembers = [
    { name: 'Minerva', role: 'Founder & CEO', bio: 'Blockchain engineer and sustainability advocate.', expertise: ['Blockchain', 'Sustainability'] },
    { name: 'Bambang Irawan', role: 'Head of Marketing', bio: 'Experienced growth and community builder.', expertise: ['Marketing', 'Partnerships'] },
    { name: 'Dr. Siti', role: 'Environmental Lead', bio: 'Environmental scientist focused on carbon accounting.', expertise: ['Science', 'Carbon'] },
  ];

  const roadmap = [
    { phase: 'Phase 1', period: 'Q1 2025', status: 'completed', milestones: ['Audit', 'Prototype'] },
    { phase: 'Phase 2', period: 'Q2 2025', status: 'current', milestones: ['Pilot', 'Integrations'] },
    { phase: 'Phase 3', period: 'Q3 2025', status: 'upcoming', milestones: ['Mainnet', 'Scaling'] },
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400">{locale === 'id' ? 'Memuat...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white font-sans">

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
