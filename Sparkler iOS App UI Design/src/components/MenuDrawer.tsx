import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, History, Settings } from 'lucide-react';
import { Screen } from '../App';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: Screen) => void;
}

const menuItems = [
  { id: 'deck' as Screen, label: '会話デッキ', icon: Layers },
  { id: 'history' as Screen, label: '履歴', icon: History },
  { id: 'settings' as Screen, label: '設定', icon: Settings },
];

export function MenuDrawer({ isOpen, onClose, onNavigate }: MenuDrawerProps) {
  const handleNavigate = (screen: Screen) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    onNavigate(screen);
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

          {/* ドロワー */}
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0a1428] border-r border-white/10 z-50"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="safe-top h-full flex flex-col">
              {/* ヘッダー */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <h2 className="text-white/80 text-xl tracking-widest">FIZZ</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/5"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              {/* メニュー項目 */}
              <nav className="flex-1 py-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-all"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white/70" />
                      </div>
                      <span className="text-white/80">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* フッター */}
              <div className="px-6 py-6 border-t border-white/10">
                <p className="text-white/30 text-xs text-center">
                  短時間で消える匿名トーク
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
