import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, MessageSquare } from 'lucide-react';
import { Genre, Deck, ChatHistory } from '../App';

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: number;
}

interface ChatPageProps {
  onEnd: (history: ChatHistory) => void;
  genre: Genre | null;
  activeDeck: Deck | null;
}

export function ChatPage({ onEnd, genre, activeDeck }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [myTime, setMyTime] = useState(60);
  const [partnerTime, setPartnerTime] = useState(60);
  const [myMaxTime] = useState(120); // 持ち手の長さ = 最大時間
  const [partnerMaxTime] = useState(120);
  const [myCooldown, setMyCooldown] = useState(0);
  const [partnerCooldown, setPartnerCooldown] = useState(0);
  const [showDeckPanel, setShowDeckPanel] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const startTimeRef = useRef(Date.now());
  const messageCountRef = useRef(0);

  // タイマー管理
  useEffect(() => {
    const interval = setInterval(() => {
      setMyTime((prev) => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0 && partnerTime === 0) {
          handleEnd();
        }
        return newTime;
      });
      setPartnerTime((prev) => {
        const newTime = Math.max(0, prev - 1);
        return newTime;
      });
      setMyCooldown((prev) => Math.max(0, prev - 1));
      setPartnerCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [partnerTime]);

  // 表示するメッセージを制限（両者合わせて最新6つ）
  useEffect(() => {
    const allMessages = [...messages].sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
    setVisibleMessages(allMessages.sort((a, b) => a.timestamp - b.timestamp));
  }, [messages]);

  // 相手のメッセージをシミュレート
  useEffect(() => {
    if (messages.length === 0) return;
    
    const responses = [
      'こんにちは！',
      'そうなんですね',
      'わかります',
      '面白い話ですね',
      'もう少し聞かせてください',
    ];

    const timeout = setTimeout(() => {
      if (partnerTime > 5) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        handleReceiveMessage(randomResponse);
      }
    }, 3000 + Math.random() * 3000);

    return () => clearTimeout(timeout);
  }, [messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || myTime === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMine: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    messageCountRef.current += 1;

    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }
  };

  const handleReceiveMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isMine: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    messageCountRef.current += 1;

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
  };

  const handleExtendMyTime = () => {
    if (myCooldown > 0 || myTime >= myMaxTime) return;

    const extension = Math.min(30, myMaxTime - myTime);
    setMyTime((prev) => prev + extension);
    setMyCooldown(10);

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  };

  const handleUseDeckItem = (text: string) => {
    setInputText(text);
    setShowDeckPanel(false);
  };

  const handleEnd = () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const history: ChatHistory = {
      id: Date.now().toString(),
      date: new Date(),
      genre: genre || 'random',
      duration,
      messageCount: messageCountRef.current,
    };
    onEnd(history);
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    handleEnd();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] flex flex-col">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(60)].map((_, i) => (
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

      {/* ヘッダー：退出ボタン */}
      <div className="safe-top relative pt-4 pb-2 px-6 flex justify-between items-center z-10">
        <div className="w-10" />
        <p className="text-white/40 text-sm">会話中</p>
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>
      </div>

      {/* 線香花火エリア（両サイドに配置） */}
      <div className="relative px-6 pb-4">
        <div className="flex justify-between items-start">
          {/* 左側：相手の線香花火 */}
          <div className="relative flex flex-col items-center">
            {/* 持ち手 */}
            <div className="w-1 bg-gray-700/50 rounded-full relative overflow-hidden mb-2" style={{ height: '60px' }}>
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full"
                style={{ height: `${(partnerTime / partnerMaxTime) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* 火花 */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * Math.max(0.2, partnerTime / partnerMaxTime)}) 0%, rgba(255, 150, 50, ${0.3 * Math.max(0.2, partnerTime / partnerMaxTime)}) 50%, transparent 80%)`,
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
                  boxShadow: `0 0 ${15 * Math.max(0.2, partnerTime / partnerMaxTime)}px rgba(255, 200, 100, ${Math.max(0.2, partnerTime / partnerMaxTime)})`,
                }}
              />

              {/* 火花の粒子 */}
              {Array.from({ length: Math.floor(Math.max(0.2, partnerTime / partnerMaxTime) * 12) }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12;
                const distance = 20 * Math.max(0.2, partnerTime / partnerMaxTime);
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[2px] h-[2px] rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      background: 'linear-gradient(135deg, #FFE4B5, #FFD700)',
                      boxShadow: '0 0 3px rgba(255, 215, 0, 0.6)',
                    }}
                    animate={{
                      x: [0, Math.cos(angle) * distance],
                      y: [0, Math.sin(angle) * distance + 8],
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0.3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.08 + 0.3,
                    }}
                  />
                );
              })}
              
              {/* キラキラ */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${25 + Math.random() * 50}%`,
                    left: `${25 + Math.random() * 50}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3 + 0.3,
                  }}
                />
              ))}
            </div>

            <p className="text-blue-300/70 text-[10px] mt-2">相手</p>
          </div>

          {/* 右側：自分の線香花火 */}
          <button
            onClick={handleExtendMyTime}
            disabled={myCooldown > 0 || myTime >= myMaxTime}
            className="relative flex flex-col items-center disabled:opacity-50"
          >
            {/* 持ち手 */}
            <div className="w-1 bg-gray-700/50 rounded-full relative overflow-hidden mb-2" style={{ height: '60px' }}>
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full"
                style={{ height: `${(myTime / myMaxTime) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {/* 火花 */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 rounded-full"
                style={{
                  background: `radial-gradient(circle, rgba(255, 200, 100, ${0.6 * Math.max(0.2, myTime / myMaxTime)}) 0%, rgba(255, 150, 50, ${0.3 * Math.max(0.2, myTime / myMaxTime)}) 50%, transparent 80%)`,
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
                  boxShadow: `0 0 ${15 * Math.max(0.2, myTime / myMaxTime)}px rgba(255, 200, 100, ${Math.max(0.2, myTime / myMaxTime)})`,
                }}
              />

              {/* 火花の粒子 */}
              {Array.from({ length: Math.floor(Math.max(0.2, myTime / myMaxTime) * 12) }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12;
                const distance = 20 * Math.max(0.2, myTime / myMaxTime);
                return (
                  <motion.div
                    key={i}
                    className="absolute w-[2px] h-[2px] rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      background: 'linear-gradient(135deg, #FFE4B5, #FFD700)',
                      boxShadow: '0 0 3px rgba(255, 215, 0, 0.6)',
                    }}
                    animate={{
                      x: [0, Math.cos(angle) * distance],
                      y: [0, Math.sin(angle) * distance + 8],
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0.3],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.08,
                    }}
                  />
                );
              })}
              
              {/* キラキラ */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    top: `${25 + Math.random() * 50}%`,
                    left: `${25 + Math.random() * 50}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <p className="text-amber-300/70 text-[10px] mt-2">あなた</p>

            {/* クールダウン表示 */}
            {myCooldown > 0 && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-2 py-1">
                <p className="text-white/60 text-xs">{myCooldown}s</p>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 会話履歴エリア（中央） */}
      <div className="flex-1 px-6 overflow-y-auto scrollable">
        <div className="space-y-3 py-4">
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`text-sm leading-relaxed ${
                  msg.isMine ? 'text-amber-200/90 text-right' : 'text-white/80 text-left'
                }`}
              >
                <p className="inline-block px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-sm relative overflow-hidden">
                  {msg.text}
                  {/* メッセージのキラキラ */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[2px] h-[2px] bg-white/60 rounded-full"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                      }}
                    />
                  ))}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 入力エリア */}
      <div className="safe-bottom relative bg-gradient-to-t from-[#0f1635] to-transparent pt-4 pb-2 px-4">
        {/* 会話デッキパネル */}
        <AnimatePresence>
          {showDeckPanel && activeDeck && (
            <motion.div
              className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-[#0a1428]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-h-40 overflow-y-auto scrollable"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="grid grid-cols-2 gap-2">
                {activeDeck.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUseDeckItem(item.text)}
                    className="px-3 py-2 bg-white/5 rounded-lg text-white/70 text-sm hover:bg-white/10 transition-all text-left"
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          {/* 会話デッキボタン */}
          {activeDeck && (
            <button
              type="button"
              onClick={() => setShowDeckPanel(!showDeckPanel)}
              className="p-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
            >
              <MessageSquare className="w-5 h-5 text-orange-400" />
            </button>
          )}

          {/* 入力フィールド */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={myTime > 0 ? 'メッセージを入力...' : '時間切れ'}
              disabled={myTime === 0}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 text-white/90 placeholder:text-white/30 outline-none disabled:opacity-50"
            />
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={!inputText.trim() || myTime === 0}
            className="p-3 rounded-full bg-amber-500/80 disabled:bg-white/5 disabled:opacity-50 border border-amber-400/30 disabled:border-white/10 transition-all"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>

      {/* 退出確認ダイアログ */}
      <AnimatePresence>
        {showExitConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitConfirm(false)}
            />
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a1428] rounded-3xl p-8 z-50 max-w-[320px] w-full mx-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-white/80 text-lg mb-2 text-center">会話を終了しますか？</h3>
              <p className="text-white/50 text-sm mb-6 text-center">
                途中で退出すると
                <br />
                この会話は消えてしまいます
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleExitConfirm}
                  className="flex-1 py-3 rounded-xl bg-red-500/80 border border-red-400/30 text-white"
                >
                  退出する
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}