import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface MatchingScreenProps {
  onMatched: () => void;
  onCancel: () => void;
}

export function MatchingScreen({ onMatched, onCancel }: MatchingScreenProps) {
  const [dots, setDots] = useState('');
  const [sparkIntensity, setSparkIntensity] = useState(0.5);

  useEffect(() => {
    // ドットアニメーション
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    // 火花の強度変化
    const sparkInterval = setInterval(() => {
      setSparkIntensity(0.3 + Math.random() * 0.7);
    }, 100);

    // マッチングシミュレーション（3-5秒後にマッチング）
    const matchTimeout = setTimeout(() => {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      onMatched();
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(sparkInterval);
      clearTimeout(matchTimeout);
    };
  }, [onMatched]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* キャンセルボタン */}
      <button
        onClick={onCancel}
        className="absolute top-8 right-8 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10 z-10"
      >
        <X className="w-5 h-5 text-white/60" />
      </button>

      {/* 2つの火花が近づく演出 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-64 h-64">
          {/* 左側の火花（自分） */}
          <motion.div
            className="absolute top-1/2 left-0"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 60, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * sparkIntensity}) 0%, rgba(255, 150, 50, ${0.3 * sparkIntensity}) 50%, transparent 80%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-300"
                style={{
                  boxShadow: `0 0 ${15 * sparkIntensity}px rgba(255, 200, 100, ${sparkIntensity})`,
                }}
              />
            </div>
          </motion.div>

          {/* 右側の火花（相手） */}
          <motion.div
            className="absolute top-1/2 right-0"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: -60, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * sparkIntensity}) 0%, rgba(255, 150, 50, ${0.3 * sparkIntensity}) 50%, transparent 80%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.3,
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-300"
                style={{
                  boxShadow: `0 0 ${15 * sparkIntensity}px rgba(255, 200, 100, ${sparkIntensity})`,
                }}
              />
            </div>
          </motion.div>

          {/* 中心の光（出会いの瞬間） */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255, 220, 150, 0.3) 0%, rgba(255, 180, 100, 0.15) 40%, transparent 70%)`,
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* マッチングテキスト */}
      <motion.div
        className="absolute bottom-32 left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/70 text-lg tracking-widest mb-4">
          火を探しています{dots}
        </p>
        <p className="text-white/40 text-sm tracking-wide">
          同じ夜空の下、誰かと繋がるまで
        </p>
      </motion.div>
    </div>
  );
}
