"use client";

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

interface LoadingButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  disabled,
  children,
  className = '',
  loadingText,
  variant = 'primary',
}) => {
  const variantClasses = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    secondary: 'bg-transparent border border-emerald-400 text-emerald-300 hover:bg-emerald-400/10',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${variantClasses[variant]}
        ${className}
        px-6 py-3 rounded-lg font-semibold transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
      `}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={18} />
          </motion.div>
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default LoadingButton;

