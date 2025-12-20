//
//  AppState.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI
import Observation

@Observable
class AppState {
    var currentScreen: Screen = .top
    var isMenuOpen: Bool = false
    var selectedGenre: Genre? = nil
    var decks: [Deck] = []
    var activeDeck: Deck? = nil
    var chatHistories: [ChatHistory] = []
    
    // Settings
    var isSoundEnabled: Bool = true
    var isVibrationEnabled: Bool = true
    
    // Navigation actions
    func navigate(to screen: Screen) {
        currentScreen = screen
        isMenuOpen = false
    }
    
    func navigateBack() {
        // Simple back logic: if in sub-pages, go back to top
        // In a complex app we'd use a stack, but here it's flat from Top -> Page
        currentScreen = .top
    }
    
    func startChat() {
        currentScreen = .waiting
    }
    
    func matched() {
        currentScreen = .chat
    }
    
    func endChat(history: ChatHistory) {
        chatHistories.insert(history, at: 0)
        currentScreen = .end
    }
    
    func backToTop() {
        currentScreen = .top
        selectedGenre = nil
    }
    
    func openMenu() {
        print("AppState: openMenu called")
        isMenuOpen = true
    }
    
    func closeMenu() {
        isMenuOpen = false
    }
    
    // Data Operations
    func saveDeck(_ deck: Deck) {
        if let index = decks.firstIndex(where: { $0.id == deck.id }) {
            decks[index] = deck
        } else {
            decks.append(deck)
        }
        
        // If this was the active deck, update reference
        if activeDeck?.id == deck.id {
            activeDeck = deck
        }
    }
    
    func deleteDeck(_ deckId: String) {
        decks.removeAll(where: { $0.id == deckId })
        if activeDeck?.id == deckId {
            activeDeck = nil
        }
    }
    
    func setActiveDeck(_ deck: Deck?) {
        activeDeck = deck
    }
}
