"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ImageLogo() {
  return (
    <motion.div
      className="flex items-center space-x-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Logo Image */}
      <motion.div 
        className="relative"
        whileHover={{ rotate: 5 }}
     >
        <Image
          src="/images/logo.png"
          alt="Purify Logo"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </motion.div>
      
      {/* Text */}
      <div className="text-left">
        <motion.h1
          className="text-emerald-400 flex justify-center items-center font-bold text-lg"
          whileHover={{ scale: 1.05 }}
        >
          Purify Protocol
        </motion.h1>
        <motion.p
          className="text-xs text-blue-200 font-medium"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          
        </motion.p>
      </div>
    </motion.div>
  );
}
