import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book } from 'lucide-react';

interface HomeScreenProps {
  onIgnite: () => void;
  onOpenAlbum: () => void;
}

export function HomeScreen({ onIgnite, onOpenAlbum }: HomeScreenProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [flameFlicker, setFlameFlicker] = useState(1);

  useEffect(() => {
    // ろうそくの炎の揺らぎ
    const flickerInterval = setInterval(() => {
      setFlameFlicker(0.85 + Math.random() * 0.3);
    }, 100);

    return () => clearInterval(flickerInterval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressed) {
      interval = setInterval(() => {
        setPressProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            // 長押し完了 - 着火
            if ('vibrate' in navigator) {
              navigator.vibrate([50, 30, 50]);
            }
            setTimeout(() => onIgnite(), 300);
            return 100;
          }
          return next;
        });
      }, 30);
    } else {
      setPressProgress(0);
    }

    return () => clearInterval(interval);
  }, [isPressed, onIgnite]);

  const handleTouchStart = () => {
    setIsPressed(true);
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(80)].map((_, i) => (
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

      {/* アプリ名 */}
      <motion.div
        className="absolute top-16 left-0 right-0 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1 className="text-white/80 text-3xl tracking-[0.3em] mb-2">Sparkler</h1>
        <p className="text-white/40 text-sm tracking-wider">言葉は煙になって消える。温かさだけを残して。</p>
      </motion.div>

      {/* アルバムボタン */}
      <motion.button
        onClick={onOpenAlbum}
        className="absolute top-16 right-8 p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Book className="w-5 h-5 text-white/60" />
      </motion.button>

      {/* ろうそくと線香花火 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* 線香花火（未着火） */}
          <div className="relative mb-8">
            <div className="w-1 h-32 mx-auto bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-full" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-700" />
          </div>

          {/* ろうそく */}
          <div className="relative">
            {/* 炎の光 */}
            <motion.div
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(255, 200, 100, ${0.3 * flameFlicker}) 0%, rgba(255, 150, 50, ${0.15 * flameFlicker}) 40%, transparent 70%)`,
              }}
            />

            {/* 炎 */}
            <motion.div
              className="absolute -top-12 left-1/2 -translate-x-1/2"
              animate={{
                scale: [1, 1.05, 0.95, 1],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="w-6 h-12 rounded-[50%] bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200"
                style={{
                  filter: `blur(1px) brightness(${flameFlicker})`,
                  transform: 'scaleX(0.7)',
                }}
              />
            </motion.div>

            {/* ろうそく本体 */}
            <motion.div
              className="w-16 h-24 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-sm shadow-2xl cursor-pointer select-none relative overflow-hidden"
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
              onMouseLeave={handleTouchEnd}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 進行度バー */}
              <AnimatePresence>
                {isPressed && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-400/40 to-yellow-300/40"
                    initial={{ height: 0 }}
                    animate={{ height: `${pressProgress}%` }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
              </AnimatePresence>

              {/* テクスチャ */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          </div>

          {/* 指示テキスト */}
          <motion.p
            className="text-white/50 text-center mt-12 text-sm tracking-wide"
            animate={{
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ろうそくを長押しして着火
          </motion.p>
        </motion.div>
      </div>

      {/* 環境音表現（視覚的） */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/30 text-xs tracking-widest">
        <motion.span
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ・・・虫の声、川のせせらぎ・・・
        </motion.span>
      </div>
    </div>
  );
}
