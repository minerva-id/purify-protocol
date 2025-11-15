import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/contexts/WalletContext';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Purify Protocol - Clean The Blockchain | Solana Green DeFi',
  description: 'The first green protocol on Solana that recycles dead tokens into valuable assets. Burn rug tokens, earn PURE tokens and exclusive NFT certificates.',
  keywords: 'solana, defi, token burning, nft, blockchain, purify, crypto, recycling',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}