// src/utils/program.ts
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Keypair, Connection } from '@solana/web3.js';
import IDL from '../types/purify';
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

    console.log('[usePurifyProgram] creating Program', {
      walletPublicKey: wallet.publicKey.toString(),
      programId: PURIFY_PROGRAM_ID.toString(),
      connection: !!connection
    });

    const provider = new AnchorProvider(
      connection as Connection,
      wallet as any,
      { commitment: 'confirmed' }
    );

    try {
      console.log('[usePurifyProgram] Preparing to instantiate Program — diagnostic info:');
      console.log('  - IDL present:', !!IDL);
      console.log('  - PURIFY_PROGRAM_ID present:', !!PURIFY_PROGRAM_ID);
      console.log('  - PURIFY_PROGRAM_ID type:', typeof PURIFY_PROGRAM_ID);
      try {
        console.log('  - PURIFY_PROGRAM_ID toString():', PURIFY_PROGRAM_ID?.toString?.());
      } catch (e) {
        console.warn('  - Could not toString PURIFY_PROGRAM_ID', e);
      }
      console.log('  - provider present:', !!provider);
      console.log('  - provider.connection present:', !!(provider as any)?.connection);
      console.log('  - provider.wallet present:', !!(provider as any)?.wallet);

      if (!PURIFY_PROGRAM_ID) {
        throw new Error('PURIFY_PROGRAM_ID is undefined');
      }

      // Defensive: sometimes Anchor's Program constructor overloads differ between
      // versions. Try the (idl, provider) form first, then fall back to (idl, programId, provider).
      let program: Program<Idl> | null = null;

      // Try the (idl, programId, provider) overload first — it's more explicit
      try {
        console.log('[usePurifyProgram] Attempting Program(IDL, programId, provider) (preferred)');
        program = new (Program as any)(IDL as Idl, PURIFY_PROGRAM_ID as PublicKey, provider);
        console.log('[usePurifyProgram] Program created using (idl, programId, provider) overload');
      } catch (err1) {
        console.warn('[usePurifyProgram] (idl, programId, provider) overload failed, trying (idl, provider):', err1);
        try {
          console.log('[usePurifyProgram] Attempting Program(IDL, provider)');
          program = new (Program as any)(IDL as Idl, provider);
          console.log('[usePurifyProgram] Program created using (idl, provider) overload');
        } catch (err2) {
          console.error('[usePurifyProgram] Both Program constructor overloads failed', err1, err2);

          // Extra diagnostics: log wallet and connection shapes to help debugging _bn issues
          try {
            const w = (provider as any)?.wallet;
            const c = (provider as any)?.connection;
            console.error('[usePurifyProgram] provider.wallet keys:', w ? Object.keys(w) : 'no-wallet');
            console.error('[usePurifyProgram] provider.wallet.publicKey (raw):', (w && (w.publicKey as any)) || null);
            console.error('[usePurifyProgram] provider.wallet.publicKey type:', w && w.publicKey ? Object.prototype.toString.call(w.publicKey) : 'none');
            console.error('[usePurifyProgram] provider.connection keys:', c ? Object.keys(c) : 'no-connection');
          } catch (diagErr) {
            console.error('[usePurifyProgram] failed to collect extra diagnostics', diagErr);
          }

          throw err2 || err1;
        }
      }

      if (!program) throw new Error('Failed to instantiate Program');

      return program;
    } catch (error) {
      console.error('[usePurifyProgram] Failed to create Program:', error);
      throw error;
    }
  };

  return { getProgram };
};

// PDA derivation helpers (tetap sama)
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

export const findProtocolConfigAddress = (): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('protocol_config')],
    PURIFY_PROGRAM_ID
  );
};

export const findBurnProposalAddress = (vaultState: PublicKey, proposer: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('burn_proposal'), vaultState.toBuffer(), proposer.toBuffer()],
    PURIFY_PROGRAM_ID
  );
};

// Helper functions (tetap sama)
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