"use client";

import { useState, useEffect, useRef } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!langRef.current) return;
      if (!langRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Full-width on small screens, compact on md+
  const baseDropdown =
    'relative md:absolute md:top-full md:left-0 md:mt-2 w-full md:w-32 md:right-0 md:left-auto bg-[#03150f] border border-emerald-700/30 rounded-lg shadow-xl transition-all duration-200 z-40 backdrop-blur-sm';
  const visibility = open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1';

  return (
    <div className="relative group" ref={langRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors duration-200 px-3 py-2 rounded-lg border border-emerald-800/30 hover:border-emerald-600/50"
      >
        <Languages size={18} />
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
      </button>

      <div className={`${baseDropdown} ${visibility} md:opacity-0 md:invisible md:group-hover:opacity-100 md:group-hover:visible`}>
        <button
          onClick={() => {
            setLocale('en');
            setOpen(false);
          }}
          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
            locale === 'en' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'
          } first:rounded-t-lg last:rounded-b-lg`}
        >
          English
        </button>
        <button
          onClick={() => {
            setLocale('id');
            setOpen(false);
          }}
          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
            locale === 'id' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400'
          } first:rounded-t-lg last:rounded-b-lg`}
        >
          Indonesia
        </button>
      </div>
    </div>
  );
}
