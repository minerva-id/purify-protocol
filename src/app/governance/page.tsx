"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey, Transaction } from '@solana/web3.js';
import { 
  Vote, 
  Plus, 
  TrendingUp,
  Shield,
  Clock,
  Users,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BurnProposalCard } from '@/components/governance/BurnProposalCard';
import { ProtocolStatus } from '@/components/governance/ProtocolStatus';
import { useNotification } from '@/contexts/NotificationContext';
import { useProtocolConfig, useVaultBurnProposals } from '@/hooks/useOnChainData';
import { usePurifyProgram } from '@/utils/program';
import { createBurnProposal, voteOnProposal, executeBurnProposal } from '@/utils/transactions';
import { findVaultStateAddress } from '@/utils/program';
import { parseSolanaError } from '@/utils/onchain';

export default function GovernancePage() {
  const [isClient, setIsClient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [selectedVaultMint, setSelectedVaultMint] = useState('');
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = useTranslations(locale);
  const { success, error, info } = useNotification();
  const { getProgram } = usePurifyProgram();
  
  // Fetch real on-chain data
  const { config, loading: configLoading } = useProtocolConfig();
  const vaultStatePubkey = selectedVaultMint ? 
    (() => {
      try {
        const mint = new PublicKey(selectedVaultMint);
        const [vaultState] = findVaultStateAddress(mint);
        return vaultState;
      } catch {
        return undefined;
      }
    })() : undefined;
  const { proposals, loading: proposalsLoading } = useVaultBurnProposals(vaultStatePubkey);

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

  const handleCreateProposal = async () => {
    if (!publicKey || !selectedVaultMint || !proposalAmount) {
      error('Missing Information', 'Please provide vault mint and amount');
      return;
    }

    const amount = parseFloat(proposalAmount);
    if (isNaN(amount) || amount <= 0) {
      error('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      const mint = new PublicKey(selectedVaultMint);
      const [vaultState] = findVaultStateAddress(mint);
      const program = getProgram();

      info('Creating Proposal', 'Please approve the transaction...');

      const instruction = await createBurnProposal(
        program,
        vaultState,
        publicKey,
        amount
      );

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      success('Proposal Created', 'Your burn proposal has been created successfully');
      setShowCreateModal(false);
      setProposalAmount('');
    } catch (err) {
      const errorMsg = parseSolanaError(err);
      error(errorMsg.title, errorMsg.message);
    }
  };

  const handleVote = async (proposal: typeof proposals[0]) => {
    if (!publicKey) return;

    try {
      const vaultState = new PublicKey(proposal.vault);
      const proposer = new PublicKey(proposal.proposer);
      const program = getProgram();

      info('Voting', 'Please approve the transaction...');

      const instruction = await voteOnProposal(
        program,
        vaultState,
        proposer,
        publicKey
      );

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      success('Vote Submitted', 'Your vote has been recorded');
    } catch (err) {
      const errorMsg = parseSolanaError(err);
      error(errorMsg.title, errorMsg.message);
    }
  };

  const handleExecute = async (proposal: typeof proposals[0]) => {
    if (!publicKey) return;

    try {
      const vaultState = new PublicKey(proposal.vault);
      const proposer = new PublicKey(proposal.proposer);
      
      // Extract mint from vault state (we need to fetch it or pass it)
      // For now, we'll need the mint address - this should be passed or fetched
      // This is a limitation - we need the mint to execute
      error('Execution Error', 'Mint address required. Please provide the mint address for this vault.');
      return;

      // Uncomment when mint is available:
      // const mint = new PublicKey(selectedVaultMint);
      // const program = getProgram();
      // const instruction = await executeBurnProposal(program, mint, vaultState, proposer);
      // ... rest of execution logic
    } catch (err) {
      const errorMsg = parseSolanaError(err);
      error(errorMsg.title, errorMsg.message);
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading Governance..." />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#03150f] via-[#09261f] to-[#010a07] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-emerald-400 mb-4">Please connect your wallet to access governance</p>
          <p className="text-gray-400 text-sm">Redirecting to homepage...</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {locale === 'id' ? 'Governance' : 'Governance'}
              </h1>
              <p className="text-gray-300">
                {locale === 'id' 
                  ? 'Kelola protokol melalui voting dan proposal' 
                  : 'Manage protocol through voting and proposals'
                }
              </p>
            </div>
            
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={20} />
              <span>{locale === 'id' ? 'Buat Proposal' : 'Create Proposal'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Protocol Status */}
        <div className="mb-8">
          {configLoading ? (
            <LoadingSpinner text="Loading protocol status..." />
          ) : (
            <ProtocolStatus config={config} />
          )}
        </div>

        {/* Vault Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {locale === 'id' ? 'Pilih Vault (Mint Address)' : 'Select Vault (Mint Address)'}
          </label>
          <input
            type="text"
            value={selectedVaultMint}
            onChange={(e) => setSelectedVaultMint(e.target.value)}
            placeholder="Enter mint address..."
            className="w-full bg-white/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: <Vote className="text-emerald-400" size={24} />,
              label: locale === 'id' ? 'Total Proposal' : 'Total Proposals',
              value: proposalsLoading ? '...' : proposals.length.toString(),
            },
            {
              icon: <TrendingUp className="text-orange-400" size={24} />,
              label: locale === 'id' ? 'Pending' : 'Pending',
              value: proposalsLoading ? '...' : proposals.filter(p => p.status === 'Pending').length.toString(),
            },
            {
              icon: <CheckCircle2 className="text-cyan-400" size={24} />,
              label: locale === 'id' ? 'Approved' : 'Approved',
              value: proposalsLoading ? '...' : proposals.filter(p => p.status === 'Approved').length.toString(),
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                {stat.icon}
                <span className="text-gray-400 text-sm">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Proposals List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Vote className="text-emerald-400" size={28} />
            <span>{locale === 'id' ? 'Burn Proposals' : 'Burn Proposals'}</span>
          </h2>

          {proposalsLoading ? (
            <LoadingSpinner text="Loading proposals..." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map((proposal, index) => {
                // Convert onchain proposal format to governance format
                const governanceProposal = {
                  vault: proposal.vault,
                  proposer: proposal.proposer,
                  amount: proposal.amount,
                  votes: proposal.votes,
                  voters: proposal.voters,
                  createdAt: proposal.createdAt,
                  executedAt: proposal.executedAt || undefined,
                  status: proposal.status,
                };

                // We need vault balance and threshold - these should be fetched
                // For now, using placeholder values
                const vaultBalance = 5000000; // TODO: Fetch from vault state
                const threshold = 2; // TODO: Fetch from vault state or config
                const lastBurnTime = null; // TODO: Fetch from vault state

                return (
                  <BurnProposalCard
                    key={index}
                    proposal={governanceProposal}
                    vaultBalance={vaultBalance}
                    threshold={threshold}
                    lastBurnTime={lastBurnTime}
                    onVote={() => handleVote(proposal)}
                    onExecute={() => handleExecute(proposal)}
                  />
                );
              })}
            </div>
          )}

          {!proposalsLoading && proposals.length === 0 && (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-emerald-500/20">
              <Vote className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-400">
                {locale === 'id' 
                  ? 'Belum ada proposal. Buat proposal pertama Anda!'
                  : 'No proposals yet. Create your first proposal!'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            className="bg-[#09261f] border border-emerald-500/30 rounded-2xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {locale === 'id' ? 'Buat Burn Proposal' : 'Create Burn Proposal'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'id' ? 'Vault Mint Address' : 'Vault Mint Address'}
                </label>
                <input
                  type="text"
                  value={selectedVaultMint}
                  onChange={(e) => setSelectedVaultMint(e.target.value)}
                  placeholder="Enter mint address..."
                  className="w-full bg-white/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'id' ? 'Amount' : 'Amount'}
                </label>
                <input
                  type="number"
                  value={proposalAmount}
                  onChange={(e) => setProposalAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full bg-white/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setProposalAmount('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {locale === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateProposal}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {locale === 'id' ? 'Buat' : 'Create'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
