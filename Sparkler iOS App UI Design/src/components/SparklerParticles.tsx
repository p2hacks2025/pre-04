import React from 'react';
import { motion } from 'motion/react';

interface SparklerParticlesProps {
  intensity: number;
  count?: number;
  delay?: number;
}

export function SparklerParticles({ intensity, count = 12, delay = 0 }: SparklerParticlesProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i * Math.PI * 2) / count;
        const distance = 20 * intensity;
        return (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full"
            style={{
              top: '50%',
              left: '50%',
              background: 'linear-gradient(135deg, #FFE4B5, #FFD700)',
              boxShadow: '0 0 3px rgba(255, 215, 0, 0.6)',
            }}
            animate={{
              x: [0, Math.cos(angle) * distance],
              y: [0, Math.sin(angle) * distance + 8],
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.3],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: delay + i * 0.08,
            }}
          />
        );
      })}
    </>
  );
}
