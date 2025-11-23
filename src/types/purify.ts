// src/types/purify.ts
// Minimal, valid Anchor IDL export for the Purify program.

import type { Idl } from '@coral-xyz/anchor';

const IDL = {
  version: '0.1.0',
  name: 'purify',
  instructions: [],
  accounts: [
    {
      name: 'VaultState',
      type: {
        kind: 'struct',
        fields: [
          { name: 'mint', type: 'publicKey' },
          { name: 'authority', type: 'publicKey' },
          { name: 'totalDeposited', type: 'u64' },
          { name: 'totalBurned', type: 'u64' },
          { name: 'status', type: { defined: 'VaultStatus' } },
          { name: 'metadataUri', type: 'string' },
          { name: 'createdAt', type: 'i64' },
          { name: 'bump', type: 'u8' }
        ]
      }
    },
    {
      name: 'UserContribution',
      type: {
        kind: 'struct',
        fields: [
          { name: 'user', type: 'publicKey' },
          { name: 'mint', type: 'publicKey' },
          { name: 'amountDeposited', type: 'u64' },
          { name: 'amountBurned', type: 'u64' },
          { name: 'lastUpdated', type: 'i64' },
          { name: 'bump', type: 'u8' }
        ]
      }
    }
  ],
  types: [
    {
      name: 'VaultStatus',
      type: { kind: 'enum', variants: [{ name: 'Active' }, { name: 'Closed' }] }
    }
  ],
  events: [],
  errors: []
} as unknown as Idl;

export default IDL;