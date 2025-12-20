import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import { Memory } from '../App';

interface AlbumScreenProps {
  memories: Memory[];
  onBack: () => void;
}

export function AlbumScreen({ memories, onBack }: AlbumScreenProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-40">
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

      {/* ヘッダー */}
      <div className="relative z-10 pt-8 px-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white/60" />
          </button>
          <div>
            <h1 className="text-white/80 text-2xl tracking-widest">残り香</h1>
            <p className="text-white/40 text-sm mt-1">消えた言葉の記憶</p>
          </div>
        </div>
      </div>

      {/* メモリー一覧 */}
      <div className="relative z-10 px-6 pb-12 overflow-y-auto h-[calc(100%-140px)]">
        {memories.length === 0 ? (
          <motion.div
            className="text-center mt-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-white/20" />
            </div>
            <p className="text-white/40 tracking-wide">まだ残り香はありません</p>
            <p className="text-white/30 text-sm mt-2">火を灯して、誰かと言葉を交わしてみませんか</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  {/* 残り香の色 */}
                  <div
                    className="w-16 h-16 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: memory.color,
                      boxShadow: `0 0 20px ${memory.color}`,
                    }}
                  />

                  {/* 詳細 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-white/60 tracking-wider">
                        {formatDate(memory.date)}
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/40 text-sm">
                        {formatTime(memory.date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">{memory.duration}秒</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-white/40" />
                        <span className="text-white/60">{memory.messageCount}言葉</span>
                      </div>
                    </div>

                    <p className="text-white/30 text-xs mt-3 italic">
                      「言葉は消えても、温かさは残る」
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 下部のグラデーション */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f1635] to-transparent pointer-events-none" />
    </div>
  );
}
