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
    
    // Navigation actions
    func navigate(to screen: Screen) {
        currentScreen = screen
        isMenuOpen = false
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
}
