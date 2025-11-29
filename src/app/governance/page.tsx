"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { PublicKey, Transaction } from '@solana/web3.js';
import {
  Vote,
  Plus,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { BurnProposalCard } from '@/components/governance/BurnProposalCard';
import { ProtocolStatus } from '@/components/governance/ProtocolStatus';
import { LoadingButton } from '@/components/common/LoadingButton';
import { useNotification } from '@/contexts/NotificationContext';
import { useProtocolConfig, useVaultBurnProposals, useVaultState } from '@/hooks/useOnChainData';
import { useVaultSuggestions } from '@/hooks/useVaultSuggestions';
import { usePurifyProgram } from '@/utils/program';
import { createBurnProposal, voteOnProposal, executeBurnProposal, pauseProtocol, unpauseProtocol, initializeProtocolConfig } from '@/utils/transactions';
import { findVaultStateAddress } from '@/utils/program';
import { parseSolanaError } from '@/utils/onchain';

export default function GovernancePage() {
  const [isClient, setIsClient] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [selectedVaultMint, setSelectedVaultMint] = useState('');
  const [mintPublicKey, setMintPublicKey] = useState<PublicKey | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isPausing, setIsPausing] = useState(false);
  const [isUnpausing, setIsUnpausing] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  const { locale } = useLanguage();
  const t = useTranslations(locale);
  const { success, error, info } = useNotification();
  const { getProgram } = usePurifyProgram();

  useEffect(() => {
    if (!selectedVaultMint) {
      setMintPublicKey(null);
      setMintError(null);
      return;
    }

    try {
      setMintPublicKey(new PublicKey(selectedVaultMint));
      setMintError(null);
    } catch (err) {
      console.error('Invalid mint address', err);
      setMintPublicKey(null);
      setMintError('Invalid mint address');
    }
  }, [selectedVaultMint]);

  // Fetch real on-chain data
  const { config, loading: configLoading } = useProtocolConfig();
  const vaultStatePubkey = useMemo(() => {
    if (!mintPublicKey) return undefined;
    const [vaultState] = findVaultStateAddress(mintPublicKey);
    return vaultState;
  }, [mintPublicKey]);
  const { proposals, loading: proposalsLoading } = useVaultBurnProposals(vaultStatePubkey);
  const { vaultState, loading: vaultStateLoading } = useVaultState(mintPublicKey ?? undefined);
  const { suggestions, addSuggestion } = useVaultSuggestions();
  const TARGET_AUTHORITY = 'BkU2ybkoxv9FKfkmCWcSpKAo2cy3FhkEtCrE72bDZH6R';
  const DEFAULT_FEE_RECIPIENT = TARGET_AUTHORITY;

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

  useEffect(() => {
    if (vaultState && mintPublicKey) {
      addSuggestion({
        mint: mintPublicKey.toBase58(),
        label: vaultState.metadataUri || `Vault ${mintPublicKey.toBase58().slice(0, 4)}...`,
      });
    }
  }, [vaultState, mintPublicKey, addSuggestion]);

  const handleCreateProposal = async () => {
    if (!publicKey || !mintPublicKey || !proposalAmount) {
      error('Missing Information', 'Please provide vault mint and amount');
      return;
    }

    const amount = parseFloat(proposalAmount);
    if (isNaN(amount) || amount <= 0) {
      error('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    try {
      const [vaultStateAddress] = findVaultStateAddress(mintPublicKey);
      const program = getProgram();

      info('Creating Proposal', 'Please approve the transaction...');

      const instruction = await createBurnProposal(
        program,
        vaultStateAddress,
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
      if (!mintPublicKey) {
        error('Missing Mint', 'Please enter a valid mint before executing proposals');
        return;
      }

      const vaultState = new PublicKey(proposal.vault);
      const proposer = new PublicKey(proposal.proposer);
      const program = getProgram();
      const feeRecipientPubkey = config?.feeRecipient ? new PublicKey(config.feeRecipient) : undefined;

      info('Executing Proposal', 'Please approve the transaction...');

      const instruction = await executeBurnProposal(
        program,
        mintPublicKey,
        vaultState,
        proposer,
        feeRecipientPubkey
      );

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      success('Proposal Executed', 'Burn proposal has been executed');
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
        <div className="mb-8 space-y-4">
          {configLoading ? (
            <LoadingSpinner text="Loading protocol status..." />
          ) : (
            <>
              <ProtocolStatus config={config} />
              {!config && publicKey && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-200 mb-2">
                    {locale === 'id' ? 'Konfigurasi protokol belum diinisialisasi.' : 'Protocol configuration is not initialized.'}
                  </p>
                  {publicKey.toString() === TARGET_AUTHORITY ? (
                    <LoadingButton
                      isLoading={false}
                      onClick={async () => {
                        try {
                          const program = getProgram();
                          const feeRecipient = new PublicKey(DEFAULT_FEE_RECIPIENT);
                          const instruction = await initializeProtocolConfig(program, publicKey, feeRecipient);
                          const transaction = new Transaction().add(instruction);
                          transaction.feePayer = publicKey;
                          transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                          info(locale === 'id' ? 'Inisialisasi Konfigurasi' : 'Initializing Configuration', locale === 'id' ? 'Setujui transaksi di wallet Anda' : 'Approve the transaction in your wallet');
                          const signature = await sendTransaction(transaction, connection);
                          await connection.confirmTransaction(signature, 'confirmed');
                          success(locale === 'id' ? 'Konfigurasi Diinisialisasi' : 'Configuration Initialized', locale === 'id' ? 'Authority dan fee recipient diset' : 'Authority and fee recipient set');
                        } catch (err) {
                          const errorMsg = parseSolanaError(err);
                          error(errorMsg.title, errorMsg.message);
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    >
                      {locale === 'id' ? 'Inisialisasi Protocol Config' : 'Initialize Protocol Config'}
                    </LoadingButton>
                  ) : (
                    <p className="text-xs text-yellow-300">
                      {locale === 'id'
                        ? `Hubungkan wallet authority (${TARGET_AUTHORITY.slice(0, 6)}…) untuk inisialisasi.`
                        : `Connect authority wallet (${TARGET_AUTHORITY.slice(0, 6)}…) to initialize.`}
                    </p>
                  )}
                </div>
              )}
              {config && publicKey && config.authority === publicKey.toString() && (
                <div className="flex flex-wrap gap-3">
                  <LoadingButton
                    isLoading={isPausing}
                    disabled={config.paused || isPausing}
                    onClick={async () => {
                      if (!publicKey) return;
                      setIsPausing(true);
                      try {
                        const program = getProgram();
                        const instruction = await pauseProtocol(program, publicKey);
                        const transaction = new Transaction().add(instruction);
                        transaction.feePayer = publicKey;
                        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                        info('Pausing Protocol', 'Approve the transaction to pause the protocol.');
                        const signature = await sendTransaction(transaction, connection);
                        await connection.confirmTransaction(signature, 'confirmed');
                        success('Protocol Paused', 'Protocol operations are paused.');
                      } catch (err) {
                        const errorMsg = parseSolanaError(err);
                        error(errorMsg.title, errorMsg.message);
                      } finally {
                        setIsPausing(false);
                      }
                    }}
                  >
                    Pause Protocol
                  </LoadingButton>
                  <LoadingButton
                    isLoading={isUnpausing}
                    disabled={!config.paused || isUnpausing}
                    onClick={async () => {
                      if (!publicKey) return;
                      setIsUnpausing(true);
                      try {
                        const program = getProgram();
                        const instruction = await unpauseProtocol(program, publicKey);
                        const transaction = new Transaction().add(instruction);
                        transaction.feePayer = publicKey;
                        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                        info('Resuming Protocol', 'Approve the transaction to unpause the protocol.');
                        const signature = await sendTransaction(transaction, connection);
                        await connection.confirmTransaction(signature, 'confirmed');
                        success('Protocol Resumed', 'Protocol operations resumed.');
                      } catch (err) {
                        const errorMsg = parseSolanaError(err);
                        error(errorMsg.title, errorMsg.message);
                      } finally {
                        setIsUnpausing(false);
                      }
                    }}
                  >
                    Resume Protocol
                  </LoadingButton>
                </div>
              )}
            </>
          )}
        </div>

        {/* Vault Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {locale === 'id' ? 'Pilih Vault (Mint Address)' : 'Select Vault (Mint Address)'}
          </label>
          <input
            list="vault-suggestions"
            type="text"
            value={selectedVaultMint}
            onChange={(e) => setSelectedVaultMint(e.target.value)}
            placeholder="Enter mint address..."
            className="w-full bg-white/10 border border-emerald-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <datalist id="vault-suggestions">
            {suggestions.map((suggestion) => (
              <option
                key={suggestion.mint}
                value={suggestion.mint}
                label={suggestion.label || suggestion.mint}
              />
            ))}
          </datalist>
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.mint}
                  type="button"
                  onClick={() => setSelectedVaultMint(suggestion.mint)}
                  className="px-3 py-1 rounded-full bg-white/10 border border-emerald-500/30 text-gray-200 hover:bg-emerald-500/20 transition"
                >
                  {suggestion.label || suggestion.mint.slice(0, 6)}…
                </button>
              ))}
            </div>
          )}
          {mintError && (
            <p className="text-sm text-red-400 mt-2">{mintError}</p>
          )}
        </div>

        {/* Vault Insights */}
        <div className="mb-8">
          {mintPublicKey ? (
            vaultStateLoading ? (
              <LoadingSpinner text="Loading vault data..." />
            ) : vaultState ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-gray-400 mb-1">Total Deposited</p>
                  <p className="text-2xl font-bold text-emerald-300">{vaultState.totalDeposited.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-gray-400 mb-1">Governance Threshold</p>
                  <p className="text-2xl font-bold text-emerald-300">{vaultState.governanceThreshold ?? 2} votes</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20">
                  <p className="text-sm text-gray-400 mb-1">Last Burn</p>
                  <p className="text-2xl font-bold text-emerald-300">
                    {vaultState.lastBurnAt ? new Date(vaultState.lastBurnAt * 1000).toLocaleString() : 'No burns yet'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-200">
                {locale === 'id' ? 'Vault belum ditemukan di blockchain' : 'Vault not found on chain yet'}
              </div>
            )
          ) : (
            <div className="bg-white/5 rounded-xl p-4 border border-emerald-500/20 text-gray-300">
              {locale === 'id' ? 'Masukkan alamat mint untuk melihat detail vault' : 'Enter a mint address to view vault details'}
            </div>
          )}
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

          {!mintPublicKey && (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-emerald-500/20">
              <p className="text-gray-400">
                {locale === 'id'
                  ? 'Masukkan alamat mint untuk melihat proposal'
                  : 'Enter a mint address to view proposals'
                }
              </p>
            </div>
          )}

          {mintPublicKey && proposalsLoading && (
            <LoadingSpinner text="Loading proposals..." />
          )}

          {mintPublicKey && !proposalsLoading && proposals.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {proposals.map((proposal, index) => {
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

                const vaultBalance = vaultState?.totalDeposited ?? 0;
                const threshold = vaultState?.governanceThreshold ?? 2;
                const lastBurnTime = vaultState?.lastBurnAt ?? null;

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

          {mintPublicKey && !proposalsLoading && proposals.length === 0 && (
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
