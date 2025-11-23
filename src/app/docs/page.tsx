"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { 
  BookOpen, 
  Code, 
  FileText, 
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Search
} from "lucide-react";
import Link from 'next/link';

export default function DocsPage() {
  const [isClient, setIsClient] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { locale } = useLanguage();
  const t = useTranslations(locale);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const docsContent = {
    en: {
      title: "API Documentation",
      subtitle: "Complete guide to Purify Protocol smart contract",
      sections: {
        overview: {
          title: "Overview",
          content: "Purify Protocol is a Solana program that enables users to deposit tokens into vaults, burn tokens to create scarcity, and mint NFT certificates for their contributions."
        },
        quickStart: {
          title: "Quick Start",
          content: "Get started with Purify Protocol in minutes"
        },
        instructions: {
          title: "Instructions",
          content: "All available functions in the protocol"
        },
        accounts: {
          title: "Account Structures",
          content: "Data structures used by the program"
        },
        events: {
          title: "Events",
          content: "Events emitted by the protocol"
        },
        errors: {
          title: "Error Codes",
          content: "All possible error codes"
        }
      }
    },
    id: {
      title: "Dokumentasi API",
      subtitle: "Panduan lengkap untuk smart contract Purify Protocol",
      sections: {
        overview: {
          title: "Ringkasan",
          content: "Purify Protocol adalah program Solana yang memungkinkan pengguna untuk deposit token ke vault, membakar token untuk menciptakan kelangkaan, dan mint sertifikat NFT untuk kontribusi mereka."
        },
        quickStart: {
          title: "Mulai Cepat",
          content: "Mulai menggunakan Purify Protocol dalam hitungan menit"
        },
        instructions: {
          title: "Instruksi",
          content: "Semua fungsi yang tersedia di protokol"
        },
        accounts: {
          title: "Struktur Akun",
          content: "Struktur data yang digunakan oleh program"
        },
        events: {
          title: "Event",
          content: "Event yang dikeluarkan oleh protokol"
        },
        errors: {
          title: "Kode Error",
          content: "Semua kode error yang mungkin"
        }
      }
    }
  };

  const content = docsContent[locale] || docsContent.en;

  const instructions = [
    {
      name: "initialize_vault",
      title: locale === 'id' ? "Inisialisasi Vault" : "Initialize Vault",
      description: locale === 'id' 
        ? "Membuat vault baru untuk token mint tertentu"
        : "Creates a new vault for a specific token mint",
      params: [],
      accounts: ["vault_state", "mint", "authority", "system_program"]
    },
    {
      name: "deposit_to_vault",
      title: locale === 'id' ? "Deposit ke Vault" : "Deposit to Vault",
      description: locale === 'id'
        ? "Deposit token dari wallet user ke vault"
        : "Deposits tokens from user's wallet to the vault",
      params: ["amount: u64"],
      accounts: ["vault_state", "mint", "depositor", "depositor_ata", "vault_ata", "vault_authority", "user_contribution", "token_program", "associated_token_program", "system_program"]
    },
    {
      name: "burn_from_vault",
      title: locale === 'id' ? "Bakar dari Vault" : "Burn from Vault",
      description: locale === 'id'
        ? "Bakar token dari vault (hanya authority)"
        : "Burns tokens from the vault (authority only)",
      params: ["amount: u64"],
      accounts: ["vault_state", "mint", "authority", "vault_ata", "vault_authority", "user_contribution", "token_program", "system_program"]
    },
    {
      name: "update_vault_metadata",
      title: locale === 'id' ? "Update Metadata Vault" : "Update Vault Metadata",
      description: locale === 'id'
        ? "Update metadata URI vault (hanya authority)"
        : "Updates the metadata URI of a vault (authority only)",
      params: ["metadata_uri: String"],
      accounts: ["vault_state", "mint", "authority"]
    },
    {
      name: "mint_certificate",
      title: locale === 'id' ? "Mint Sertifikat" : "Mint Certificate",
      description: locale === 'id'
        ? "Mint NFT certificate untuk user yang sudah burn minimum 1000 token"
        : "Mints an NFT certificate for users who have burned at least 1000 tokens",
      params: ["metadata_uri: String"],
      accounts: ["vault_state", "user_contribution", "certificate", "mint", "authority", "system_program"]
    },
    {
      name: "close_vault",
      title: locale === 'id' ? "Tutup Vault" : "Close Vault",
      description: locale === 'id'
        ? "Tutup vault dan recover rent (vault harus kosong)"
        : "Closes a vault and recovers rent (vault must be empty)",
      params: [],
      accounts: ["vault_state", "mint", "authority", "system_program"]
    }
  ];

  const errorCodes = [
    { code: 0, name: "Overflow", message: locale === 'id' ? "Terjadi overflow" : "Overflow occurred" },
    { code: 1, name: "InvalidAmount", message: locale === 'id' ? "Jumlah tidak valid" : "Invalid amount" },
    { code: 2, name: "VaultNotActive", message: locale === 'id' ? "Vault tidak aktif" : "Vault is not active" },
    { code: 3, name: "InsufficientBalance", message: locale === 'id' ? "Saldo tidak cukup di vault" : "Insufficient balance in vault" },
    { code: 4, name: "StringTooLong", message: locale === 'id' ? "String terlalu panjang" : "String too long" },
    { code: 5, name: "NoTokensBurned", message: locale === 'id' ? "Tidak ada token yang dibakar untuk mint certificate" : "No tokens burned to mint certificate" },
    { code: 6, name: "Unauthorized", message: locale === 'id' ? "Akses tidak diizinkan" : "Unauthorized access" },
    { code: 7, name: "InsufficientContribution", message: locale === 'id' ? "Kontribusi tidak cukup untuk certificate" : "Insufficient contribution for certificate" },
    { code: 8, name: "VaultNotEmpty", message: locale === 'id' ? "Vault masih berisi token" : "Vault still contains tokens" },
  ];

  const filteredInstructions = instructions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-400">Loading Documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white overflow-hidden font-sans">
      
      {/* Header */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        
        {/* Page Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="text-emerald-400" size={32} />
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {content.title}
              </h1>
              <p className="text-gray-300 mt-2">{content.subtitle}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={locale === 'id' ? 'Cari dokumentasi...' : 'Search documentation...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-emerald-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </motion.div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Code className="text-emerald-400" size={24} />
              <h3 className="text-lg font-semibold text-white">
                {locale === 'id' ? 'Program ID' : 'Program ID'}
              </h3>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-300 font-mono break-all">
                6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ
              </code>
              <button
                onClick={() => copyToClipboard('6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ', 'program-id')}
                className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copiedId === 'program-id' ? (
                  <Check className="text-emerald-400" size={18} />
                ) : (
                  <Copy className="text-gray-400" size={18} />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="text-cyan-400" size={24} />
              <h3 className="text-lg font-semibold text-white">
                {locale === 'id' ? 'Instruksi' : 'Instructions'}
              </h3>
            </div>
            <div className="text-3xl font-bold text-white">{instructions.length}</div>
            <div className="text-sm text-gray-400">
              {locale === 'id' ? 'Fungsi tersedia' : 'Available functions'}
            </div>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <LinkIcon className="text-yellow-400" size={24} />
              <h3 className="text-lg font-semibold text-white">
                {locale === 'id' ? 'Network' : 'Network'}
              </h3>
            </div>
            <div className="text-lg font-semibold text-white">Solana DevNet</div>
            <a
              href="https://explorer.solana.com/address/6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ?cluster=devnet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 mt-2"
            >
              <span>{locale === 'id' ? 'Lihat di Explorer' : 'View on Explorer'}</span>
              <ExternalLink size={14} />
            </a>
          </motion.div>
        </div>

        {/* Instructions Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-2">
            <Code className="text-emerald-400" size={28} />
            <span>{content.sections.instructions.title}</span>
          </h2>

          <div className="space-y-4">
            {filteredInstructions.map((instruction, index) => (
              <motion.div
                key={instruction.name}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center space-x-2">
                      <ChevronRight className="text-emerald-400" size={20} />
                      <span>{instruction.title}</span>
                    </h3>
                    <code className="text-sm text-emerald-400 font-mono bg-black/20 px-2 py-1 rounded">
                      {instruction.name}
                    </code>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{instruction.description}</p>

                {instruction.params.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2">
                      {locale === 'id' ? 'Parameter' : 'Parameters'}
                    </h4>
                    <div className="space-y-1">
                      {instruction.params.map((param, idx) => (
                        <code key={idx} className="block text-sm text-gray-300 font-mono bg-black/20 px-3 py-2 rounded">
                          {param}
                        </code>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                    {locale === 'id' ? 'Accounts' : 'Accounts'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {instruction.accounts.map((account, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-gray-300 bg-black/20 px-2 py-1 rounded border border-emerald-500/20"
                      >
                        {account}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Error Codes Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-2">
            <FileText className="text-red-400" size={28} />
            <span>{content.sections.errors.title}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {errorCodes.map((error, index) => (
              <motion.div
                key={error.code}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-red-500/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono text-red-400">Error {error.code}</code>
                  <span className="text-xs text-gray-400">#{error.code}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{error.name}</h4>
                <p className="text-xs text-gray-300">{error.message}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Full Documentation Link */}
        <motion.div
          className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h3 className="text-xl font-bold text-white mb-3">
            {locale === 'id' ? 'Dokumentasi Lengkap' : 'Full Documentation'}
          </h3>
          <p className="text-gray-300 mb-4">
            {locale === 'id' 
              ? 'Untuk dokumentasi lengkap dengan contoh kode dan detail teknis, lihat file API_DOCUMENTATION.md di repository.'
              : 'For complete documentation with code examples and technical details, see the API_DOCUMENTATION.md file in the repository.'
            }
          </p>
          <Link
            href="https://github.com/minerva-id/purify-protocol"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>{locale === 'id' ? 'Lihat di GitHub' : 'View on GitHub'}</span>
            <ExternalLink size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

