/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/program.ts
import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { IDL } from '../types/purify';
import { 
  PURIFY_PROGRAM_ID, 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID 
} from './constants';

export const usePurifyProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const getProgram = (): Program<Idl> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected properly');
    }

    const provider = new AnchorProvider(
      connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    const programAny = new Program((IDL as unknown) as any, PURIFY_PROGRAM_ID as any, provider as any) as Program<Idl>;
    return programAny;
  };

  return { getProgram };
};

// PDA derivation helpers
export const findVaultStateAddress = (mint: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), mint.toBuffer()],
    PURIFY_PROGRAM_ID
  );
};

export const findVaultAuthorityAddress = (mint: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), mint.toBuffer()],
    PURIFY_PROGRAM_ID
  );
};

export const findUserContributionAddress = (mint: PublicKey, user: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('contribution'), mint.toBuffer(), user.toBuffer()],
    PURIFY_PROGRAM_ID
  );
};

export const findCertificateMintAddress = (mint: PublicKey, user: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('certificate'), mint.toBuffer(), user.toBuffer()],
    PURIFY_PROGRAM_ID
  );
};

// Token account helpers
export const getAssociatedTokenAddress = async (
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false
): Promise<PublicKey> => {
  return PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )[0];
};

export const getMetadataAddress = async (mint: PublicKey): Promise<PublicKey> => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
};