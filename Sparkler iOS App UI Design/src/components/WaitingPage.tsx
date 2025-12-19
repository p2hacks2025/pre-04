import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Genre } from '../App';

interface WaitingPageProps {
  onMatched: () => void;
  onCancel: () => void;
  genre: Genre | null;
}

export function WaitingPage({ onMatched, onCancel, genre }: WaitingPageProps) {
  const [dots, setDots] = useState('');
  const [sparkIntensity, setSparkIntensity] = useState(0.5);
  const [flameFlicker, setFlameFlicker] = useState(1);
  const [matchingPhase, setMatchingPhase] = useState<'igniting' | 'searching' | 'matched' | 'ignited'>('igniting');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const sparkInterval = setInterval(() => {
      setSparkIntensity(0.3 + Math.random() * 0.7);
    }, 100);

    const flickerInterval = setInterval(() => {
      setFlameFlicker(0.85 + Math.random() * 0.3);
    }, 100);

    // 着火アニメーション後に検索開始（1秒後）
    const igniteTimeout = setTimeout(() => {
      setMatchingPhase('searching');
    }, 1000);

    // マッチングシミュレーション（2-4秒でマッチング演出開始）
    const matchTimeout = setTimeout(() => {
      setMatchingPhase('matched');
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      // 線香花火が蝋燭に触れてから着火（1.5秒後）
      setTimeout(() => {
        setMatchingPhase('ignited');
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 100, 50]);
        }
        // 着火後、会話画面へ遷移（1秒後）
        setTimeout(() => {
          onMatched();
        }, 1000);
      }, 1500);
    }, 3000 + Math.random() * 2000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(sparkInterval);
      clearInterval(flickerInterval);
      clearTimeout(igniteTimeout);
      clearTimeout(matchTimeout);
    };
  }, [onMatched]);

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

      {/* キャンセルボタン */}
      <div className="safe-top absolute top-0 right-0 p-6 z-10">
        <button
          onClick={onCancel}
          className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
        >
          <X className="w-6 h-6 text-white/60" />
        </button>
      </div>

      {/* メインアニメーション */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
        {/* 蝋燭（常に画面下部に表示） */}
        <div className="relative">
          {matchingPhase !== 'igniting' && (
            <>
              {/* 炎の光 */}
              <motion.div
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(circle, rgba(255, 200, 100, ${0.4 * flameFlicker}) 0%, rgba(255, 150, 50, ${0.2 * flameFlicker}) 40%, transparent 70%)`,
                }}
              />

              {/* 炎 */}
              <motion.div
                className="absolute -top-16 left-1/2 -translate-x-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -3, 0],
                }}
                transition={{
                  scale: { duration: 0.5 },
                  opacity: { duration: 0.5 },
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                <div
                  className="w-8 h-14 rounded-[50%] bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200"
                  style={{
                    filter: `blur(1px) brightness(${flameFlicker})`,
                    transform: 'scaleX(0.7)',
                  }}
                />
              </motion.div>
            </>
          )}

          {/* ろうそく本体 */}
          <div className="w-20 h-28 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {matchingPhase === 'igniting' && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gray-800" />
            )}
          </div>
        </div>

        {matchingPhase === 'searching' && (
          // 探索中のエフェクト
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-amber-400/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {(matchingPhase === 'matched' || matchingPhase === 'ignited') && (
          // マッチング成功：両サイドから線香花火がスライドイン
          <div className="relative">
            {/* 左から近づく線香花火（持ち手付き） - 真横からスライドイン */}
            <motion.div
              className="absolute top-[-80px] left-0"
              initial={{ x: -250, opacity: 0 }}
              animate={{ 
                x: matchingPhase === 'matched' ? -100 : -50, 
                opacity: 1 
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className="relative flex flex-col items-center">
                {/* 持ち手 */}
                <div className="w-1 h-32 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-full mb-2" />
                
                {/* 火花部分 */}
                <div className="relative">
                  {matchingPhase === 'ignited' ? (
                    // 着火後
                    <>
                      <motion.div
                        className="w-20 h-20 rounded-full"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: [0.5, 1.3, 1] }}
                        transition={{ duration: 0.6 }}
                        style={{
                          background: `radial-gradient(circle, rgba(255, 200, 100, ${0.7 * sparkIntensity}) 0%, rgba(255, 150, 50, ${0.4 * sparkIntensity}) 50%, transparent 80%)`,
                        }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-yellow-300"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          boxShadow: `0 0 ${20 * sparkIntensity}px rgba(255, 200, 100, ${sparkIntensity}), 0 0 ${30 * sparkIntensity}px rgba(255, 150, 50, ${sparkIntensity * 0.5})`,
                        }}
                      />
                      
                      {/* バチバチ散る火花 */}
                      {Array.from({ length: 20 }).map((_, i) => {
                        const angle = (i * Math.PI * 2) / 20;
                        const distance = 30 + Math.random() * 25;
                        return (
                          <motion.div
                            key={i}
                            className="absolute w-[2px] h-[2px] rounded-full"
                            style={{
                              top: '50%',
                              left: '50%',
                              background: 'linear-gradient(135deg, #FFF4E6, #FFD700, #FF8C00)',
                              boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)',
                            }}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                              x: [0, Math.cos(angle) * distance],
                              y: [0, Math.sin(angle) * distance + 10],
                              opacity: [0, 1, 1, 0.5, 0],
                              scale: [0, 1.5, 1, 0.5, 0],
                            }}
                            transition={{
                              duration: 0.8 + Math.random() * 0.6,
                              repeat: Infinity,
                              delay: i * 0.03,
                              ease: 'easeOut',
                            }}
                          />
                        );
                      })}
                    </>
                  ) : (
                    // 着火前（黒い球）
                    <div className="w-5 h-5 rounded-full bg-gray-700" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* 右から近づく線香花火（持ち手付き） - 真横からスライドイン */}
            <motion.div
              className="absolute top-[-80px] right-0"
              initial={{ x: 250, opacity: 0 }}
              animate={{ 
                x: matchingPhase === 'matched' ? 100 : 50, 
                opacity: 1 
              }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <div className="relative flex flex-col items-center">
                {/* 持ち手 */}
                <div className="w-1 h-32 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-full mb-2" />
                
                {/* 火花部分 */}
                <div className="relative">
                  {matchingPhase === 'ignited' ? (
                    // 着火後
                    <>
                      <motion.div
                        className="w-20 h-20 rounded-full"
                        initial={{ scale: 0.5 }}
                        animate={{ scale: [0.5, 1.3, 1] }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                          background: `radial-gradient(circle, rgba(255, 200, 100, ${0.7 * sparkIntensity}) 0%, rgba(255, 150, 50, ${0.4 * sparkIntensity}) 50%, transparent 80%)`,
                        }}
                      />
                      <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-yellow-300"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        style={{
                          boxShadow: `0 0 ${20 * sparkIntensity}px rgba(255, 200, 100, ${sparkIntensity}), 0 0 ${30 * sparkIntensity}px rgba(255, 150, 50, ${sparkIntensity * 0.5})`,
                        }}
                      />
                      
                      {/* バチバチ散る火花 */}
                      {Array.from({ length: 20 }).map((_, i) => {
                        const angle = (i * Math.PI * 2) / 20;
                        const distance = 30 + Math.random() * 25;
                        return (
                          <motion.div
                            key={i}
                            className="absolute w-[2px] h-[2px] rounded-full"
                            style={{
                              top: '50%',
                              left: '50%',
                              background: 'linear-gradient(135deg, #FFF4E6, #FFD700, #FF8C00)',
                              boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)',
                            }}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                              x: [0, Math.cos(angle) * distance],
                              y: [0, Math.sin(angle) * distance + 10],
                              opacity: [0, 1, 1, 0.5, 0],
                              scale: [0, 1.5, 1, 0.5, 0],
                            }}
                            transition={{
                              duration: 0.8 + Math.random() * 0.6,
                              repeat: Infinity,
                              delay: 0.1 + i * 0.03,
                              ease: 'easeOut',
                            }}
                          />
                        );
                      })}
                    </>
                  ) : (
                    // 着火前（黒い球）
                    <div className="w-5 h-5 rounded-full bg-gray-700" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* 着火の瞬間の爆発エフェクト */}
            {matchingPhase === 'ignited' && (
              <motion.div
                className="absolute top-[-80px] left-1/2 -translate-x-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 3, 2], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-40 h-40 rounded-full bg-gradient-radial from-yellow-300/60 via-orange-400/30 to-transparent" />
                {/* キラキラの爆発 */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{
                      x: Math.cos((i * Math.PI * 2) / 16) * 80,
                      y: Math.sin((i * Math.PI * 2) / 16) * 80,
                      opacity: [0, 1, 0],
                      scale: [0, 2, 0],
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* マッチングテキスト */}
      <div className="safe-bottom absolute bottom-0 left-0 right-0 pb-12">
        <motion.div
          className="text-center px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {matchingPhase === 'igniting' ? (
            <motion.p
              className="text-white/70 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              火を灯しています...
            </motion.p>
          ) : matchingPhase === 'searching' ? (
            <>
              <p className="text-white/70 text-lg mb-3">
                相手を探しています{dots}
              </p>
              {genre && (
                <div className="inline-block px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
                  <p className="text-amber-300 text-sm">
                    {genre === 'hobby' && '趣味'}
                    {genre === 'casual' && '雑談'}
                    {genre === 'complaint' && '愚痴'}
                    {genre === 'life' && '人生'}
                    {genre === 'work' && '仕事'}
                    {genre === 'random' && 'ランダム'}
                  </p>
                </div>
              )}
            </>
          ) : matchingPhase === 'matched' ? (
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              相手が見つかりました
            </motion.p>
          ) : (
            <motion.p
              className="text-amber-300 text-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              着火！
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}