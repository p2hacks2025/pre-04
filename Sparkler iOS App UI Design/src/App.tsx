import React, { useState, useEffect } from 'react';
import { TopPage } from './components/TopPage';
import { WaitingPage } from './components/WaitingPage';
import { ChatPage } from './components/ChatPage';
import { EndPage } from './components/EndPage';
import { MenuDrawer } from './components/MenuDrawer';
import { DeckCreator } from './components/DeckCreator';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';

export type Screen = 'top' | 'waiting' | 'chat' | 'end' | 'deck' | 'history' | 'settings';
export type Genre = 'hobby' | 'casual' | 'complaint' | 'life' | 'work' | 'random';

export interface DeckItem {
  id: string;
  text: string;
}

export interface Deck {
  id: string;
  name: string;
  items: DeckItem[];
}

export interface ChatHistory {
  id: string;
  date: Date;
  genre: Genre;
  duration: number;
  messageCount: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('top');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  // ビューポート高さの設定（iPhoneのアドレスバー対策）
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const handleStartChat = () => {
    setCurrentScreen('waiting');
  };

  const handleMatched = () => {
    setCurrentScreen('chat');
  };

  const handleChatEnd = (history: ChatHistory) => {
    setChatHistories((prev) => [history, ...prev]);
    setCurrentScreen('end');
  };

  const handleBackToTop = () => {
    setCurrentScreen('top');
    setSelectedGenre(null);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  const handleSaveDeck = (deck: Deck) => {
    setDecks((prev) => {
      const existing = prev.find((d) => d.id === deck.id);
      if (existing) {
        return prev.map((d) => (d.id === deck.id ? deck : d));
      }
      return [...prev, deck];
    });
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  return (
    <div className="app-container">
      {currentScreen === 'top' && (
        <TopPage
          onStartChat={handleStartChat}
          onOpenMenu={handleOpenMenu}
          selectedGenre={selectedGenre}
          onSelectGenre={setSelectedGenre}
        />
      )}
      {currentScreen === 'waiting' && (
        <WaitingPage
          onMatched={handleMatched}
          onCancel={handleBackToTop}
          genre={selectedGenre}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatPage
          onEnd={handleChatEnd}
          genre={selectedGenre}
          activeDeck={activeDeck}
        />
      )}
      {currentScreen === 'end' && (
        <EndPage onBackToTop={handleBackToTop} />
      )}
      {currentScreen === 'deck' && (
        <DeckCreator
          onBack={() => handleNavigate('top')}
          decks={decks}
          onSaveDeck={handleSaveDeck}
          onDeleteDeck={handleDeleteDeck}
          onSetActiveDeck={setActiveDeck}
          activeDeck={activeDeck}
        />
      )}
      {currentScreen === 'history' && (
        <HistoryPage
          histories={chatHistories}
          onBack={() => handleNavigate('top')}
        />
      )}
      {currentScreen === 'settings' && (
        <SettingsPage onBack={() => handleNavigate('top')} />
      )}

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onNavigate={handleNavigate}
      />
    </div>
  );
}