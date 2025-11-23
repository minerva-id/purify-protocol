"use client";

import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { ProtocolConfig } from '@/utils/governance';
import { formatFee } from '@/utils/governance';

interface ProtocolStatusProps {
  config: ProtocolConfig | null;
  loading?: boolean;
}

export const ProtocolStatus: React.FC<ProtocolStatusProps> = ({ config, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/20">
        <div className="flex items-center space-x-2 text-yellow-400">
          <AlertTriangle size={20} />
          <span className="text-sm">Protocol config not initialized</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="text-emerald-400" size={24} />
          <h3 className="text-lg font-bold text-white">Protocol Status</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          config.paused 
            ? 'bg-red-500/20 text-red-400' 
            : 'bg-green-500/20 text-green-400'
        }`}>
          {config.paused ? (
            <>
              <AlertTriangle size={12} className="inline mr-1" />
              Paused
            </>
          ) : (
            <>
              <CheckCircle2 size={12} className="inline mr-1" />
              Active
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Fee Info */}
        <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="text-cyan-400" size={16} />
            <span className="text-sm text-gray-300">Protocol Fee</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {formatFee(1000000, config.feeBasisPoints)}
          </span>
        </div>

        {/* Fee Recipient */}
        <div className="p-3 bg-black/20 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Fee Recipient</p>
          <p className="text-sm text-emerald-400 font-mono break-all">
            {config.feeRecipient.slice(0, 8)}...{config.feeRecipient.slice(-8)}
          </p>
        </div>

        {/* Authority */}
        <div className="p-3 bg-black/20 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Protocol Authority</p>
          <p className="text-sm text-emerald-400 font-mono break-all">
            {config.authority.slice(0, 8)}...{config.authority.slice(-8)}
          </p>
        </div>
      </div>

      {config.paused && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-300">
            ⚠️ Protocol is currently paused. Some operations may be unavailable.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ProtocolStatus;

