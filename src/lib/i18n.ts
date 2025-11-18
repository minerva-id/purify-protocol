'use client';

export type Locale = 'en' | 'id';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'id'];

// English translations
export const translations = {
  en: {
    // Navigation
    'nav.whitepaper': 'Whitepaper',
    'nav.docs': 'Documentation',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',

    // Hero Section
    'hero.title': 'Purify the Blockchain.',
    'hero.subtitle': 'Transforming broken tokens into pure value. The first green protocol on Solana for a clean and sustainable ecosystem.',
    'hero.launchApp': 'Launch Purify App',
    'hero.goToDashboard': 'Go to Dashboard',
    'hero.readWhitepaper': 'Read Whitepaper',

    // Stats
    'stats.totalPurged': 'Total Purged',
    'stats.activePurifiers': 'Active Purifiers',
    'stats.certificates': 'Certificates',
    'stats.securityScore': 'Security Score',
    'stats.tokens': 'Tokens',
    'stats.users': 'Users',
    'stats.nfts': 'NFTs',
    'stats.safe': 'Safe',

    // How It Works
    'howItWorks.title': 'How Purify Works',
    'howItWorks.subtitle': 'The first DeFi protocol that recycles rug tokens into useful value',
    'howItWorks.step1.title': 'Deposit Dead Tokens',
    'howItWorks.step1.desc': 'Send rug/scam tokens to secure Purify Vault',
    'howItWorks.step2.title': 'Automatic Recycling',
    'howItWorks.step2.desc': 'Protocol recycles tokens into PURE tokens',
    'howItWorks.step3.title': 'Earn Rewards',
    'howItWorks.step3.desc': 'Get PURE tokens + Exclusive NFT Certificate',

    // CTA Section
    'cta.title': 'Ready to Clean the Blockchain?',
    'cta.subtitle': 'Join thousands of users already purifying the Solana ecosystem',
    'cta.learnMore': 'Learn More',

    // Footer
    'footer.tagline': 'Purify Protocol (PURE) — The Green Blockchain Recycling Protocol',
    'footer.live': 'Live on DevNet',
    'footer.audited': 'Audited',
    'footer.version': 'v1.0.0',
    'footer.carbonNeutral': 'Carbon Neutral',

    // Whitepaper Page
    'whitepaper.title': 'Purify Protocol Whitepaper',
    'whitepaper.subtitle': 'Cleaning the Blockchain, One Token at a Time',
    'whitepaper.download': 'Download PDF',
    'whitepaper.back': 'Back to Home',
    'whitepaper.abstract': 'Abstract',
    'whitepaper.abstract.content': 'Purify Protocol is a decentralized token recycling ecosystem built on Solana that addresses the growing problem of dead and abandoned tokens in the blockchain space. Our platform provides an elegant solution for token cleanup while rewarding participants with verifiable certificate NFTs, creating both ecological and economic value for the Web3 ecosystem.',

    // About Page
    'about.title': 'About Purify Protocol',
    'about.subtitle': 'Revolutionizing blockchain sustainability through decentralized token recycling. Transforming ecological responsibility into economic opportunity.',
    'about.missionTitle': 'Our Mission',
    'about.missionText': 'Creating a transparent, decentralized token recycling system with real impact. We empower the Web3 community to clean the blockchain ecosystem while creating economic value.',
    'about.visionTitle': 'Our Vision', 
    'about.visionText': 'A world where every digital transaction contributes to environmental sustainability through blockchain recycling mechanisms.',
    'about.teamTitle': 'Meet The Team',
    'about.valuesTitle': 'Our Core Values',
    'about.timelineTitle': 'Our Journey',
    'about.ctaTitle': 'Join Our Mission',
    'about.ctaText': 'Be part of the movement towards a carbon-neutral blockchain ecosystem. Together, we can make a real environmental impact.',
    'about.ctaButton': 'Start Purifying Today'
  },
  id: {
    // Navigation
    'nav.whitepaper': 'Whitepaper',
    'nav.docs': 'Dokumentasi',
    'nav.about': 'Tentang',
    'nav.dashboard': 'Dashboard',

    // Hero Section
    'hero.title': 'Pembersihan Blockchain.',
    'hero.subtitle': 'Mengubah token rusak menjadi nilai murni. Protokol hijau pertama di Solana untuk ekosistem yang bersih dan berkelanjutan.',
    'hero.launchApp': 'Luncurkan Purify App',
    'hero.goToDashboard': 'Pergi ke Dashboard',
    'hero.readWhitepaper': 'Baca Whitepaper',

    // Stats
    'stats.totalPurged': 'Total Dibersihkan',
    'stats.activePurifiers': 'Pembersih Aktif',
    'stats.certificates': 'Sertifikat',
    'stats.securityScore': 'Skor Keamanan',
    'stats.tokens': 'Token',
    'stats.users': 'Pengguna',
    'stats.nfts': 'NFT',
    'stats.safe': 'Aman',

    // How It Works
    'howItWorks.title': 'Cara Kerja Purify',
    'howItWorks.subtitle': 'Protokol DeFi pertama yang mendaur ulang token rug menjadi nilai yang berguna',
    'howItWorks.step1.title': 'Deposit Token Mati',
    'howItWorks.step1.desc': 'Kirim token rug/scam ke Vault Purify yang aman',
    'howItWorks.step2.title': 'Daur Ulang Otomatis',
    'howItWorks.step2.desc': 'Protokol mendaur ulang token menjadi PURE tokens',
    'howItWorks.step3.title': 'Dapatkan Hadiah',
    'howItWorks.step3.desc': 'Dapatkan PURE tokens + Sertifikat NFT Eksklusif',

    // CTA Section
    'cta.title': 'Siap Membersihkan Blockchain?',
    'cta.subtitle': 'Bergabung dengan ribuan pengguna yang sudah memurnikan ekosistem Solana',
    'cta.learnMore': 'Pelajari Lebih Lanjut',

    // Footer
    'footer.tagline': 'Purify Protocol (PURE) — Protokol Daur Ulang Blockchain Hijau',
    'footer.live': 'Live di DevNet',
    'footer.audited': 'Diaudit',
    'footer.version': 'v1.0.0',
    'footer.carbonNeutral': 'Netral Karbon',

    // Whitepaper Page
    'whitepaper.title': 'Whitepaper Purify Protocol',
    'whitepaper.subtitle': 'Membersihkan Blockchain, Satu Token pada Satu Waktu',
    'whitepaper.download': 'Unduh PDF',
    'whitepaper.back': 'Kembali ke Beranda',
    'whitepaper.abstract': 'Abstrak',
    'whitepaper.abstract.content': 'Purify Protocol adalah ekosistem daur ulang token terdesentralisasi yang dibangun di Solana yang mengatasi masalah token mati dan terbengkalai yang semakin bertambah di ruang blockchain. Platform kami memberikan solusi elegan untuk pembersihan token sambil memberi penghargaan kepada peserta dengan sertifikat NFT yang dapat diverifikasi, menciptakan nilai ekologis dan ekonomis untuk ekosistem Web3.',

    // About Page
    'about.title': 'Tentang Purify Protocol',
    'about.subtitle': 'Merevolusi keberlanjutan blockchain melalui daur ulang token terdesentralisasi. Mengubah tanggung jawab ekologis menjadi peluang ekonomi.',
    'about.missionTitle': 'Misi Kami',
    'about.missionText': 'Menciptakan sistem daur ulang token yang transparan, terdesentralisasi, dan berdampak nyata. Kami memberdayakan komunitas Web3 untuk membersihkan ekosistem blockchain sambil menciptakan nilai ekonomi.',
    'about.visionTitle': 'Visi Kami',
    'about.visionText': 'Dunia di mana setiap transaksi digital berkontribusi pada keberlanjutan lingkungan melalui mekanisme daur ulang blockchain.',
    'about.teamTitle': 'Tim Kami',
    'about.valuesTitle': 'Nilai Inti Kami',
    'about.timelineTitle': 'Perjalanan Kami',
    'about.ctaTitle': 'Bergabung dengan Misi Kami',
    'about.ctaText': 'Jadilah bagian dari gerakan menuju ekosistem blockchain yang netral karbon. Bersama, kita dapat membuat dampak lingkungan yang nyata.',
    'about.ctaButton': 'Mulai Memurnikan Hari Ini'
  }
} as const;

export type TranslationKey = keyof typeof translations['en'];

export function getTranslation(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations['en'][key];
}

export function useTranslations(locale: Locale) {
  return (key: TranslationKey) => getTranslation(locale, key);
}