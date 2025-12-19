import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  life: number;
}

interface SparklerAnimationProps {
  intensity?: number;
}

export function SparklerAnimation({ intensity = 1 }: SparklerAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [coreGlow, setCoreGlow] = useState(0.8);

  useEffect(() => {
    // コアの輝度をランダムに変化させる
    const glowInterval = setInterval(() => {
      setCoreGlow(0.6 + Math.random() * 0.4);
    }, 100);

    // パーティクルを定期的に生成
    const particleInterval = setInterval(() => {
      const newParticles: Particle[] = [];
      const baseCount = 8 + Math.random() * 12;
      const particleCount = baseCount * intensity;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: Date.now() + Math.random(),
          x: 0,
          y: 0,
          angle: (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5,
          velocity: (30 + Math.random() * 40) * intensity,
          life: (0.5 + Math.random() * 1) / intensity,
        });
      }

      setParticles((prev) => [...prev.slice(-50), ...newParticles]);
    }, Math.max(50, 80 / intensity));

    return () => {
      clearInterval(glowInterval);
      clearInterval(particleInterval);
    };
  }, [intensity]);

  // 古いパーティクルを削除
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setParticles((prev) => prev.filter((p) => Date.now() - p.id < 2000));
    }, 100);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* 線香花火の芯 */}
      <div className="relative">
        {/* 外側の光の輪 */}
        <motion.div
          className="absolute w-32 h-32 -left-16 -top-16 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255, 200, 100, ${coreGlow * 0.3 * intensity}) 0%, rgba(255, 150, 50, ${coreGlow * 0.15 * intensity}) 30%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* 中心の火花の核 */}
        <motion.div
          className="absolute w-3 h-3 -left-1.5 -top-1.5 rounded-full bg-gradient-to-br from-yellow-100 via-amber-300 to-orange-500"
          style={{
            boxShadow: `0 0 ${20 * coreGlow * intensity}px rgba(255, 200, 100, ${coreGlow}), 0 0 ${10 * coreGlow * intensity}px rgba(255, 150, 50, ${coreGlow})`,
          }}
        />

        {/* パーティクル */}
        <AnimatePresence>
          {particles.map((particle) => {
            const endX = Math.cos(particle.angle) * particle.velocity;
            const endY = Math.sin(particle.angle) * particle.velocity - particle.velocity * 0.3; // 重力効果

            return (
              <motion.div
                key={particle.id}
                className="absolute w-[2px] h-[2px] rounded-full bg-gradient-to-r from-yellow-200 via-amber-400 to-orange-500"
                style={{
                  boxShadow: '0 0 3px rgba(255, 200, 100, 0.8)',
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: endX,
                  y: endY,
                  opacity: 0,
                  scale: [1, 1.2, 0.3],
                }}
                exit={{
                  opacity: 0,
                }}
                transition={{
                  duration: particle.life,
                  ease: 'easeOut',
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* 線香花火の持ち手（細い線） */}
      <motion.div
        className="absolute top-2 left-0 w-[1px] h-48 bg-gradient-to-b from-amber-900/60 via-amber-950/40 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
