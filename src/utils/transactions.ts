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
  const [vaultState] = findVaultStateAddress(mint);

  return await program.methods
    .initializeVault(metadataUri)
    .accounts({
      vaultState,
      mint,
      authority,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
};

export const depositToVault = async (
  program: Program<Idl>,
  mint: PublicKey,
  depositor: PublicKey,
  amount: number
) => {
  const [vaultState] = findVaultStateAddress(mint);
  const [vaultAuthority] = findVaultAuthorityAddress(mint);
  const [userContribution] = findUserContributionAddress(mint, depositor);

  const depositorAta = await getAssociatedTokenAddress(mint, depositor);
  const vaultAta = await getAssociatedTokenAddress(mint, vaultAuthority, true);

  const amountInBaseUnits = new BN(amount * Math.pow(10, 9)); // Adjust decimals as needed

  return await program.methods
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
};

export const burnFromVault = async (
  program: Program<Idl>,
  mint: PublicKey,
  authority: PublicKey,
  amount: number
) => {
  const [vaultState] = findVaultStateAddress(mint);
  const [vaultAuthority] = findVaultAuthorityAddress(mint);
  const [userContribution] = findUserContributionAddress(mint, authority);

  const vaultAta = await getAssociatedTokenAddress(mint, vaultAuthority, true);

  const amountInBaseUnits = new BN(amount * Math.pow(10, 9));

  return await program.methods
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
};

export const mintCertificate = async (
  program: Program<Idl>,
  mint: PublicKey,
  authority: PublicKey,
  name: string = "Recycling Certificate",
  symbol: string = "CERT",
  uri: string = "https://arweave.net/example-certificate"
) => {
  const [vaultState] = findVaultStateAddress(mint);
  const [userContribution] = findUserContributionAddress(mint, authority);
  const [certificateMint] = findCertificateMintAddress(mint, authority);

  const certificateMetadata = await getMetadataAddress(certificateMint);
  const certificateTokenAccount = await getAssociatedTokenAddress(certificateMint, authority);

  return await program.methods
    .mintCertificate(name, symbol, uri)
    .accounts({
      vaultState,
      userContribution,
      certificateMint,
      certificateMetadata,
      certificateTokenAccount,
      authority,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: PublicKey.default, // SystemProgram will handle rent
    })
    .instruction();
};