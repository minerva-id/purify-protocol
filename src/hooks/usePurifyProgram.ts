import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

const PURIFY_PROGRAM_ID = new PublicKey('6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ');

export const usePurifyProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Helper function untuk create deposit instruction
  const createDepositInstruction = async (vaultName: string, amount: number) => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), Buffer.from(vaultName)],
      PURIFY_PROGRAM_ID
    );

    // Convert amount to lamports
    const amountLamports = new BN(amount * LAMPORTS_PER_SOL);

    // Instruction data untuk depositTokens (instruction discriminator biasanya 1)
    const instructionData = Buffer.concat([
      Buffer.from([1]), // depositTokens instruction discriminator
      amountLamports.toArrayLike(Buffer, 'le', 8), // u64 amount
    ]);

    return {
      keys: [
        { pubkey: vaultPda, isSigner: false, isWritable: true },
        { pubkey: wallet.publicKey!, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: PURIFY_PROGRAM_ID,
      data: instructionData,
    };
  };

  return { 
    programId: PURIFY_PROGRAM_ID, 
    wallet, 
    connection,
    SystemProgram,
    Transaction,
    createDepositInstruction,
    LAMPORTS_PER_SOL
  };
};