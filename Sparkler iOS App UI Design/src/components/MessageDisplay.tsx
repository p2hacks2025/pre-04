import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MessageDisplayProps {
  message: { text: string; id: string } | null;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <div className="absolute top-[60%] left-0 right-0 flex justify-center px-8">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message.id}
            className="max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          >
            <p
              className="text-white/90 tracking-wide leading-relaxed px-6"
              style={{
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              {message.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
