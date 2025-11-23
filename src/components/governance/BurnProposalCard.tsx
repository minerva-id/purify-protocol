"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { BurnProposal } from '@/utils/governance';
import {
  canUserVote,
  canExecuteProposal,
  getProposalStatusColor,
  getProposalStatusBadge,
  getVotingProgress,
  formatTimeRemaining,
  isTimeLockActive,
} from '@/utils/governance';
import { LoadingButton } from '@/components/common/LoadingButton';
import { useNotification } from '@/contexts/NotificationContext';

interface BurnProposalCardProps {
  proposal: BurnProposal;
  vaultBalance: number;
  threshold: number;
  lastBurnTime?: number | null;
  onVote?: () => Promise<void>;
  onExecute?: () => Promise<void>;
}

export const BurnProposalCard: React.FC<BurnProposalCardProps> = ({
  proposal,
  vaultBalance,
  threshold,
  lastBurnTime,
  onVote,
  onExecute,
}) => {
  const { publicKey } = useWallet();
  const { success, error, info } = useNotification();
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const canVote = publicKey ? canUserVote(proposal, publicKey.toString()) : false;
  const timeLock = isTimeLockActive(lastBurnTime || null);
  const canExecute = canExecuteProposal(proposal, vaultBalance, timeLock.active);
  const votingProgress = getVotingProgress(proposal.votes, threshold);

  const handleVote = async () => {
    if (!onVote || !publicKey) return;

    setIsVoting(true);
    try {
      await onVote();
      success('Vote Submitted', 'Your vote has been recorded');
    } catch (err) {
      error('Vote Failed', err instanceof Error ? err.message : 'Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  const handleExecute = async () => {
    if (!onExecute || !canExecute.canExecute) return;

    setIsExecuting(true);
    try {
      await onExecute();
      success('Proposal Executed', 'Burn proposal has been executed successfully');
    } catch (err) {
      error('Execution Failed', err instanceof Error ? err.message : 'Failed to execute proposal');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Flame className="text-orange-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Burn Proposal</h3>
            <p className="text-sm text-gray-400">
              {new Date(proposal.createdAt * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getProposalStatusColor(proposal.status)} bg-white/10`}>
          {getProposalStatusBadge(proposal.status)}
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Burn Amount</span>
          <span className="text-xl font-bold text-orange-400">
            {proposal.amount.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((proposal.amount / vaultBalance) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Vault Balance: {vaultBalance.toLocaleString()}
        </p>
      </div>

      {/* Voting Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Users className="text-cyan-400" size={16} />
            <span className="text-gray-400 text-sm">Votes</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {proposal.votes} / {threshold}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all"
            style={{ width: `${votingProgress.percentage}%` }}
          />
        </div>
        {votingProgress.remaining > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {votingProgress.remaining} more vote{votingProgress.remaining !== 1 ? 's' : ''} needed
          </p>
        )}
      </div>

      {/* Voters List */}
      {proposal.voters.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Voters:</p>
          <div className="flex flex-wrap gap-2">
            {proposal.voters.map((voter, index) => (
              <span
                key={index}
                className="text-xs bg-white/10 px-2 py-1 rounded"
                title={voter}
              >
                {voter.slice(0, 4)}...{voter.slice(-4)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Time Lock Warning */}
      {timeLock.active && proposal.status === 'Approved' && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="text-yellow-400" size={16} />
            <span className="text-sm text-yellow-300">
              Time lock active: {formatTimeRemaining(timeLock.remainingSeconds)} remaining
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canVote && (
          <LoadingButton
            onClick={handleVote}
            isLoading={isVoting}
            className="flex-1"
            loadingText="Voting..."
          >
            <CheckCircle2 size={18} />
            <span>Vote</span>
          </LoadingButton>
        )}

        {proposal.status === 'Approved' && canExecute.canExecute && (
          <LoadingButton
            onClick={handleExecute}
            isLoading={isExecuting}
            variant="danger"
            className="flex-1"
            loadingText="Executing..."
          >
            <Flame size={18} />
            <span>Execute</span>
          </LoadingButton>
        )}

        {proposal.status === 'Approved' && !canExecute.canExecute && (
          <div className="flex-1 p-3 bg-gray-700/50 rounded-lg text-center">
            <p className="text-xs text-gray-400">{canExecute.reason}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BurnProposalCard;

