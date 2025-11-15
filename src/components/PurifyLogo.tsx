"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PurifyLogo() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fixed particle data untuk menghindari hydration errors
  const particles = [
    { id: 0, angle: 0, radius: 28, size: 2, delay: 0, color: '#6ee7b7' },
    { id: 1, angle: 45, radius: 32, size: 1.5, delay: 0.2, color: '#67e8f9' },
    { id: 2, angle: 90, radius: 28, size: 2, delay: 0.4, color: '#6ee7b7' },
    { id: 3, angle: 135, radius: 32, size: 1.5, delay: 0.6, color: '#67e8f9' },
    { id: 4, angle: 180, radius: 28, size: 2, delay: 0.8, color: '#6ee7b7' },
    { id: 5, angle: 225, radius: 32, size: 1.5, delay: 1.0, color: '#67e8f9' },
    { id: 6, angle: 270, radius: 28, size: 2, delay: 1.2, color: '#6ee7b7' },
    { id: 7, angle: 315, radius: 32, size: 1.5, delay: 1.4, color: '#67e8f9' },
  ];

  // Pre-calculated positions untuk performance
  const getParticlePosition = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius
    };
  };

  if (!isClient) {
    // Fallback simple logo selama SSR
    return (
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full" />
        </div>
        <div className="text-left">
          <h1 className="text-2xl font-bold text-emerald-400">Purify</h1>
          <p className="text-xs text-emerald-300">Blockchain Cleaning</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center space-x-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Logo Container */}
      <motion.div
        className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center"
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Gradient Background Vortex */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-400 rounded-full blur-xl opacity-70" />
        
        {/* Main Ring with Inner Glow */}
        <motion.div
          className="absolute w-full h-full rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #10b981, #06b6d4, #10b981)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Clean Core */}
        <motion.div
          className="absolute w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-2xl z-20"
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 20px rgba(255,255,255,0.8)",
              "0 0 40px rgba(34,197,94,0.6)",
              "0 0 20px rgba(255,255,255,0.8)"
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Floating Particles (Orbiting) */}
        {particles.map((particle) => {
          const position = getParticlePosition(particle.angle, particle.radius);
          
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full z-10"
              style={{
                width: `${particle.size * 4}px`,
                height: `${particle.size * 4}px`,
                backgroundColor: particle.color,
                boxShadow: '0 0 8px currentColor',
                x: position.x,
                y: position.y,
              }}
              animate={{
                scale: [0.8, 1.3, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            />
          );
        })}

        {/* Outer Rotating Ring */}
        <motion.div
          className="absolute w-full h-full rounded-full border-2 border-emerald-300/40"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Mask untuk shape yang bersih */}
        <div className="absolute w-[90%] h-[90%] bg-transparent rounded-full border-4 border-white/10 z-15" />
      </motion.div>

      {/* Text Section */}
      <div className="text-left">
        <motion.h1
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring" }}
        >
          Purify
        </motion.h1>
        <motion.p
          className="text-xs md:text-sm font-medium text-emerald-300 tracking-wide"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1, x: 2 }}
          transition={{ duration: 0.3 }}
        >
          Blockchain Cleaning
        </motion.p>
      </div>
    </motion.div>
  );
}