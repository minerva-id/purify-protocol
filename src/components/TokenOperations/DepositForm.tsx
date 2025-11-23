// purify-dapp/src/components/TokenOperations/DepositForm.tsx
import React, { useState, ChangeEvent } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { depositToVault } from '../../utils/transactions';
import { usePurifyProgram } from '../../utils/program';
import { Transaction, PublicKey } from '@solana/web3.js';

/**
 * DepositForm component allows user to deposit plastic tokens into a vault.
 */
export const DepositForm: React.FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { getProgram } = usePurifyProgram();
  const [amount, setAmount] = useState<string>('');
  const [vaultAddress, setVaultAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Handles deposit form submission.
   * Validates inputs and sends transaction to deposit tokens.
   */
  const handleDeposit = async (): Promise<void> => {
    if (!publicKey || !amount || !vaultAddress) return;

    setIsLoading(true);
    try {
      let vaultPubkey: PublicKey;
      
      // Validate vault address format
      try {
        vaultPubkey = new PublicKey(vaultAddress);
      } catch {
        throw new Error('Invalid vault address format');
      }

      console.log('🔥 Depositing tokens...', { 
        amount: parseFloat(amount), 
        vault: vaultAddress 
      });

      const program = getProgram();

      const instruction = await depositToVault(
        program,
        vaultPubkey,
        publicKey,
        parseFloat(amount)
      );

      const transaction = new Transaction().add(instruction);
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      console.log('📤 Sending deposit transaction...');
      const signature = await sendTransaction(transaction, connection);

      console.log('⏳ Confirming transaction...');
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      console.log('✅ Deposit transaction submitted!', { signature });
      alert(`✅ Tokens deposited successfully!\n\n📝 Signature: ${signature}`);
      setAmount('');
      
    } catch (error) {
      console.error('❌ Error depositing tokens:', error);
      alert(`❌ Failed to deposit tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles update of vault address input field.
   */
  const handleVaultAddressChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setVaultAddress(e.target.value);
  };

  /**
   * Handles update of amount input field.
   */
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(e.target.value);
  };

  return (
    <div className="operation-card">
      <h3>💰 Deposit Plastic Tokens</h3>
      <div className="form-group">
        <label htmlFor="vault-address">Vault Address:</label>
        <input
          id="vault-address"
          type="text"
          value={vaultAddress}
          onChange={handleVaultAddressChange}
          placeholder="Enter vault public key"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="amount">Amount to Deposit:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          disabled={isLoading}
        />
      </div>
      <button 
        onClick={handleDeposit}
        disabled={!publicKey || !amount || !vaultAddress || isLoading}
        className="operation-button"
        aria-busy={isLoading}
      >
        {isLoading ? '🔄 Depositing...' : '💰 Deposit Tokens'}
      </button>
    </div>
  );
};
