// src/utils/constants.ts
import { PublicKey } from '@solana/web3.js';

export const PURIFY_PROGRAM_ID = new PublicKey('6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

// Network
export const NETWORK = 'devnet' as const;
export const RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Token decimals
export const TOKEN_DECIMALS = 9;

// Default certificate metadata
export const DEFAULT_CERTIFICATE_URI = 'https://arweave.net/example-certificate-metadata';