import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { Memory } from '../App';

interface EndScreenProps {
  memory: Memory;
  onBackToHome: () => void;
}

export function EndScreen({ memory, onBackToHome }: EndScreenProps) {
  const [smoke, setSmoke] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    // 煙のパーティクル生成
    const particles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 0.2,
    }));
    setSmoke(particles);

    // 自動でホームに戻る（15秒後）
    const timeout = setTimeout(() => {
      onBackToHome();
    }, 15000);

    return () => clearTimeout(timeout);
  }, [onBackToHome]);

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

      {/* 煙の演出 */}
      <div className="absolute top-[35%] left-1/2 -translate-x-1/2">
        {smoke.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-16 h-16 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(100, 100, 100, 0.3) 0%, transparent 70%)',
            }}
            initial={{ y: 0, x: 0, opacity: 0.5, scale: 0.5 }}
            animate={{
              y: -150,
              x: (Math.random() - 0.5) * 60,
              opacity: 0,
              scale: 2,
            }}
            transition={{
              duration: 3,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* 燃えかす（残り香の色） */}
      <motion.div
        className="absolute top-[35%] left-1/2 -translate-x-1/2"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0.8, opacity: 0.6 }}
        transition={{ duration: 2 }}
      >
        <div
          className="w-6 h-6 rounded-full blur-sm"
          style={{
            backgroundColor: memory.color,
            boxShadow: `0 0 30px ${memory.color}`,
          }}
        />
      </motion.div>

      {/* メッセージ */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 text-center px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <h2 className="text-white/80 text-2xl tracking-widest mb-6">火が落ちました</h2>
        <p className="text-white/50 text-sm tracking-wide mb-8 leading-relaxed">
          言葉は消えても
          <br />
          温かさは残り香として心に
        </p>

        {/* 記憶の詳細 */}
        <motion.div
          className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2"
                style={{
                  backgroundColor: memory.color,
                  boxShadow: `0 0 20px ${memory.color}`,
                }}
              />
              <p className="text-white/40 text-xs">残り香</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-2xl mb-1">{memory.duration}</p>
              <p className="text-white/40 text-xs">秒</p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-2xl mb-1">{memory.messageCount}</p>
              <p className="text-white/40 text-xs">言葉</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="text-white/30 text-xs tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          この瞬間は、もう二度と戻らない
        </motion.p>
      </motion.div>

      {/* ホームボタン */}
      <motion.button
        onClick={onBackToHome}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 transition-all hover:bg-white/10 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-5 h-5" />
        <span className="tracking-wider">また火を灯す</span>
      </motion.button>
    </div>
  );
}
