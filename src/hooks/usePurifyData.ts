import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

const PURIFY_PROGRAM_ID = new PublicKey('6jpBQ4dMhWJbWWfDa2GhcNvokoqd98a2gKydEAimKkpJ');

export const usePurifyData = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [userVaults, setUserVaults] = useState<Array<{ name: string; deposited: number; certificates: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!wallet.publicKey) {
        setUserVaults([]);
        setLoading(false);
        return;
      }

      try {
        // Simulasi data - nanti bisa fetch dari blockchain
        const mockVaults = [
          { name: 'plastic-waste', deposited: 2.5, certificates: 3 },
          { name: 'e-waste', deposited: 1.2, certificates: 1 },
        ];
        
        setUserVaults(mockVaults);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [wallet.publicKey, connection]);

  return { userVaults, loading };
};