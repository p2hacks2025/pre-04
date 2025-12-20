import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';

interface EndPageProps {
  onBackToTop: () => void;
}

export function EndPage({ onBackToTop }: EndPageProps) {
  const [smoke, setSmoke] = useState<Array<{ id: number; delay: number }>>([]);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.15,
    }));
    setSmoke(particles);

    // カウントダウン
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onBackToTop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onBackToTop]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `sparkle ${2 + Math.random() * 3}s infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 煙の演出 */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2">
        {smoke.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-20 h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(150, 150, 150, 0.4) 0%, transparent 70%)',
            }}
            initial={{ y: 0, x: 0, opacity: 0.6, scale: 0.5 }}
            animate={{
              y: -200,
              x: (Math.random() - 0.5) * 80,
              opacity: 0,
              scale: 2.5,
            }}
            transition={{
              duration: 3.5,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* 燃えかす */}
      <motion.div
        className="absolute top-[40%] left-1/2 -translate-x-1/2"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0.7, opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-600/50 blur-sm" />
      </motion.div>

      {/* メッセージ */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-white/80 text-2xl mb-4 tracking-widest">
            会話が終わりました
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            短い時間でしたが
            <br />
            ありがとうございました
          </p>

          <motion.div
            className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="text-white/60 text-sm mb-1">自動的に戻ります</p>
            <p className="text-white/80 text-3xl">{countdown}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* ホームボタン */}
      <div className="safe-bottom absolute bottom-0 left-0 right-0 pb-8 px-8">
        <motion.button
          onClick={onBackToTop}
          className="w-full py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/70 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home className="w-5 h-5" />
          <span>トップに戻る</span>
        </motion.button>
      </div>
    </div>
  );
}
