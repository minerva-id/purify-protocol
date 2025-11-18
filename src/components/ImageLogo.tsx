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
          src="/logo.png"
          alt="Purify Logo"
          width={40}    // Adjust sesuai ukuran logo Anda
          height={40}   // Adjust sesuai ukuran logo Anda
          className="object-contain"
          priority      // Biar load cepat
        />
      </motion.div>
      
      {/* Text */}
      <div className="text-left">
        <motion.h1
          className="text-xl font-bold text-white"
          whileHover={{ scale: 1.05 }}
        >
          Purify
        </motion.h1>
        <motion.p
          className="text-xs text-blue-200 font-medium"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          Blockchain Cleaning
        </motion.p>
      </div>
    </motion.div>
  );
}