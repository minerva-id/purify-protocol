// src/utils/transactions.ts
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Program, BN, Idl } from '@coral-xyz/anchor';
import { 
  findVaultStateAddress, 
  findVaultAuthorityAddress, 
  findUserContributionAddress,
  findCertificateMintAddress,
  getAssociatedTokenAddress,
  getMetadataAddress
} from './program';
import { 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID, 
  TOKEN_METADATA_PROGRAM_ID 
} from './constants';

export const initializeVault = async (
  program: Program<Idl>,
  mint: PublicKey,
  authority: PublicKey,
  metadataUri: string = ""
) => {
  try {
    console.log('[initializeVault] Starting with:', {
      mint: mint.toString(),
      authority: authority.toString(),
      metadataUri
    });

    const [vaultState] = findVaultStateAddress(mint);
    console.log('[initializeVault] Vault State PDA:', vaultState.toString());

    const instruction = await program.methods
      .initializeVault(metadataUri)
      .accounts({
        vaultState,
        mint,
        authority,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    console.log('[initializeVault] Instruction created successfully');
    return instruction;
  } catch (error) {
    console.error('[initializeVault] Error creating instruction:', error);
    throw error;
  }
};

export const depositToVault = async (
  program: Program<Idl>,
  mint: PublicKey,
  depositor: PublicKey,
  amount: number
) => {
  try {
    console.log('[depositToVault] Starting with:', {
      mint: mint.toString(),
      depositor: depositor.toString(),
      amount
    });

    const [vaultState] = findVaultStateAddress(mint);
    const [vaultAuthority] = findVaultAuthorityAddress(mint);
    const [userContribution] = findUserContributionAddress(mint, depositor);

    const depositorAta = await getAssociatedTokenAddress(mint, depositor);
    const vaultAta = await getAssociatedTokenAddress(mint, vaultAuthority, true);

    const amountInBaseUnits = new BN(amount * Math.pow(10, 9));

    const instruction = await program.methods
      .depositToVault(amountInBaseUnits)
      .accounts({
        vaultState,
        mint,
        depositor,
        depositorAta,
        vaultAta,
        vaultAuthority,
        userContribution,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    console.log('[depositToVault] Instruction created successfully');
    return instruction;
  } catch (error) {
    console.error('[depositToVault] Error creating instruction:', error);
    throw error;
  }
};

// Similar error handling untuk fungsi lainnya...
export const burnFromVault = async (
  program: Program<Idl>,
  mint: PublicKey,
  authority: PublicKey,
  amount: number
) => {
  try {
    console.log('[burnFromVault] Starting with:', {
      mint: mint.toString(),
      authority: authority.toString(),
      amount
    });

    const [vaultState] = findVaultStateAddress(mint);
    const [vaultAuthority] = findVaultAuthorityAddress(mint);
    const [userContribution] = findUserContributionAddress(mint, authority);

    const vaultAta = await getAssociatedTokenAddress(mint, vaultAuthority, true);
    const amountInBaseUnits = new BN(amount * Math.pow(10, 9));

    const instruction = await program.methods
      .burnFromVault(amountInBaseUnits)
      .accounts({
        vaultState,
        mint,
        authority,
        vaultAta,
        vaultAuthority,
        userContribution,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .instruction();

    console.log('[burnFromVault] Instruction created successfully');
    return instruction;
  } catch (error) {
    console.error('[burnFromVault] Error creating instruction:', error);
    throw error;
  }
};

// Untuk sekarang, skip mintCertificate karena kompleks
export const mintCertificate = async (
  program: Program<Idl>,
  mint: PublicKey,
  authority: PublicKey
) => {
  console.log('[mintCertificate] Function not implemented yet');
  throw new Error('Certificate minting not implemented yet');
};