import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gamepad2, MessageCircle, Frown, Heart, Briefcase, Shuffle } from 'lucide-react';
import { Genre } from '../App';

interface GenreSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre | null) => void;
}

const genres = [
  { id: 'hobby' as Genre, label: '趣味', icon: Gamepad2, color: '#FF6B9D' },
  { id: 'casual' as Genre, label: '雑談', icon: MessageCircle, color: '#4ECDC4' },
  { id: 'complaint' as Genre, label: '愚痴', icon: Frown, color: '#95E1D3' },
  { id: 'life' as Genre, label: '人生', icon: Heart, color: '#F38181' },
  { id: 'work' as Genre, label: '仕事', icon: Briefcase, color: '#FFA07A' },
  { id: 'random' as Genre, label: 'ランダム', icon: Shuffle, color: '#DDA15E' },
];

export function GenreSelector({ isOpen, onClose, selectedGenre, onSelectGenre }: GenreSelectorProps) {
  const handleSelect = (genre: Genre) => {
    onSelectGenre(genre);
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setTimeout(() => onClose(), 200);
  };

  const handleClear = () => {
    onSelectGenre(null);
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    setTimeout(() => onClose(), 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* モーダル */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-[#0a1428] rounded-t-3xl z-50 max-w-[430px] mx-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="safe-bottom">
              {/* ハンドル */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>

              {/* ヘッダー */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <h3 className="text-white/80 text-lg">話したいジャンル</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* ジャンル一覧 */}
              <div className="px-6 py-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto scrollable">
                {genres.map((genre) => {
                  const Icon = genre.icon;
                  const isSelected = selectedGenre === genre.id;
                  return (
                    <motion.button
                      key={genre.id}
                      onClick={() => handleSelect(genre.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'bg-white/10 border-white/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                          backgroundColor: `${genre.color}20`,
                          border: `2px solid ${genre.color}40`,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: genre.color }}
                        />
                      </div>
                      <p className="text-white/80 text-center">{genre.label}</p>
                    </motion.button>
                  );
                })}
              </div>

              {/* 選択解除ボタン */}
              {selectedGenre && (
                <div className="px-6 pb-6">
                  <button
                    onClick={handleClear}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 transition-all"
                  >
                    選択を解除
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
