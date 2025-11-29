import { useCallback, useEffect, useState } from 'react';

export interface VaultSuggestion {
  mint: string;
  label?: string;
  description?: string;
}

const STORAGE_KEY = 'purify_vault_suggestions';
const MAX_SUGGESTIONS = 6;

const DEFAULT_SUGGESTIONS: VaultSuggestion[] = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    label: 'WSOL Vault',
    description: 'Wrapped SOL community vault',
  },
  {
    mint: '11111111111111111111111111111111',
    label: 'Protocol Treasury',
    description: 'Internal protocol vault',
  },
];

export const useVaultSuggestions = () => {
  const [suggestions, setSuggestions] = useState<VaultSuggestion[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as VaultSuggestion[];
          const map = new Map<string, VaultSuggestion>();
          [...parsed, ...DEFAULT_SUGGESTIONS].forEach((item) => {
            if (item?.mint) {
              map.set(item.mint, item);
            }
          });
          return Array.from(map.values()).slice(0, MAX_SUGGESTIONS);
        }
      }
    } catch (error) {
      console.warn('[useVaultSuggestions] failed to load suggestions', error);
    }
    return DEFAULT_SUGGESTIONS;
  });

  const persist = useCallback((items: VaultSuggestion[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('[useVaultSuggestions] failed to persist suggestions', error);
    }
  }, []);

  const addSuggestion = useCallback(
    (suggestion: VaultSuggestion) => {
      if (!suggestion?.mint) return;
      setSuggestions((prev) => {
        const map = new Map<string, VaultSuggestion>();
        map.set(suggestion.mint, suggestion);
        prev.forEach((item) => map.set(item.mint, item));
        const next = Array.from(map.values()).slice(0, MAX_SUGGESTIONS);
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { suggestions, addSuggestion };
};
