import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
}

export function InputArea({ onSend }: InputAreaProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 pb-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="想いを書き留める..."
              className="w-full bg-transparent text-white/90 placeholder:text-white/30 px-6 py-4 pr-14 outline-none"
              style={{
                letterSpacing: '0.03em',
              }}
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
            >
              <Send className="w-5 h-5 text-white/70" />
            </button>
          </div>
          
          {/* 微かな反射効果 */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            }}
          />
        </form>
      </motion.div>
    </div>
  );
}
