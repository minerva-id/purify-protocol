"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import ImageLogo from './ImageLogo';
import { CustomWalletButton } from './CustomWalletButton';
import LanguageSwitcher from './LanguageSwitcher';
import { FileText, Menu, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from '@/lib/i18n';
import { useProtocolConfig } from '@/hooks/useOnChainData';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { connected } = useWallet();
  const { locale } = useLanguage();
  const t = useTranslations(locale);
  const pathname = usePathname();
  const { config } = useProtocolConfig();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/' || pathname === '';
    return pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');
  };

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-800/30 bg-[#03150f]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <ImageLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-6 mr-4">
              <Link
                href="/whitepaper"
                className={`${isActive('/whitepaper') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors duration-200 flex items-center space-x-1`}
              >
                <FileText size={16} />
                <span>{t('nav.whitepaper')}</span>
              </Link>

              <Link
                href="/about"
                className={`${isActive('/about') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors duration-200`}
              >
                {t('nav.about')}
              </Link>

              <Link
                href="/docs"
                className={`${isActive('/docs') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors duration-200`}
              >
                {t('nav.docs')}
              </Link>

              {connected && (
                <>
                  <Link
                    href="/analytics"
                    className={`${isActive('/analytics') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors duration-200`}
                  >
                    {t('nav.analytics')}
                  </Link>
                  <Link
                    href="/governance"
                    className={`${isActive('/governance') ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors duration-200`}
                  >
                    {t('nav.governance')}
                  </Link>
                </>
              )}
            </nav>

            <LanguageSwitcher />

            {mounted && (
              <>
                {connected && (
                  <Link href="/dashboard">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
                      {t('nav.dashboard')}
                    </button>
                  </Link>
                )}

                {/* Render the custom wallet button only on client mount to avoid hydration issues */}
                <div className="z-50">
                  <CustomWalletButton centerOnOpen />
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg border border-emerald-800/30 text-emerald-300 hover:text-emerald-400 hover:border-emerald-600/50"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {config?.paused && (
          <div className="mt-3 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-3 py-2 text-xs flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            <span>{t('banner.paused')}</span>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden mt-4 border-t border-emerald-800/30 pt-4">
            <nav className="flex flex-col space-y-3 mb-4">
              <Link
                href="/whitepaper"
                onClick={() => setMobileOpen(false)}
                className={`${isActive('/whitepaper') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors py-2 flex items-center space-x-2`}
              >
                <FileText size={16} />
                <span>{t('nav.whitepaper')}</span>
              </Link>

              <Link
                href="/docs"
                onClick={() => setMobileOpen(false)}
                className={`${isActive('/docs') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} transition-colors py-2`}
              >
                {t('nav.docs')}
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className={`${isActive('/about') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} py-2`}
              >
                {t('nav.about')}
              </Link>

              {connected && (
                <>
                  {/* --- PERBAIKAN: Menambahkan Dashboard Link ke Mobile Menu --- */}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`${isActive('/dashboard') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} py-2 font-medium`}
                  >
                     {t('nav.dashboard')}
                  </Link>
                  {/* --------------------------------------------------------- */}

                  <Link
                    href="/analytics"
                    onClick={() => setMobileOpen(false)}
                    className={`${isActive('/analytics') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} py-2`}
                  >
                    {t('nav.analytics')}
                  </Link>
                  <Link
                    href="/governance"
                    onClick={() => setMobileOpen(false)}
                    className={`${isActive('/governance') ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'} py-2`}
                  >
                    {t('nav.governance')}
                  </Link>
                </>
              )}
            </nav>

            <div className="flex flex-col space-y-3">
              <LanguageSwitcher />
              {mounted && (
                <div onClick={() => setMobileOpen(false)} className="z-50">
                  <CustomWalletButton centerOnOpen />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
