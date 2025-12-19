import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { Genre } from '../App';
import { GenreSelector } from './GenreSelector';

interface TopPageProps {
  onStartChat: () => void;
  onOpenMenu: () => void;
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre | null) => void;
}

export function TopPage({ onStartChat, onOpenMenu, selectedGenre, onSelectGenre }: TopPageProps) {
  const [showGenreSelector, setShowGenreSelector] = useState(false);

  const handleIgnite = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
    onStartChat();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(100)].map((_, i) => (
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

      {/* セーフエリア対応ヘッダー */}
      <div className="safe-top absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          {/* ハンバーガーメニュー */}
          <motion.button
            onClick={onOpenMenu}
            className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="w-6 h-6 text-white/70" />
          </motion.button>

          {/* アプリ名 */}
          <motion.h1
            className="text-white/80 text-2xl tracking-[0.3em]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            FIZZ
          </motion.h1>

          {/* 空のスペース（左右対称のため） */}
          <div className="w-[52px]" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="absolute top-4/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* 会話スタートボタン（ろうそく - 火なし） */}
          <motion.button
            onClick={handleIgnite}
            className="relative mb-8"
            whileTap={{ scale: 0.95 }}
          >
            {/* ろうそく本体 */}
            <div className="w-20 h-28 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-sm shadow-2xl cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              
              {/* 芯（黒い部分） */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gray-800" />
              
              {/* キラキラエフェクト */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.button>

          {/* 指示テキスト */}
          <motion.p
            className="text-white/50 text-center text-base mb-8"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            タップして火を灯す
          </motion.p>
        </motion.div>
      </div>

      {/* ジャンル選択ボタン */}
      <div className="safe-bottom absolute bottom-0 left-0 right-0 pb-6 px-6">
        <motion.button
          onClick={() => setShowGenreSelector(true)}
          className="w-full py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
        >
          {selectedGenre ? (
            <span className="text-amber-300">
              {selectedGenre === 'hobby' && '趣味'}
              {selectedGenre === 'casual' && '雑談'}
              {selectedGenre === 'complaint' && '愚痴'}
              {selectedGenre === 'life' && '人生'}
              {selectedGenre === 'work' && '仕事'}
              {selectedGenre === 'random' && 'ランダム'}
            </span>
          ) : (
            '話したいジャンルを選ぶ'
          )}
        </motion.button>
      </div>

      {/* ジャンル選択モーダル */}
      <GenreSelector
        isOpen={showGenreSelector}
        onClose={() => setShowGenreSelector(false)}
        selectedGenre={selectedGenre}
        onSelectGenre={onSelectGenre}
      />
    </div>
  );
}