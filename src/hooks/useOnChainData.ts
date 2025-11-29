// src/hooks/useOnChainData.ts
import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  fetchProtocolStats,
  fetchUserContribution,
  fetchUserVaults,
  fetchVaultState,
  fetchProtocolConfig,
  fetchVaultBurnProposals,
  VaultData,
  UserContributionData
} from '@/utils/onchain';

const CONFIG_CACHE_KEY = 'purify_protocol_config';
const PROPOSALS_CACHE_KEY_PREFIX = 'purify_vault_proposals_';

export const useProtocolStats = () => {
  const { connection } = useConnection();
  const [stats, setStats] = useState({
    totalVaults: 0,
    totalDeposited: 0,
    totalBurned: 0,
    activeVaults: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchProtocolStats(connection);
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch protocol stats'));
        console.error('Error loading protocol stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [connection]);

  return { stats, loading, error };
};

export const useUserContribution = (mint?: PublicKey) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [contribution, setContribution] = useState<UserContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!publicKey || !mint) {
      setLoading(false);
      return;
    }

    const loadContribution = async () => {
      try {
        setLoading(true);
        const data = await fetchUserContribution(connection, mint, publicKey);
        setContribution(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user contribution'));
        console.error('Error loading user contribution:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContribution();

    // Refresh every 10 seconds
    const interval = setInterval(loadContribution, 10000);
    return () => clearInterval(interval);
  }, [connection, publicKey, mint]);

  return { contribution, loading, error };
};

export const useUserVaults = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!publicKey) {
      setLoading(false);
      return;
    }

    const loadVaults = async () => {
      try {
        setLoading(true);
        const data = await fetchUserVaults(connection, publicKey);
        setVaults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user vaults'));
        console.error('Error loading user vaults:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVaults();

    // Refresh every 15 seconds
    const interval = setInterval(loadVaults, 15000);
    return () => clearInterval(interval);
  }, [connection, publicKey]);

  return { vaults, loading, error };
};

export const useVaultState = (mint?: PublicKey) => {
  const { connection } = useConnection();
  const [vaultState, setVaultState] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!mint) {
      setLoading(false);
      return;
    }

    const loadVaultState = async () => {
      try {
        setLoading(true);
        const data = await fetchVaultState(connection, mint);
        setVaultState(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch vault state'));
        console.error('Error loading vault state:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVaultState();

    // Refresh every 10 seconds
    const interval = setInterval(loadVaultState, 10000);
    return () => clearInterval(interval);
  }, [connection, mint]);

  return { vaultState, loading, error };
};

export const useProtocolConfig = () => {
  const { connection } = useConnection();
  const [config, setConfig] = useState<{
    authority: string;
    feeRecipient: string;
    feeBasisPoints: number;
    paused: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(CONFIG_CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && cached.data) {
          const fresh = cached.ts && typeof cached.ts === 'number' ? Date.now() - cached.ts < 30000 : true;
          if (fresh) {
            setConfig(cached.data);
            setLoading(false);
          }
        }
      }
    } catch { }
  }, []);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const data = await fetchProtocolConfig(connection);
        setConfig(data);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              CONFIG_CACHE_KEY,
              JSON.stringify({ data, ts: Date.now() })
            );
          } catch { }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch protocol config'));
        console.error('Error loading protocol config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();

    // Refresh every 30 seconds
    const interval = setInterval(loadConfig, 30000);
    return () => clearInterval(interval);
  }, [connection]);

  return { config, loading, error };
};

export const useVaultBurnProposals = (vaultState?: PublicKey) => {
  const { connection } = useConnection();
  const [proposals, setProposals] = useState<Array<{
    vault: string;
    proposer: string;
    amount: number;
    votes: number;
    voters: string[];
    createdAt: number;
    executedAt: number | null;
    status: 'Pending' | 'Approved' | 'Executed' | 'Rejected';
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!vaultState) return;
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(PROPOSALS_CACHE_KEY_PREFIX + vaultState.toBase58());
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached && Array.isArray(cached.data)) {
          const fresh = cached.ts && typeof cached.ts === 'number' ? Date.now() - cached.ts < 15000 : true;
          if (fresh) {
            setProposals(cached.data);
            setLoading(false);
          }
        }
      }
    } catch { }
  }, [vaultState]);

  useEffect(() => {
    if (!vaultState) {
      setLoading(false);
      return;
    }

    const loadProposals = async () => {
      try {
        setLoading(true);
        const data = await fetchVaultBurnProposals(connection, vaultState);
        setProposals(data);
        if (typeof window !== 'undefined') {
          try {
            window.localStorage.setItem(
              PROPOSALS_CACHE_KEY_PREFIX + vaultState.toBase58(),
              JSON.stringify({ data, ts: Date.now() })
            );
          } catch { }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch burn proposals'));
        console.error('Error loading burn proposals:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProposals();

    // Refresh every 15 seconds
    const interval = setInterval(loadProposals, 15000);
    return () => clearInterval(interval);
  }, [connection, vaultState]);

  return { proposals, loading, error };
};
