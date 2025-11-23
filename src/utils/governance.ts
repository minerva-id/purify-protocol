// src/utils/governance.ts
// Governance utilities for frontend

import { PublicKey, BN } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';

export interface BurnProposal {
  vault: string;
  proposer: string;
  amount: number;
  votes: number;
  voters: string[];
  createdAt: number;
  executedAt?: number;
  status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
}

export interface ProtocolConfig {
  authority: string;
  feeRecipient: string;
  feeBasisPoints: number;
  paused: boolean;
}

/**
 * Calculate protocol fee
 */
export const calculateFee = (amount: number, feeBasisPoints: number = 50): number => {
  return Math.floor((amount * feeBasisPoints) / 10000);
};

/**
 * Calculate net amount after fee
 */
export const calculateNetAmount = (amount: number, feeBasisPoints: number = 50): number => {
  return amount - calculateFee(amount, feeBasisPoints);
};

/**
 * Format fee for display
 */
export const formatFee = (amount: number, feeBasisPoints: number = 50): string => {
  const fee = calculateFee(amount, feeBasisPoints);
  const percentage = (feeBasisPoints / 100).toFixed(2);
  return `${fee} (${percentage}%)`;
};

/**
 * Check if time lock is active
 */
export const isTimeLockActive = (
  lastOperationTime: number | null,
  cooldownSeconds: number = 3600
): { active: boolean; remainingSeconds: number } => {
  if (!lastOperationTime) {
    return { active: false, remainingSeconds: 0 };
  }

  const now = Math.floor(Date.now() / 1000);
  const elapsed = now - lastOperationTime;
  const remaining = Math.max(0, cooldownSeconds - elapsed);

  return {
    active: remaining > 0,
    remainingSeconds: remaining,
  };
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return 'Ready';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

/**
 * Check if user can vote on proposal
 */
export const canUserVote = (proposal: BurnProposal, userPubkey: string): boolean => {
  if (proposal.status !== 'Pending') return false;
  if (proposal.voters.includes(userPubkey)) return false;
  return true;
};

/**
 * Check if proposal can be executed
 */
export const canExecuteProposal = (
  proposal: BurnProposal,
  vaultBalance: number,
  timeLockActive: boolean
): { canExecute: boolean; reason?: string } => {
  if (proposal.status !== 'Approved') {
    return { canExecute: false, reason: 'Proposal is not approved' };
  }

  if (proposal.amount > vaultBalance) {
    return { canExecute: false, reason: 'Insufficient vault balance' };
  }

  if (timeLockActive) {
    return { canExecute: false, reason: 'Time lock is still active' };
  }

  return { canExecute: true };
};

/**
 * Get proposal status color
 */
export const getProposalStatusColor = (status: BurnProposal['status']): string => {
  switch (status) {
    case 'Pending':
      return 'text-yellow-400';
    case 'Approved':
      return 'text-green-400';
    case 'Executed':
      return 'text-blue-400';
    case 'Rejected':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

/**
 * Get proposal status badge
 */
export const getProposalStatusBadge = (status: BurnProposal['status']): string => {
  switch (status) {
    case 'Pending':
      return '⏳ Pending';
    case 'Approved':
      return '✅ Approved';
    case 'Executed':
      return '✅ Executed';
    case 'Rejected':
      return '❌ Rejected';
    default:
      return '❓ Unknown';
  }
};

/**
 * Calculate voting progress
 */
export const getVotingProgress = (
  currentVotes: number,
  threshold: number
): { percentage: number; remaining: number } => {
  const percentage = Math.min(100, (currentVotes / threshold) * 100);
  const remaining = Math.max(0, threshold - currentVotes);

  return { percentage, remaining };
};

