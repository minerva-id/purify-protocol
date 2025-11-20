"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  Coins, 
  Leaf, 
  Github, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Languages,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Code,
  Database,
  Cpu
} from "lucide-react";
import { useRouter } from 'next/navigation';
import ImageLogo from "@/components/common/ImageLogo";
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

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

// English Whitepaper Content
const englishContent = {
  abstract: {
    title: "Abstract",
    content: "Purify Protocol is a decentralized token recycling ecosystem built on Solana that addresses the growing problem of dead and abandoned tokens in the blockchain space. Our platform provides an elegant solution for token cleanup while rewarding participants with verifiable certificate NFTs, creating both ecological and economic value for the Web3 ecosystem."
  },
  introduction: {
    title: "1. Introduction",
    problem: {
      title: "1.1 The Problem: Blockchain Bloat",
      description: "The rapid growth of the cryptocurrency ecosystem has led to an explosion of token creation. However, many projects fail, get abandoned, or turn out to be scams, leaving behind:",
      points: [
        "Thousands of dead tokens clogging blockchain storage",
        "Investor funds trapped in illiquid assets",
        "Polluted wallet interfaces with worthless tokens",
        "Wasted computational resources maintaining obsolete data"
      ]
    },
    solution: {
      title: "1.2 Our Solution: Token Recycling Protocol",
      description: "Purify Protocol introduces a systematic approach to blockchain cleanup:",
      points: [
        "Vault System: Secure deposit mechanism for dead tokens",
        "Contribution Tracking: Transparent recording of user participation",
        "Certificate NFTs: Verifiable proof of ecological contribution",
        "Economic Incentives: Reward system for active participants"
      ]
    }
  },
  technical: {
    title: "2. Technical Architecture",
    design: {
      title: "2.1 Smart Contract Design",
      description: "Built on Solana using Anchor framework, our protocol features:",
      code: [
        "// Core Program Structure",
        "- initialize_vault()     // Create recycling vault for specific token",
        "- deposit_to_vault()    // Deposit dead tokens into vault", 
        "- burn_from_vault()     // Burn tokens from vault (authorized)",
        "- mint_certificate()    // Mint NFT certificate for contributors",
        "- update_metadata()     // Update vault information"
      ]
    },
    accounts: {
      title: "2.2 Account Structure",
      items: [
        { name: "VaultState", description: "Tracks token deposits and burns per mint" },
        { name: "Certificate", description: "NFT representing user contribution" },
        { name: "UserContribution", description: "Records individual user activity" }
      ]
    },
    security: {
      title: "2.3 Security Features",
      features: [
        "PDA-based Access Control: Secure vault management",
        "Minimum Contribution Requirements: Anti-spam measures",
        "Transparent Event Logging: All actions recorded on-chain",
        "Authority Verification: Multi-level access control"
      ]
    }
  },
  economic: {
    title: "3. Economic Model",
    value: {
      title: "3.1 Value Proposition",
      holders: {
        title: "For Token Holders:",
        points: [
          "Exit strategy for dead token investments",
          "Transform worthless tokens into valuable certificates", 
          "Contribute to blockchain health"
        ]
      },
      ecosystem: {
        title: "For Blockchain Ecosystem:",
        points: [
          "Reduced storage bloat",
          "Improved network efficiency",
          "Cleaner user experience"
        ]
      }
    },
    certificates: {
      title: "3.2 Certificate NFT System",
      points: [
        "Proof of Contribution: Verifiable on-chain record",
        "Collectible Assets: Limited edition NFTs",
        "Governance Potential: Future voting rights",
        "Community Status: Recognition for ecological contribution"
      ]
    },
    sustainability: {
      title: "3.3 Sustainability Mechanisms",
      points: [
        "Minimum Burn Thresholds: Prevent system abuse",
        "Gradual Certificate Rarity: Early contributors receive special editions",
        "Fee Structures: Optional protocol fees for sustainability"
      ]
    }
  },
  useCases: {
    title: "4. Use Cases",
    items: [
      {
        category: "Individual Users",
        points: [
          "Clean up personal wallet from dead tokens",
          "Earn certificate NFTs for ecological contribution",
          "Participate in community governance"
        ]
      },
      {
        category: "Project Teams", 
        points: [
          "Properly sunset failed projects",
          "Provide exit liquidity for community members",
          "Demonstrate commitment to ecosystem health"
        ]
      },
      {
        category: "DAOs & Communities",
        points: [
          "Collective cleanup initiatives", 
          "Treasury management of dead tokens",
          "Community reputation building"
        ]
      }
    ]
  },
  roadmap: {
    title: "5. Roadmap",
    phases: [
      {
        phase: "Phase 1: Foundation",
        timeframe: "Q4 2025", 
        completed: true,
        items: ["Core protocol development", "DevNet deployment", "Basic frontend interface"]
      },
      {
        phase: "Phase 2: Growth",
        timeframe: "Q1 2026",
        completed: false, 
        items: ["MainNet deployment", "Advanced frontend features", "Community building", "Partner integrations"]
      },
      {
        phase: "Phase 3: Expansion",
        timeframe: "Q2 2026",
        completed: false,
        items: ["Cross-chain compatibility", "Advanced certificate features", "Governance system", "Mobile application"]
      },
      {
        phase: "Phase 4: Maturity", 
        timeframe: "H2 2026",
        completed: false,
        items: ["DAO transition", "Protocol-owned liquidity", "Ecosystem grants program"]
      }
    ]
  },
  tokenomics: {
    title: "6. Tokenomics",
    purifyToken: {
      title: "6.1 PURIFY Token (Future Consideration)",
      description: "If implemented, PURIFY token would feature:",
      features: [
        { feature: "Governance", description: "Protocol decision-making" },
        { feature: "Staking", description: "Earn protocol fees" },
        { feature: "Incentives", description: "Reward active participants" },
        { feature: "Utility", description: "Access to premium features" }
      ]
    },
    certificates: {
      title: "6.2 Certificate NFTs", 
      points: [
        "Tiered System: Based on contribution level",
        "Dynamic Metadata: Reflects user's cleanup history",
        "Tradable Assets: Can be bought/sold on marketplaces", 
        "Utility Integration: Potential airdrops and rewards"
      ]
    }
  },
  team: {
    title: "7. Team & Governance",
    development: {
      title: "7.1 Initial Development Team",
      points: [
        "Blockchain Developers: Smart contract expertise",
        "Frontend Engineers: User experience focus", 
        "Community Managers: Ecosystem growth"
      ]
    },
    governance: {
      title: "7.2 Governance Evolution", 
      points: [
        "Core Team Stewardship (Initial phase)",
        "Community DAO (Progressive decentralization)", 
        "Fully Autonomous Protocol (Long-term vision)"
      ]
    }
  },
  risks: {
    title: "8. Risks & Mitigations", 
    categories: [
      {
        category: "Technical Risks",
        points: [
          "Smart Contract Vulnerabilities: Multiple audits & bug bounties",
          "Network Congestion: Optimized for Solana's high throughput",
          "Upgrade Risks: Timelock controllers & community voting"
        ]
      },
      {
        category: "Economic Risks",
        points: [
          "Certificate Value Fluctuation: Intrinsic utility beyond speculation", 
          "Participation Incentives: Graduated reward systems",
          "Market Conditions: Focus on long-term ecological value"
        ]
      },
      {
        category: "Regulatory Considerations",
        points: [
          "Compliance Focus: Transparent, verifiable operations",
          "Global Accessibility: Permissionless participation",
          "Tax Transparency: Clear reporting for certificate activities"
        ]
      }
    ]
  },
  conclusion: {
    title: "9. Conclusion",
    content: [
      "Purify Protocol represents a paradigm shift in how we approach blockchain sustainability. By transforming ecological responsibility into economic opportunity, we create a virtuous cycle where cleaning the blockchain becomes personally beneficial.",
      "Our protocol not only addresses the immediate problem of dead tokens but also establishes a framework for long-term blockchain health. As the ecosystem matures, the importance of such cleanup mechanisms will only grow."
    ]
  },
  contact: {
    title: "10. Contact & Resources",
    resources: [
      { icon: <Globe size={18} />, label: "Website", value: "Coming soon" },
      { icon: <Github size={18} />, label: "GitHub", value: "https://github.com/purify-protocol" },
      { icon: <Twitter size={18} />, label: "Twitter", value: "@PurifyProtocol" },
      { icon: <MessageCircle size={18} />, label: "Discord", value: "Community portal" },
      { icon: <Mail size={18} />, label: "Email", value: "info@purifyprotocol.org" }
    ],
    disclaimer: "This whitepaper is for informational purposes only and does not constitute investment advice. The protocol is in development and features may change."
  }
};

// Indonesian Whitepaper Content
const indonesianContent = {
  abstract: {
    title: "Abstrak",
    content: "Purify Protocol adalah ekosistem daur ulang token terdesentralisasi yang dibangun di Solana yang mengatasi masalah token mati dan terbengkalai yang semakin bertambah di ruang blockchain. Platform kami memberikan solusi elegan untuk pembersihan token sambil memberi penghargaan kepada peserta dengan sertifikat NFT yang dapat diverifikasi, menciptakan nilai ekologis dan ekonomis untuk ekosistem Web3."
  },
  introduction: {
    title: "1. Pendahuluan",
    problem: {
      title: "1.1 Masalah: Blokchain Bloat",
      description: "Pertumbuhan pesat ekosistem cryptocurrency telah menyebabkan ledakan pembuatan token. Namun, banyak proyek gagal, terbengkalai, atau ternyata scam, meninggalkan:",
      points: [
        "Ribuan token mati menyumbat penyimpanan blockchain",
        "Dana investor terjebak dalam aset tidak likuid",
        "Antarmuka dompet tercemar dengan token tidak berharga",
        "Sumber daya komputasi terbuang mempertahankan data usang"
      ]
    },
    solution: {
      title: "1.2 Solusi Kami: Protokol Daur Ulang Token",
      description: "Purify Protocol memperkenalkan pendekatan sistematis untuk pembersihan blockchain:",
      points: [
        "Sistem Vault: Mekanisme deposit aman untuk token mati",
        "Pelacakan Kontribusi: Pencatatan transparan partisipasi pengguna",
        "Sertifikat NFT: Bukti terverifikasi kontribusi ekologis",
        "Insentif Ekonomi: Sistem penghargaan untuk peserta aktif"
      ]
    }
  },
  technical: {
    title: "2. Arsitektur Teknis",
    design: {
      title: "2.1 Desain Smart Contract",
      description: "Dibangun di Solana menggunakan framework Anchor, protokol kami memiliki fitur:",
      code: [
        "// Struktur Program Inti",
        "- initialize_vault()     // Buat vault daur ulang untuk token spesifik",
        "- deposit_to_vault()    // Deposit token mati ke vault", 
        "- burn_from_vault()     // Bakar token dari vault (terotorisasi)",
        "- mint_certificate()    // Cetak sertifikat NFT untuk kontributor",
        "- update_metadata()     // Perbarui informasi vault"
      ]
    },
    accounts: {
      title: "2.2 Struktur Akun",
      items: [
        { name: "VaultState", description: "Melacak deposit dan pembakaran token per mint" },
        { name: "Certificate", description: "NFT yang mewakili kontribusi pengguna" },
        { name: "UserContribution", description: "Mencatat aktivitas pengguna individu" }
      ]
    },
    security: {
      title: "2.3 Fitur Keamanan",
      features: [
        "Kontrol Akses Berbasis PDA: Manajemen vault yang aman",
        "Persyaratan Kontribusi Minimum: Tindakan anti-spam",
        "Pencatatan Event Transparan: Semua aksi tercatat di chain",
        "Verifikasi Otoritas: Kontrol akses multi-level"
      ]
    }
  },
  economic: {
    title: "3. Model Ekonomi",
    value: {
      title: "3.1 Proposisi Nilai",
      holders: {
        title: "Untuk Pemegang Token:",
        points: [
          "Strategi keluar untuk investasi token mati",
          "Ubah token tidak berharga menjadi sertifikat berharga", 
          "Berkontribusi untuk kesehatan blockchain"
        ]
      },
      ecosystem: {
        title: "Untuk Ekosistem Blockchain:",
        points: [
          "Pengurangan penyumbatan penyimpanan",
          "Peningkatan efisiensi jaringan",
          "Pengalaman pengguna yang lebih bersih"
        ]
      }
    },
    certificates: {
      title: "3.2 Sistem Sertifikat NFT",
      points: [
        "Bukti Kontribusi: Catatan terverifikasi di chain",
        "Aset Kolektibel: NFT edisi terbatas",
        "Potensi Governance: Hak suara di masa depan",
        "Status Komunitas: Pengakuan untuk kontribusi ekologis"
      ]
    },
    sustainability: {
      title: "3.3 Mekanisme Keberlanjutan",
      points: [
        "Threshold Pembakaran Minimum: Cegah penyalahgunaan sistem",
        "Kelangkaan Sertifikat Bertahap: Kontributor awal menerima edisi spesial",
        "Struktur Biaya: Biaya protokol opsional untuk keberlanjutan"
      ]
    }
  },
  useCases: {
    title: "4. Kasus Penggunaan",
    items: [
      {
        category: "Pengguna Individu",
        points: [
          "Bersihkan dompet pribadi dari token mati",
          "Dapatkan sertifikat NFT untuk kontribusi ekologis",
          "Ikut serta dalam governance komunitas"
        ]
      },
      {
        category: "Tim Proyek", 
        points: [
          "Tutup proyek gagal dengan benar",
          "Berikan likuiditas keluar untuk anggota komunitas",
          "Tunjukkan komitmen terhadap kesehatan ekosistem"
        ]
      },
      {
        category: "DAOs & Komunitas",
        points: [
          "Inisiatif pembersihan kolektif", 
          "Manajemen treasury token mati",
          "Membangun reputasi komunitas"
        ]
      }
    ]
  },
  roadmap: {
    title: "5. Roadmap",
    phases: [
      {
        phase: "Fase 1: Fondasi",
        timeframe: "Q4 2025", 
        completed: true,
        items: ["Pengembangan protokol inti", "Deploy DevNet", "Antarmuka frontend dasar"]
      },
      {
        phase: "Fase 2: Pertumbuhan",
        timeframe: "Q1 2026",
        completed: false, 
        items: ["Deploy MainNet", "Fitur frontend lanjutan", "Pembangunan komunitas", "Integrasi partner"]
      },
      {
        phase: "Fase 3: Ekspansi",
        timeframe: "Q2 2026",
        completed: false,
        items: ["Kompatibilitas cross-chain", "Fitur sertifikat lanjutan", "Sistem governance", "Aplikasi mobile"]
      },
      {
        phase: "Fase 4: Kematangan", 
        timeframe: "H2 2026",
        completed: false,
        items: ["Transisi DAO", "Likuiditas milik protokol", "Program grant ekosistem"]
      }
    ]
  },
  tokenomics: {
    title: "6. Tokenomics",
    purifyToken: {
      title: "6.1 Token PURIFY (Pertimbangan Masa Depan)",
      description: "Jika diimplementasikan, token PURIFY akan memiliki fitur:",
      features: [
        { feature: "Governance", description: "Pengambilan keputusan protokol" },
        { feature: "Staking", description: "Dapatkan biaya protokol" },
        { feature: "Insentif", description: "Hadiahi peserta aktif" },
        { feature: "Utility", description: "Akses ke fitur premium" }
      ]
    },
    certificates: {
      title: "6.2 Sertifikat NFT", 
      points: [
        "Sistem Bertingkat: Berdasarkan level kontribusi",
        "Metadata Dinamis: Mencerminkan riwayat pembersihan pengguna",
        "Aset Dapat Diperdagangkan: Dapat dibeli/dijual di marketplace", 
        "Integrasi Utility: Potensi airdrop dan hadiah"
      ]
    }
  },
  team: {
    title: "7. Tim & Governance",
    development: {
      title: "7.1 Tim Pengembangan Awal",
      points: [
        "Pengembang Blockchain: Keahlian smart contract",
        "Insinyur Frontend: Fokus pengalaman pengguna", 
        "Manajer Komunitas: Pertumbuhan ekosistem"
      ]
    },
    governance: {
      title: "7.2 Evolusi Governance", 
      points: [
        "Stewardship Tim Inti (Fase awal)",
        "DAO Komunitas (Desentralisasi progresif)", 
        "Protokol Otonom Penuh (Visi jangka panjang)"
      ]
    }
  },
  risks: {
    title: "8. Risiko & Mitigasi", 
    categories: [
      {
        category: "Risiko Teknis",
        points: [
          "Kerentanan Smart Contract: Multiple audit & bug bounty",
          "Kemacetan Jaringan: Dioptimalkan untuk throughput tinggi Solana",
          "Risiko Upgrade: Timelock controller & voting komunitas"
        ]
      },
      {
        category: "Risiko Ekonomi",
        points: [
          "Fluktuasi Nilai Sertifikat: Utility intrinsik di luar spekulasi", 
          "Insentif Partisipasi: Sistem reward bertingkat",
          "Kondisi Pasar: Fokus pada nilai ekologis jangka panjang"
        ]
      },
      {
        category: "Pertimbangan Regulasi",
        points: [
          "Fokus Kepatuhan: Operasi transparan dan terverifikasi",
          "Aksesibilitas Global: Partisipasi tanpa izin",
          "Transparansi Pajak: Pelaporan jelas untuk aktivitas sertifikat"
        ]
      }
    ]
  },
  conclusion: {
    title: "9. Kesimpulan",
    content: [
      "Purify Protocol merepresentasikan pergeseran paradigma dalam bagaimana kami mendekati keberlanjutan blockchain. Dengan mengubah tanggung jawab ekologis menjadi peluang ekonomi, kami menciptakan siklus yang baik di mana membersihkan blockchain menjadi menguntungkan secara pribadi.",
      "Protokol kami tidak hanya mengatasi masalah langsung token mati tetapi juga membangun kerangka kerja untuk kesehatan blockchain jangka panjang. Seiring dengan matangnya ekosistem, pentingnya mekanisme pembersihan seperti ini hanya akan tumbuh."
    ]
  },
  contact: {
    title: "10. Kontak & Sumber Daya",
    resources: [
      { icon: <Globe size={18} />, label: "Website", value: "Segera hadir" },
      { icon: <Github size={18} />, label: "GitHub", value: "https://github.com/purify-protocol" },
      { icon: <Twitter size={18} />, label: "Twitter", value: "@PurifyProtocol" },
      { icon: <MessageCircle size={18} />, label: "Discord", value: "Portal komunitas" },
      { icon: <Mail size={18} />, label: "Email", value: "info@purifyprotocol.org" }
    ],
    disclaimer: "Whitepaper ini hanya untuk tujuan informasi dan bukan merupakan saran investasi. Protokol sedang dalam pengembangan dan fitur dapat berubah."
  }
};

// Whitepaper content selector
const whitepaperContent = {
  en: englishContent,
  id: indonesianContent
};

export default function WhitepaperPage() {
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale } = useLanguage();
  const { connected } = useWallet();
  const t = useTranslations(locale);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownloadPDF = () => {
  try {
    const filename = locale === 'id' ? 'whitepaper-id.pdf' : 'whitepaper.pdf';
    const downloadName = `Purify-Protocol-Whitepaper-v1.0-${locale}.pdf`;
    
    console.log(`Attempting to download: ${filename}`);
    
    const link = document.createElement('a');
    link.href = `/docs/${filename}`;
    link.download = downloadName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Optional: Track download success
    console.log('Download initiated successfully');
    
  } catch (error) {
    console.error('Download failed:', error);
    
    // Fallback: open in new tab
    const filename = locale === 'id' ? 'whitepaper-id.pdf' : 'whitepaper.pdf';
    window.open(`/docs/${filename}`, '_blank');
  }
};

  const content = whitepaperContent[locale] || whitepaperContent.en;

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400">
            {locale === 'id' ? 'Memuat Whitepaper...' : 'Loading Whitepaper...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white font-sans">
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
              <div className="hidden md:flex items-center space-x-3">
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
                    className="text-emerald-400 border-b-2 border-emerald-400 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <FileText size={16} />
                    <span>{t('nav.whitepaper')}</span>
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
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

      {/* Whitepaper Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="prose prose-invert max-w-none"
        >
          {/* Header */}
          <div className="text-center mb-12 py-8 border-b border-emerald-700/30">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4"
            >
              <FileText className="text-emerald-400" size={32} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              {locale === 'id' ? 'Whitepaper Purify Protocol' : 'Purify Protocol Whitepaper'}
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              {locale === 'id' ? 'Membersihkan Blockchain, Satu Token pada Satu Waktu' : 'Cleaning the Blockchain, One Token at a Time'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <FileText size={14} />
                <span>Version 1.0</span>
              </span>
              <span>•</span>
              <span>November 2025</span>
              <span>•</span>
              <span>{locale === 'id' ? 'Dokumentasi Resmi' : 'Official Documentation'}</span>
            </div>
          </div>

          {/* Abstract Section */}
          <section className="mb-12">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.abstract.title}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
              <p className="text-lg text-gray-300 leading-relaxed">
                {content.abstract.content}
              </p>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="mb-12">
          <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.introduction.title}
            </h2>
            
            <div className="space-y-8">
              {/* Problem */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <AlertTriangle className="text-orange-400" size={24} />
                  <span>{content.introduction.problem.title}</span>
                </h3>
                <p className="text-gray-300 mb-4">
                  {content.introduction.problem.description}
                </p>
                <ul className="text-gray-300 space-y-2 ml-6">
                  {content.introduction.problem.points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solution */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="text-emerald-400" size={24} />
                  <span>{content.introduction.solution.title}</span>
                </h3>
                <p className="text-gray-300 mb-4">
                  {content.introduction.solution.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.introduction.solution.points.map((point, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-emerald-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-gray-300">{point}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Technical Architecture Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2 flex items-center space-x-2">
              <Cpu className="text-cyan-400" size={28} />
              <span>{content.technical.title}</span>
            </h2>
            
            <div className="space-y-8">
              {/* Smart Contract Design */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.technical.design.title}</h3>
                <p className="text-gray-300 mb-4">
                  {content.technical.design.description}
                </p>
                <div className="bg-black/30 rounded-lg p-6 border border-emerald-500/20 font-mono text-sm">
                  {content.technical.design.code.map((line, index) => (
                    <div key={index} className={line.startsWith('//') ? 'text-emerald-400' : 'text-gray-300'}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Structure */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.technical.accounts.title}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {content.technical.accounts.items.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-emerald-500/20 text-center">
                      <div className="font-bold text-emerald-400 mb-2">{item.name}</div>
                      <div className="text-gray-300 text-sm">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Features */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center space-x-2">
                  <Shield className="text-green-400" size={24} />
                  <span>{content.technical.security.title}</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.technical.security.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Shield className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Economic Model Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2 flex items-center space-x-2">
              <BarChart3 className="text-yellow-400" size={28} />
              <span>{content.economic.title}</span>
            </h2>
            
            <div className="space-y-8">
              {/* Value Proposition */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.economic.value.title}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-3">{content.economic.value.holders.title}</h4>
                    <ul className="text-gray-300 space-y-2">
                      {content.economic.value.holders.points.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Coins className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                    <h4 className="text-lg font-semibold text-emerald-400 mb-3">{content.economic.value.ecosystem.title}</h4>
                    <ul className="text-gray-300 space-y-2">
                      {content.economic.value.ecosystem.points.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Globe className="text-cyan-400 mt-1 flex-shrink-0" size={16} />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Certificate NFT System */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.economic.certificates.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.economic.certificates.points.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-emerald-500/20">
                      <div className="flex items-center space-x-2">
                        <FileText className="text-emerald-400" size={16} />
                        <span className="text-gray-300">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainability Mechanisms */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.economic.sustainability.title}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {content.economic.sustainability.points.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-emerald-500/20 text-center">
                      <div className="text-emerald-400 text-sm mb-2">✓</div>
                      <div className="text-gray-300 text-sm">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.useCases.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {content.useCases.items.map((useCase, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Users className="text-emerald-400" size={20} />
                    <span>{useCase.category}</span>
                  </h3>
                  <ul className="text-gray-300 space-y-2">
                    {useCase.points.map((point, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Roadmap Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2 flex items-center space-x-2">
              <Target className="text-purple-400" size={28} />
              <span>{content.roadmap.title}</span>
            </h2>
            
            <div className="space-y-6">
              {content.roadmap.phases.map((phase, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{phase.phase}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{phase.timeframe}</span>
                      {phase.completed && (
                        <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs flex items-center space-x-1">
                          <CheckCircle size={12} />
                          <span>{locale === 'id' ? 'Selesai' : 'Completed'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul className="text-gray-300 space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${phase.completed ? 'bg-emerald-400' : 'bg-gray-600'}`}></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Tokenomics Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.tokenomics.title}
            </h2>
            
            <div className="space-y-8">
              {/* PURIFY Token */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.tokenomics.purifyToken.title}</h3>
                <p className="text-gray-300 mb-4">
                  {content.tokenomics.purifyToken.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.tokenomics.purifyToken.features.map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-emerald-500/20 text-center">
                      <div className="font-bold text-emerald-400 mb-2">{item.feature}</div>
                      <div className="text-gray-300 text-sm">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate NFTs */}
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">{content.tokenomics.certificates.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.tokenomics.certificates.points.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FileText className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Team & Governance Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.team.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">{content.team.development.title}</h3>
                <ul className="text-gray-300 space-y-2">
                  {content.team.development.points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Code className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">{content.team.governance.title}</h3>
                <ul className="text-gray-300 space-y-2">
                  {content.team.governance.points.map((point, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Users className="text-cyan-400 mt-1 flex-shrink-0" size={16} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Risks & Mitigations Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.risks.title}
            </h2>
            
            <div className="space-y-6">
              {content.risks.categories.map((riskCategory, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">{riskCategory.category}</h3>
                  <ul className="text-gray-300 space-y-2">
                    {riskCategory.points.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <Shield className="text-emerald-400 mt-1 flex-shrink-0" size={16} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Conclusion Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.conclusion.title}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
              {content.conclusion.content.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-300 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Contact & Resources Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-emerald-400 mb-6 border-b border-emerald-700/30 pb-2">
              {content.contact.title}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {locale === 'id' ? 'Sumber Daya' : 'Resources'}
                </h3>
                <div className="space-y-3">
                  {content.contact.resources.map((resource, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-emerald-400">{resource.icon}</div>
                      <div>
                        <div className="text-white font-medium">{resource.label}</div>
                        <div className="text-gray-400 text-sm">{resource.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-emerald-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {locale === 'id' ? 'Peringatan' : 'Disclaimer'}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {content.contact.disclaimer}
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 border-t border-emerald-700/30">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4">
              {locale === 'id' ? 'Siap Bergabung dengan Revolusi?' : 'Ready to Join the Revolution?'}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {locale === 'id' 
                ? 'Mulai memurnikan blockchain hari ini dan jadilah bagian dari gerakan DeFi yang berkelanjutan.'
                : 'Start purifying the blockchain today and be part of the sustainable DeFi movement.'
              }
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/">
                <motion.button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full text-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {locale === 'id' ? 'Luncurkan App' : 'Launch App'}
                </motion.button>
              </Link>
              <button
                onClick={handleDownloadPDF}
                className="bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-8 py-3 rounded-full text-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Download size={20} />
                <span>{locale === 'id' ? 'Unduh Whitepaper Lengkap' : 'Download Full Whitepaper'}</span>
              </button>
            </div>
          </section>
        </motion.article>
      </div>
    </div>
  );
}
