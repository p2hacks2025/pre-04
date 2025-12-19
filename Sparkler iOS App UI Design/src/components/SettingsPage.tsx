import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, VolumeX, Vibrate, Info } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

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
          <h2 className="text-white/80 text-xl">設定</h2>
        </div>
      </div>

      {/* 設定項目 */}
      <div className="flex-1 overflow-y-auto scrollable px-6 py-6">
        <div className="space-y-6">
          {/* サウンド設定 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-white/70" />
                ) : (
                  <VolumeX className="w-5 h-5 text-white/40" />
                )}
                <div>
                  <h3 className="text-white/80">サウンド</h3>
                  <p className="text-white/40 text-xs">効果音を再生</p>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-8 rounded-full transition-all ${
                  soundEnabled ? 'bg-amber-500/80' : 'bg-white/10'
                }`}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: soundEnabled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>

          {/* バイブレーション設定 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-white/70" />
                <div>
                  <h3 className="text-white/80">バイブレーション</h3>
                  <p className="text-white/40 text-xs">振動フィードバック</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setVibrationEnabled(!vibrationEnabled);
                  if ('vibrate' in navigator && !vibrationEnabled) {
                    navigator.vibrate(50);
                  }
                }}
                className={`w-14 h-8 rounded-full transition-all ${
                  vibrationEnabled ? 'bg-amber-500/80' : 'bg-white/10'
                }`}
              >
                <motion.div
                  className="w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: vibrationEnabled ? 28 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>

          {/* アプリ情報 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-white/70 mt-1" />
              <div>
                <h3 className="text-white/80 mb-2">FIZZについて</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  線香花火のように短く儚い、
                  <br />
                  匿名の会話を楽しむアプリです。
                </p>
                <div className="space-y-2 text-xs text-white/40">
                  <p>バージョン: 1.0.0</p>
                  <p>© 2024 FIZZ</p>
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4">
            <h3 className="text-amber-300 text-sm mb-2">ご利用上の注意</h3>
            <ul className="text-amber-200/60 text-xs space-y-1 leading-relaxed">
              <li>• 会話は記録されません</li>
              <li>• 個人情報は共有しないでください</li>
              <li>• 他者への思いやりを忘れずに</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
