import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, Trash2, Check, Edit2 } from 'lucide-react';
import { Deck, DeckItem } from '../App';

interface DeckCreatorProps {
  onBack: () => void;
  decks: Deck[];
  onSaveDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onSetActiveDeck: (deck: Deck | null) => void;
  activeDeck: Deck | null;
}

export function DeckCreator({
  onBack,
  decks,
  onSaveDeck,
  onDeleteDeck,
  onSetActiveDeck,
  activeDeck,
}: DeckCreatorProps) {
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [deckName, setDeckName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: 'デッキ ' + (decks.length + 1),
      items: [],
    };
    setEditingDeck(newDeck);
    setDeckName(newDeck.name);
  };

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setDeckName(deck.name);
  };

  const handleAddItem = () => {
    if (!newItemText.trim() || !editingDeck) return;

    const newItem: DeckItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
    };

    setEditingDeck({
      ...editingDeck,
      items: [...editingDeck.items, newItem],
    });
    setNewItemText('');

    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (!editingDeck) return;
    setEditingDeck({
      ...editingDeck,
      items: editingDeck.items.filter((item) => item.id !== itemId),
    });
  };

  const handleSave = () => {
    if (!editingDeck || !deckName.trim()) return;

    const updatedDeck = {
      ...editingDeck,
      name: deckName.trim(),
    };

    onSaveDeck(updatedDeck);
    setEditingDeck(null);
    setDeckName('');

    if ('vibrate' in navigator) {
      navigator.vibrate([30, 20, 30]);
    }
  };

  const handleCancel = () => {
    setEditingDeck(null);
    setDeckName('');
    setNewItemText('');
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
          <h2 className="text-white/80 text-xl">会話デッキ</h2>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {editingDeck ? (
            <motion.div
              key="editor"
              className="h-full flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* デッキ名入力 */}
              <div className="px-6 py-4 border-b border-white/10">
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  placeholder="デッキ名"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-amber-400/50"
                />
              </div>

              {/* アイテム入力 */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                    placeholder="フレーズを追加..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 placeholder:text-white/30 outline-none focus:border-amber-400/50"
                  />
                  <button
                    onClick={handleAddItem}
                    disabled={!newItemText.trim()}
                    className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/30 disabled:opacity-50 disabled:bg-white/5 disabled:border-white/10"
                  >
                    <Plus className="w-5 h-5 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* アイテム一覧 */}
              <div className="flex-1 overflow-y-auto scrollable px-6 py-4">
                <div className="space-y-2">
                  {editingDeck.items.length === 0 ? (
                    <p className="text-white/30 text-center py-12">
                      フレーズを追加してください
                    </p>
                  ) : (
                    editingDeck.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <span className="flex-1 text-white/80 text-sm">
                          {item.text}
                        </span>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* 保存・キャンセルボタン */}
              <div className="safe-bottom bg-[#0a1428]/80 backdrop-blur-md border-t border-white/10 px-6 py-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!deckName.trim() || editingDeck.items.length === 0}
                    className="flex-1 py-3 rounded-xl bg-amber-500/80 border border-amber-400/30 text-white disabled:opacity-50 disabled:bg-white/5 disabled:border-white/10"
                  >
                    保存
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="h-full flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* デッキ一覧 */}
              <div className="flex-1 overflow-y-auto scrollable px-6 py-4">
                {decks.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                      <Plus className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-white/40 mb-2">まだデッキがありません</p>
                    <p className="text-white/30 text-sm">
                      よく使うフレーズをまとめて
                      <br />
                      会話をスムーズに
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {decks.map((deck, index) => (
                      <motion.div
                        key={deck.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-white/80 flex items-center gap-2">
                            {deck.name}
                            {activeDeck?.id === deck.id && (
                              <span className="px-2 py-1 bg-amber-500/20 rounded-md text-xs text-amber-300">
                                使用中
                              </span>
                            )}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditDeck(deck)}
                              className="p-2 rounded-lg hover:bg-white/5"
                            >
                              <Edit2 className="w-4 h-4 text-white/60" />
                            </button>
                            <button
                              onClick={() => onDeleteDeck(deck.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-white/40 text-sm mb-3">
                          {deck.items.length}個のフレーズ
                        </p>
                        <button
                          onClick={() =>
                            onSetActiveDeck(activeDeck?.id === deck.id ? null : deck)
                          }
                          className={`w-full py-2 rounded-lg border transition-all ${
                            activeDeck?.id === deck.id
                              ? 'bg-amber-500/20 border-amber-400/30 text-amber-300'
                              : 'bg-white/5 border-white/10 text-white/60'
                          }`}
                        >
                          {activeDeck?.id === deck.id ? '使用中' : '使用する'}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* 新規作成ボタン */}
              <div className="safe-bottom bg-[#0a1428]/80 backdrop-blur-md border-t border-white/10 px-6 py-4">
                <button
                  onClick={handleCreateDeck}
                  className="w-full py-4 rounded-2xl bg-amber-500/80 border border-amber-400/30 text-white flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>新しいデッキを作成</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
