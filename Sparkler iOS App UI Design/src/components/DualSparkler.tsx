import React from 'react';
import { motion } from 'motion/react';
import { Flame } from 'lucide-react';

interface DualSparklerProps {
  myTime: number;
  myMaxTime: number;
  partnerTime: number;
  partnerMaxTime: number;
  myCooldown: number;
  onExtendMyTime: () => void;
}

export function DualSparkler({
  myTime,
  myMaxTime,
  partnerTime,
  partnerMaxTime,
  myCooldown,
  onExtendMyTime,
}: DualSparklerProps) {
  const myIntensity = Math.max(0.2, myTime / myMaxTime);
  const partnerIntensity = Math.max(0.2, partnerTime / partnerMaxTime);
  const myStickHeight = (myTime / myMaxTime) * 100;
  const partnerStickHeight = (partnerTime / partnerMaxTime) * 100;

  return (
    <div className="flex items-end justify-center gap-12 px-6">
      {/* 自分の線香花火 */}
      <button
        onClick={onExtendMyTime}
        disabled={myCooldown > 0 || myTime >= myMaxTime}
        className="relative flex flex-col items-center disabled:opacity-50"
      >
        {/* 火花 */}
        <div className="relative mb-2">
          <motion.div
            className="w-16 h-16 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * myIntensity}) 0%, rgba(255, 150, 50, ${0.3 * myIntensity}) 50%, transparent 80%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-300"
            style={{
              boxShadow: `0 0 ${15 * myIntensity}px rgba(255, 200, 100, ${myIntensity})`,
            }}
          />

          {/* 火花の粒子 */}
          {Array.from({ length: Math.floor(myIntensity * 8) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-yellow-400"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, (Math.cos((i * Math.PI) / 4) * 20 * myIntensity)],
                y: [0, (Math.sin((i * Math.PI) / 4) * 20 * myIntensity)],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* 持ち手（残り時間） */}
        <div className="w-1 bg-gray-700/50 rounded-full relative overflow-hidden" style={{ height: '80px' }}>
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full"
            style={{ height: `${myStickHeight}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-amber-300/70 text-[10px] mt-2">あなた</p>

        {/* クールダウン表示 */}
        {myCooldown > 0 && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-2 py-1">
            <p className="text-white/60 text-xs">{myCooldown}s</p>
          </div>
        )}
      </button>

      {/* 相手の線香花火 */}
      <div className="relative flex flex-col items-center">
        {/* 火花 */}
        <div className="relative mb-2">
          <motion.div
            className="w-16 h-16 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * partnerIntensity}) 0%, rgba(255, 150, 50, ${0.3 * partnerIntensity}) 50%, transparent 80%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-300"
            style={{
              boxShadow: `0 0 ${15 * partnerIntensity}px rgba(255, 200, 100, ${partnerIntensity})`,
            }}
          />

          {/* 火花の粒子 */}
          {Array.from({ length: Math.floor(partnerIntensity * 8) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-yellow-400"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, (Math.cos((i * Math.PI) / 4) * 20 * partnerIntensity)],
                y: [0, (Math.sin((i * Math.PI) / 4) * 20 * partnerIntensity)],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1 + 0.3,
              }}
            />
          ))}
        </div>

        {/* 持ち手 */}
        <div className="w-1 bg-gray-700/50 rounded-full relative overflow-hidden" style={{ height: '80px' }}>
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full"
            style={{ height: `${partnerStickHeight}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-blue-300/70 text-[10px] mt-2">相手</p>
      </div>
    </div>
  );
}