// src/utils/governance.ts
// Governance utilities for frontend

import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import BN from 'bn.js';

export interface BurnProposal {
  vault: string;
  proposer: string;
  amount: BN;
  votes: BN;
  voters: string[];
  createdAt: BN;
  executedAt?: BN;
  status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
}

export interface ProtocolConfig {
  authority: string;
  feeRecipient: string;
  feeBasisPoints: BN;
  paused: boolean;
}

/**
 * Convert BN to number (use with caution for display only)
 */
export const bnToNumber = (bn: BN, decimals: number = 0): number => {
  return bn.toNumber() / Math.pow(10, decimals);
};

/**
 * Convert number to BN
 */
export const numberToBn = (number: number, decimals: number = 0): BN => {
  return new BN(Math.floor(number * Math.pow(10, decimals)));
};

/**
 * Calculate protocol fee
 */
export const calculateFee = (amount: BN, feeBasisPoints: BN = new BN(50)): BN => {
  const basisPoints = new BN(10000);
  return amount.mul(feeBasisPoints).div(basisPoints);
};

/**
 * Calculate net amount after fee
 */
export const calculateNetAmount = (amount: BN, feeBasisPoints: BN = new BN(50)): BN => {
  const fee = calculateFee(amount, feeBasisPoints);
  return amount.sub(fee);
};

/**
 * Format fee for display
 */
export const formatFee = (amount: BN, feeBasisPoints: BN = new BN(50), decimals: number = 0): string => {
  const fee = calculateFee(amount, feeBasisPoints);
  const feeNumber = bnToNumber(fee, decimals);
  const percentage = feeBasisPoints.toNumber() / 100;
  return `${feeNumber.toFixed(decimals)} (${percentage.toFixed(2)}%)`;
};

/**
 * Check if time lock is active
 */
export const isTimeLockActive = (
  lastOperationTime: BN | null,
  cooldownSeconds: BN = new BN(3600)
): { active: boolean; remainingSeconds: BN } => {
  if (!lastOperationTime) {
    return { active: false, remainingSeconds: new BN(0) };
  }

  const now = new BN(Math.floor(Date.now() / 1000));
  const elapsed = now.sub(lastOperationTime);
  const remaining = cooldownSeconds.sub(elapsed);
  const isActive = remaining.gt(new BN(0));

  return {
    active: isActive,
    remainingSeconds: isActive ? remaining : new BN(0),
  };
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (seconds: BN): string => {
  if (seconds.lte(new BN(0))) return 'Ready';
  
  const secondsNum = seconds.toNumber();
  const hours = Math.floor(secondsNum / 3600);
  const minutes = Math.floor((secondsNum % 3600) / 60);
  const secs = secondsNum % 60;

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
  vaultBalance: BN,
  timeLockActive: boolean
): { canExecute: boolean; reason?: string } => {
  if (proposal.status !== 'Approved') {
    return { canExecute: false, reason: 'Proposal is not approved' };
  }

  if (proposal.amount.gt(vaultBalance)) {
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
  currentVotes: BN,
  threshold: BN
): { percentage: number; remaining: BN } => {
  const currentNum = currentVotes.toNumber();
  const thresholdNum = threshold.toNumber();
  const percentage = Math.min(100, (currentNum / thresholdNum) * 100);
  const remaining = threshold.sub(currentVotes);

  return { 
    percentage, 
    remaining: remaining.gt(new BN(0)) ? remaining : new BN(0) 
  };
};

/**
 * Compare two BN values
 */
export const areBnsEqual = (a: BN, b: BN): boolean => {
  return a.eq(b);
};

/**
 * Check if BN is zero
 */
export const isBnZero = (value: BN): boolean => {
  return value.isZero();
};

/**
 * Sum array of BN values
 */
export const sumBns = (values: BN[]): BN => {
  return values.reduce((acc, curr) => acc.add(curr), new BN(0));
};

/**
 * Format BN for display with decimals
 */
export const formatBn = (value: BN, decimals: number = 0): string => {
  const numberValue = bnToNumber(value, decimals);
  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

/**
 * Create BN from string
 */
export const bnFromString = (value: string, decimals: number = 0): BN => {
  const numberValue = parseFloat(value) * Math.pow(10, decimals);
  return new BN(Math.floor(numberValue));
};

/**
 * Safe BN operations with error handling
 */
export const safeBnOperation = <T>(operation: () => T, fallback: T): T => {
  try {
    return operation();
  } catch (error) {
    console.error('BN operation failed:', error);
    return fallback;
  }
};