import React from 'react';
import { motion } from 'framer-motion';

export const GlowingOrb = () => {
  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      {/* Outer glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-orb"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-orb"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Main orb */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-primary shadow-glow"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/50"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            x: [
              0,
              Math.cos((i * Math.PI * 2) / 8) * 80,
              0,
            ],
            y: [
              0,
              Math.sin((i * Math.PI * 2) / 8) * 80,
              0,
            ],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default GlowingOrb;
