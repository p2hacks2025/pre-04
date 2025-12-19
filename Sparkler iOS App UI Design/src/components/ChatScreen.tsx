import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Flame } from 'lucide-react';
import { SparklerAnimation } from './SparklerAnimation';
import { Memory } from '../App';

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: number;
}

interface ChatScreenProps {
  onEnd: (memory: Memory) => void;
  initialMemory: Partial<Memory> | null;
}

export function ChatScreen({ onEnd, initialMemory }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [extensions, setExtensions] = useState(0);
  const [showExtensionPrompt, setShowExtensionPrompt] = useState(false);
  const [tiltIntensity, setTiltIntensity] = useState(0);
  const [sparkColor, setSparkColor] = useState('#FFD700');
  const [messageCount, setMessageCount] = useState(0);
  const startTimeRef = useRef(Date.now());

  // デバイスの傾きを検知
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        // 傾きの強度を計算（0-1の範囲）
        const tilt = Math.min(
          1,
          (Math.abs(event.beta - 90) + Math.abs(event.gamma)) / 100
        );
        setTiltIntensity(tilt);

        // 傾きが強いとバイブレーション
        if (tilt > 0.5 && 'vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof DeviceOrientationEvent !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // タイマー管理
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        // 傾きの影響で時間が早く進む
        const decrease = 1 + tiltIntensity * 0.5;
        const newTime = Math.max(0, prev - decrease);

        // 10秒以下で延長プロンプト表示
        if (newTime <= 10 && newTime > 0 && extensions < 2 && !showExtensionPrompt) {
          setShowExtensionPrompt(true);
        }

        // 時間切れ
        if (newTime === 0) {
          handleEnd();
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tiltIntensity, extensions, showExtensionPrompt]);

  // 火花の色を会話の盛り上がりで変化
  useEffect(() => {
    const intensity = Math.min(messageCount / 10, 1);
    const hue = 45 + intensity * 20; // 金色から赤みがかった色へ
    setSparkColor(`hsl(${hue}, 100%, 60%)`);
  }, [messageCount]);

  // 相手からのメッセージをシミュレート
  useEffect(() => {
    const responses = [
      '夜空、綺麗ですね',
      'この瞬間だけの出会いって、不思議',
      '言葉にできない気持ちってあるよね',
      '明日になれば、これも夢みたい',
      'ありがとう',
    ];

    const randomDelay = 3000 + Math.random() * 5000;
    const timeout = setTimeout(() => {
      if (timeLeft > 5) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        handleReceiveMessage(randomResponse);
      }
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, [messages.length, timeLeft]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMine: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage(newMessage);
    setInputText('');
    setMessageCount((prev) => prev + 1);

    // バイブレーション
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 10, 20]);
    }

    // メッセージを6秒で消す
    setTimeout(() => {
      setCurrentMessage(null);
    }, 6000);
  };

  const handleReceiveMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isMine: false,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setCurrentMessage(newMessage);
    setMessageCount((prev) => prev + 1);

    // バイブレーション
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }

    setTimeout(() => {
      setCurrentMessage(null);
    }, 6000);
  };

  const handleExtension = (accept: boolean) => {
    setShowExtensionPrompt(false);
    if (accept && extensions < 2) {
      // 延長（相手も同意したと仮定）
      setTimeLeft((prev) => prev + 60);
      setExtensions((prev) => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50, 30, 50]);
      }
    }
  };

  const handleEnd = () => {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const memory: Memory = {
      id: initialMemory?.id || Date.now().toString(),
      color: sparkColor,
      date: new Date(),
      duration,
      messageCount,
    };
    onEnd(memory);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-[#050a14] via-[#0a1428] to-[#0f1635] overflow-hidden">
      {/* 星空 */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(50)].map((_, i) => (
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

      {/* タイマー表示 */}
      <motion.div
        className="absolute top-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
          <Flame
            className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}
          />
          <span className={`text-lg tracking-wider ${timeLeft <= 10 ? 'text-red-300' : 'text-white/70'}`}>
            {Math.floor(timeLeft)}秒
          </span>
        </div>
        {extensions > 0 && (
          <p className="text-white/40 text-xs mt-2">延長 {extensions}/2</p>
        )}
      </motion.div>

      {/* 線香花火のアニメーション */}
      <div style={{ filter: `hue-rotate(${messageCount * 5}deg)` }}>
        <SparklerAnimation intensity={1 + tiltIntensity} />
      </div>

      {/* 字幕風メッセージ表示 */}
      <div className="absolute top-[65%] left-0 right-0 flex justify-center px-8">
        <AnimatePresence mode="wait">
          {currentMessage && (
            <motion.div
              key={currentMessage.id}
              className="max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <p
                className={`text-lg tracking-wide leading-relaxed px-6 ${
                  currentMessage.isMine ? 'text-amber-200/90' : 'text-white/90'
                }`}
                style={{
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4)',
                }}
              >
                {currentMessage.text}
              </p>
              <p className="text-white/30 text-xs mt-2">
                {currentMessage.isMine ? 'あなた' : '誰か'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 延長プロンプト */}
      <AnimatePresence>
        {showExtensionPrompt && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center min-w-[300px]">
              <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <p className="text-white/90 text-lg mb-2 tracking-wide">火移ししますか？</p>
              <p className="text-white/50 text-sm mb-6">もう少し話したい</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleExtension(false)}
                  className="flex-1 px-6 py-3 rounded-full bg-white/10 text-white/60 backdrop-blur-md border border-white/20 transition-all hover:bg-white/20"
                >
                  いいえ
                </button>
                <button
                  onClick={() => handleExtension(true)}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white backdrop-blur-md border border-orange-400/30 transition-all hover:from-orange-500 hover:to-amber-500"
                >
                  はい
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 入力エリア */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-6">
        <form onSubmit={handleSendMessage} className="max-w-2xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="想いを綴る..."
              className="w-full bg-transparent text-white/90 placeholder:text-white/30 px-6 py-4 pr-14 outline-none"
              style={{ letterSpacing: '0.03em' }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            >
              <Send className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </form>
      </div>

      {/* 傾き警告 */}
      <AnimatePresence>
        {tiltIntensity > 0.3 && (
          <motion.div
            className="absolute top-24 left-0 right-0 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="text-red-300/70 text-sm">
              ⚠️ 揺らすと火が早く落ちます
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
