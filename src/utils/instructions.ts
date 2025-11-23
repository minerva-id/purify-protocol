/* eslint-disable @typescript-eslint/no-explicit-any */
// purify-dapp/src/utils/instructions.ts
import { PublicKey } from '@solana/web3.js';
import * as borsh from 'borsh';

// Instruction variants - adjust based on your program
export enum PurifyInstruction {
  InitializeVault = 0,
  Deposit = 1,
  Burn = 2,
  MintCertificate = 3,
}

// Schema for instruction data
export class InitializeVaultArgs {
  instruction: PurifyInstruction = PurifyInstruction.InitializeVault;
  name: string;
  
  constructor(name: string) {
    this.name = name;
  }
}

export class DepositArgs {
  instruction: PurifyInstruction = PurifyInstruction.Deposit;
  amount: number;
  
  constructor(amount: number) {
    this.amount = amount;
  }
}

export class BurnArgs {
  instruction: PurifyInstruction = PurifyInstruction.Burn;
  amount: number;
  
  constructor(amount: number) {
    this.amount = amount;
  }
}

// Schema definition
export const PURIFY_SCHEMA = new Map<any, any>([
  [
    InitializeVaultArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['name', 'string'],
      ],
    },
  ],
  [
    DepositArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
  [
    BurnArgs,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['amount', 'u64'],
      ],
    },
  ],
]);

// Serialize instruction data
export function serializeInstruction(instruction: any): Buffer {
  // borsh.serialize returns a Uint8Array; convert to Buffer for compatibility
  return Buffer.from(borsh.serialize(PURIFY_SCHEMA as any, instruction));
}