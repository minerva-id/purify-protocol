// src/utils/onchain.ts
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import type { Wallet } from '@coral-xyz/anchor';
import { 
  findVaultStateAddress, 
  findUserContributionAddress,
  findCertificateMintAddress,
  findProtocolConfigAddress,
  findBurnProposalAddress
} from './program';
import { PURIFY_PROGRAM_ID } from './constants';
import PurifyIdl from '../../../target/idl/purify.json';
import type { Purify } from '../../../target/types/purify';

const READONLY_KEYPAIR = Keypair.generate();

const READONLY_WALLET: Wallet = {
  publicKey: READONLY_KEYPAIR.publicKey,
  payer: READONLY_KEYPAIR,
  async signTransaction<T>(tx: T): Promise<T> {
    return tx;
  },
  async signAllTransactions<T>(txs: T[]): Promise<T[]> {
    return txs;
  },
};

const getReadonlyProgram = (connection: Connection) => {
  const provider = new AnchorProvider(connection, READONLY_WALLET, {
    commitment: 'confirmed',
  });
  const idl = { ...(PurifyIdl as Purify), address: PURIFY_PROGRAM_ID.toBase58() };
  return new Program(idl as Purify, provider);
};

export interface VaultData {
  mint: string;
  authority: string;
  totalDeposited: number;
  totalBurned: number;
  status: 'Active' | 'Closed';
  metadataUri: string;
  createdAt: number;
  // New optional fields for governance and time locks
  governanceEnabled?: boolean | null;
  governanceThreshold?: number | null;
  lastBurnAt?: number | null;
}

export interface UserContributionData {
  user: string;
  mint: string;
  amountDeposited: number;
  amountBurned: number;
  lastUpdated: number;
}

export interface CertificateData {
  mint: string;
  owner: string;
  amountBurned: number;
  issuedAt: number;
  metadataUri: string;
}

/**
 * Fetch vault state from blockchain
 */
export const fetchVaultState = async (
  connection: Connection,
  mint: PublicKey
): Promise<VaultData | null> => {
  try {
    const [vaultState] = findVaultStateAddress(mint);
    
    const program = getReadonlyProgram(connection);

    const vaultAccount = await (program.account as any).vaultState.fetch(vaultState);
    
    return {
      mint: vaultAccount.mint.toString(),
      authority: vaultAccount.authority.toString(),
      totalDeposited: vaultAccount.totalDeposited.toNumber(),
      totalBurned: vaultAccount.totalBurned.toNumber(),
      status: vaultAccount.status.active ? 'Active' : 'Closed',
      metadataUri: vaultAccount.metadataUri,
      createdAt: vaultAccount.createdAt.toNumber(),
      // New optional fields
      governanceEnabled: vaultAccount.governanceEnabled !== null && vaultAccount.governanceEnabled !== undefined 
        ? (typeof vaultAccount.governanceEnabled === 'boolean' ? vaultAccount.governanceEnabled : vaultAccount.governanceEnabled.toJSON()) 
        : null,
      governanceThreshold: vaultAccount.governanceThreshold !== null && vaultAccount.governanceThreshold !== undefined
        ? (typeof vaultAccount.governanceThreshold === 'number' ? vaultAccount.governanceThreshold : vaultAccount.governanceThreshold.toNumber())
        : null,
      lastBurnAt: vaultAccount.lastBurnAt !== null && vaultAccount.lastBurnAt !== undefined
        ? (typeof vaultAccount.lastBurnAt === 'number' ? vaultAccount.lastBurnAt : vaultAccount.lastBurnAt.toNumber())
        : null,
    };
  } catch (error) {
    console.error('Error fetching vault state:', error);
    return null;
  }
};

/**
 * Fetch user contribution data
 */
export const fetchUserContribution = async (
  connection: Connection,
  mint: PublicKey,
  user: PublicKey
): Promise<UserContributionData | null> => {
  try {
    const [userContribution] = findUserContributionAddress(mint, user);
    
    const program = getReadonlyProgram(connection);

    const contributionAccount = await (program.account as any).userContribution.fetch(userContribution);
    
    return {
      user: contributionAccount.user.toString(),
      mint: contributionAccount.mint.toString(),
      amountDeposited: contributionAccount.amountDeposited.toNumber(),
      amountBurned: contributionAccount.amountBurned.toNumber(),
      lastUpdated: contributionAccount.lastUpdated.toNumber(),
    };
  } catch (error) {
    // User contribution might not exist yet
    if (error instanceof Error && error.message.includes('Account does not exist')) {
      return null;
    }
    console.error('Error fetching user contribution:', error);
    return null;
  }
};

/**
 * Fetch certificate data
 */
export const fetchCertificate = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<CertificateData | null> => {
  try {
    const [certificate] = findCertificateMintAddress(mint, owner);
    
    const program = getReadonlyProgram(connection);

    const certificateAccount = await (program.account as any).certificate.fetch(certificate);
    
    return {
      mint: certificateAccount.mint.toString(),
      owner: certificateAccount.owner.toString(),
      amountBurned: certificateAccount.amountBurned.toNumber(),
      issuedAt: certificateAccount.issuedAt.toNumber(),
      metadataUri: certificateAccount.metadataUri,
    };
  } catch (error) {
    // Certificate might not exist
    if (error instanceof Error && error.message.includes('Account does not exist')) {
      return null;
    }
    console.error('Error fetching certificate:', error);
    return null;
  }
};

/**
 * Fetch all vaults for a user (by scanning events)
 */
export const fetchUserVaults = async (
  connection: Connection,
  user: PublicKey
): Promise<VaultData[]> => {
  try {
    const program = getReadonlyProgram(connection);

    // Fetch deposit events for this user
    const depositEvents = await (program.account as any).vaultState.all([
      {
        memcmp: {
          offset: 8 + 32, // Skip discriminator and mint
          bytes: user.toBase58(),
        },
      },
    ]);

    const vaults: VaultData[] = [];
    
    for (const event of depositEvents) {
      const vaultData: VaultData = {
        mint: event.account.mint.toString(),
        authority: event.account.authority.toString(),
        totalDeposited: event.account.totalDeposited.toNumber(),
        totalBurned: event.account.totalBurned.toNumber(),
        status: event.account.status.active ? 'Active' : 'Closed',
        metadataUri: event.account.metadataUri,
        createdAt: event.account.createdAt.toNumber(),
      };
      vaults.push(vaultData);
    }

    return vaults;
  } catch (error) {
    console.error('Error fetching user vaults:', error);
    return [];
  }
};

/**
 * Fetch protocol statistics
 */
export const fetchProtocolStats = async (
  connection: Connection
): Promise<{
  totalVaults: number;
  totalDeposited: number;
  totalBurned: number;
  activeVaults: number;
}> => {
  try {
    const program = getReadonlyProgram(connection);

    const allVaults = await (program.account as any).vaultState.all();
    
    let totalDeposited = 0;
    let totalBurned = 0;
    let activeVaults = 0;

    for (const vault of allVaults) {
      totalDeposited += vault.account.totalDeposited.toNumber();
      totalBurned += vault.account.totalBurned.toNumber();
      if (vault.account.status.active) {
        activeVaults++;
      }
    }

    return {
      totalVaults: allVaults.length,
      totalDeposited,
      totalBurned,
      activeVaults,
    };
  } catch (error) {
    console.error('Error fetching protocol stats:', error);
    return {
      totalVaults: 0,
      totalDeposited: 0,
      totalBurned: 0,
      activeVaults: 0,
    };
  }
};

/**
 * Parse Solana error messages to user-friendly format
 */
export const parseSolanaError = (error: unknown): { title: string; message: string } => {
  if (!error) {
    return {
      title: 'Unknown Error',
      message: 'An unknown error occurred',
    };
  }

  const errorString = error instanceof Error ? error.message : String(error);

  // Common Solana errors
  if (errorString.includes('User rejected')) {
    return {
      title: 'Transaction Cancelled',
      message: 'You rejected the transaction in your wallet',
    };
  }

  if (errorString.includes('Insufficient funds')) {
    return {
      title: 'Insufficient Funds',
      message: 'You do not have enough SOL to complete this transaction',
    };
  }

  if (errorString.includes('Account does not exist')) {
    return {
      title: 'Account Not Found',
      message: 'The requested account does not exist on the blockchain',
    };
  }

  if (errorString.includes('InvalidAmount')) {
    return {
      title: 'Invalid Amount',
      message: 'The amount specified is invalid. Please enter a valid amount greater than 0',
    };
  }

  if (errorString.includes('Unauthorized')) {
    return {
      title: 'Unauthorized',
      message: 'You do not have permission to perform this action',
    };
  }

  if (errorString.includes('VaultNotActive')) {
    return {
      title: 'Vault Not Active',
      message: 'This vault is not currently active',
    };
  }

  if (errorString.includes('InsufficientBalance')) {
    return {
      title: 'Insufficient Balance',
      message: 'The vault does not have enough tokens for this operation',
    };
  }

  if (errorString.includes('InsufficientContribution')) {
    return {
      title: 'Insufficient Contribution',
      message: 'You need to burn at least 1000 tokens to mint a certificate',
    };
  }

  if (errorString.includes('VaultNotEmpty')) {
    return {
      title: 'Vault Not Empty',
      message: 'Cannot close vault while it still contains tokens',
    };
  }

  // Network errors
  if (errorString.includes('Network request failed') || errorString.includes('fetch')) {
    return {
      title: 'Network Error',
      message: 'Failed to connect to the Solana network. Please check your internet connection',
    };
  }

  if (errorString.includes('ProtocolPaused')) {
    return {
      title: 'Protocol Paused',
      message: 'The protocol is currently paused. Please try again later',
    };
  }

  if (errorString.includes('TimeLockActive')) {
    return {
      title: 'Time Lock Active',
      message: 'A time lock is still active. Please wait before performing this operation',
    };
  }

  if (errorString.includes('ProposalNotPending')) {
    return {
      title: 'Proposal Not Pending',
      message: 'This proposal is no longer pending votes',
    };
  }

  if (errorString.includes('ProposalNotApproved')) {
    return {
      title: 'Proposal Not Approved',
      message: 'This proposal has not been approved yet',
    };
  }

  if (errorString.includes('AlreadyVoted')) {
    return {
      title: 'Already Voted',
      message: 'You have already voted on this proposal',
    };
  }

  // Default error
  return {
    title: 'Transaction Failed',
    message: errorString.length > 150 ? `${errorString.substring(0, 150)}...` : errorString,
  };
};

/**
 * Fetch protocol config from blockchain
 */
export const fetchProtocolConfig = async (
  connection: Connection
): Promise<{
  authority: string;
  feeRecipient: string;
  feeBasisPoints: number;
  paused: boolean;
} | null> => {
  try {
    const [configAddress] = findProtocolConfigAddress();
    
    const program = getReadonlyProgram(connection);

    const configAccount = await (program.account as any).protocolConfig.fetch(configAddress);
    
    return {
      authority: configAccount.authority.toString(),
      feeRecipient: configAccount.feeRecipient.toString(),
      feeBasisPoints: configAccount.feeBasisPoints,
      paused: configAccount.paused,
    };
  } catch (error) {
    // Protocol config might not exist yet
    if (error instanceof Error && error.message.includes('Account does not exist')) {
      return null;
    }
    console.error('Error fetching protocol config:', error);
    return null;
  }
};

/**
 * Fetch burn proposal from blockchain
 */
export const fetchBurnProposal = async (
  connection: Connection,
  vaultState: PublicKey,
  proposer: PublicKey
): Promise<{
  vault: string;
  proposer: string;
  amount: number;
  votes: number;
  voters: string[];
  createdAt: number;
  executedAt: number | null;
  status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
} | null> => {
  try {
    const [proposalAddress] = findBurnProposalAddress(vaultState, proposer);
    
    const program = getReadonlyProgram(connection);

    const proposalAccount = await (program.account as any).burnProposal.fetch(proposalAddress);
    
    // Convert ProposalStatus enum to string
    let status: 'Pending' | 'Approved' | 'Executed' | 'Rejected' = 'Pending';
    if (proposalAccount.status.pending) {
      status = 'Pending';
    } else if (proposalAccount.status.approved) {
      status = 'Approved';
    } else if (proposalAccount.status.executed) {
      status = 'Executed';
    } else if (proposalAccount.status.rejected) {
      status = 'Rejected';
    }
    
    return {
      vault: proposalAccount.vault.toString(),
      proposer: proposalAccount.proposer.toString(),
      amount: proposalAccount.amount.toNumber(),
      votes: proposalAccount.votes,
      voters: proposalAccount.voters.map((v: PublicKey) => v.toString()),
      createdAt: proposalAccount.createdAt.toNumber(),
      executedAt: proposalAccount.executedAt ? proposalAccount.executedAt.toNumber() : null,
      status,
    };
  } catch (error) {
    // Proposal might not exist
    if (error instanceof Error && error.message.includes('Account does not exist')) {
      return null;
    }
    console.error('Error fetching burn proposal:', error);
    return null;
  }
};

/**
 * Fetch all burn proposals for a vault
 */
export const fetchVaultBurnProposals = async (
  connection: Connection,
  vaultState: PublicKey
): Promise<Array<{
  vault: string;
  proposer: string;
  amount: number;
  votes: number;
  voters: string[];
  createdAt: number;
  executedAt: number | null;
  status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
}>> => {
  try {
    const program = getReadonlyProgram(connection);

    // Fetch all burn proposals for this vault
    const proposals = await (program.account as any).burnProposal.all([
      {
        memcmp: {
          offset: 8, // Skip discriminator
          bytes: vaultState.toBase58(),
        },
      },
    ]);

    return proposals.map((proposal: any) => {
      let status: 'Pending' | 'Approved' | 'Executed' | 'Rejected' = 'Pending';
      if (proposal.account.status.pending) {
        status = 'Pending';
      } else if (proposal.account.status.approved) {
        status = 'Approved';
      } else if (proposal.account.status.executed) {
        status = 'Executed';
      } else if (proposal.account.status.rejected) {
        status = 'Rejected';
      }

      return {
        vault: proposal.account.vault.toString(),
        proposer: proposal.account.proposer.toString(),
        amount: proposal.account.amount.toNumber(),
        votes: proposal.account.votes,
        voters: proposal.account.voters.map((v: PublicKey) => v.toString()),
        createdAt: proposal.account.createdAt.toNumber(),
        executedAt: proposal.account.executedAt ? proposal.account.executedAt.toNumber() : null,
        status,
      };
    });
  } catch (error) {
    console.error('Error fetching vault burn proposals:', error);
    return [];
  }
};

