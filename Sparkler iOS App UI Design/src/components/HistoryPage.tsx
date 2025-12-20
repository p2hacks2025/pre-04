import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Clock, MessageCircle } from "lucide-react";
import { ChatHistory } from "../App";

interface HistoryPageProps {
  histories: ChatHistory[];
  onBack: () => void;
}

const genreLabels = {
  hobby: "趣味",
  casual: "雑談",
  complaint: "愚痴",
  life: "人生",
  work: "仕事",
  random: "ランダム",
};

const genreColors = {
  hobby: "#FF6B9D",
  casual: "#4ECDC4",
  complaint: "#95E1D3",
  life: "#F38181",
  work: "#FFA07A",
  random: "#DDA15E",
};

export function HistoryPage({
  histories,
  onBack,
}: HistoryPageProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (date: Date) => {
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] flex flex-col">
      {/* ヘッダー */}
      <div className="safe-top bg-[#0a1428]/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/5"
          >
            <ArrowLeft className="w-6 h-6 text-white/70" />
          </button>
          <h2 className="text-white/80 text-xl">履歴</h2>
        </div>
      </div>

      {/* 履歴一覧 */}
      <div className="flex-1 overflow-y-auto scrollable px-6 py-4">
        {histories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-white/20" />
            </div>
            <p className="text-white/40 mb-2">
              まだ履歴がありません
            </p>
            <p className="text-white/30 text-sm">
              会話を始めると
              <br />
              ここに記録されます
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {histories.map((history, index) => (
              <motion.div
                key={history.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white/70 text-sm mb-1">
                      {formatDate(history.date)}{" "}
                      {formatTime(history.date)}
                    </p>
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: `${genreColors[history.genre]}20`,
                        color: genreColors[history.genre],
                      }}
                    >
                      {genreLabels[history.genre]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">
                      {history.duration}秒
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">
                      {history.messageCount}件
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}