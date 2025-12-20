//
//  DeckCreatorView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/20.
//

import SwiftUI

struct DeckCreatorView: View {
    @Environment(AppState.self) private var appState
    
    // Editor State
    @State private var editingDeck: Deck? = nil
    @State private var deckName: String = ""
    @State private var newItemText: String = ""
    
    var body: some View {
        ZStack {
            // Background
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(hex: "050a14"),
                    Color(hex: "0a1428"),
                    Color(hex: "0f1635")
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: {
                        if editingDeck != nil {
                            // If editing, cancel edit
                            cancelEdit()
                        } else {
                            // If list, go back to top
                            appState.navigateBack()
                        }
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.7))
                            .padding(10)
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                    }
                    
                    Text("会話デッキ")
                        .font(.title3)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                }
                .padding()
                .background(Color(hex: "0a1428").opacity(0.8))
                
                // Content
                if let deck = editingDeck {
                    // Editor Mode
                    deckEditor(deck: deck)
                } else {
                    // List Mode
                    deckList()
                }
            }
        }
    }
    
    // MARK: - List Mode
    
    private func deckList() -> some View {
        VStack {
            ScrollView {
                if appState.decks.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "plus")
                            .font(.system(size: 40))
                            .foregroundColor(.white.opacity(0.2))
                            .frame(width: 80, height: 80)
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                        
                        Text("まだデッキがありません")
                            .foregroundColor(.white.opacity(0.4))
                        
                        Text("よく使うフレーズをまとめて\n会話をスムーズに")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.3))
                            .multilineTextAlignment(.center)
                    }
                    .padding(.top, 60)
                } else {
                    VStack(spacing: 12) {
                        ForEach(appState.decks) { deck in
                            deckRow(deck: deck)
                        }
                    }
                    .padding()
                }
            }
            
            // FAB / Bottom Action
            Button(action: createNewDeck) {
                HStack {
                    Image(systemName: "plus")
                    Text("新しいデッキを作成")
                }
                .fontWeight(.bold)
                .foregroundColor(.white)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.orange.opacity(0.8))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.orange.opacity(0.4), lineWidth: 1)
                )
            }
            .padding()
            .background(Color(hex: "0a1428").opacity(0.8))
        }
    }
    
    private func deckRow(deck: Deck) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text(deck.name)
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.9))
                
                if appState.activeDeck?.id == deck.id {
                    Text("使用中")
                        .font(.caption)
                        .foregroundColor(.yellow)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.yellow.opacity(0.2))
                        .cornerRadius(6)
                }
                
                Spacer()
                
                Button(action: { startEditing(deck) }) {
                    Image(systemName: "pencil")
                        .foregroundColor(.white.opacity(0.6))
                        .padding(8)
                }
                
                Button(action: { appState.deleteDeck(deck.id) }) {
                    Image(systemName: "trash")
                        .foregroundColor(.red.opacity(0.6))
                        .padding(8)
                }
            }
            
            Text("\(deck.items.count)個のフレーズ")
                .font(.caption)
                .foregroundColor(.white.opacity(0.4))
            
            Button(action: {
                if appState.activeDeck?.id == deck.id {
                    appState.setActiveDeck(nil)
                } else {
                    appState.setActiveDeck(deck)
                }
            }) {
                Text(appState.activeDeck?.id == deck.id ? "使用中" : "使用する")
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(appState.activeDeck?.id == deck.id ? .yellow : .white.opacity(0.6))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                    .background(
                        appState.activeDeck?.id == deck.id
                        ? Color.yellow.opacity(0.2)
                        : Color.white.opacity(0.05)
                    )
                    .cornerRadius(8)
                    .overlay(
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(
                                appState.activeDeck?.id == deck.id ? Color.yellow.opacity(0.3) : Color.white.opacity(0.1),
                                lineWidth: 1
                            )
                    )
            }
        }
        .padding()
        .background(Color.white.opacity(0.05))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
    
    // MARK: - Editor Mode
    
    private func deckEditor(deck: Deck) -> some View {
        VStack {
            // Deck Name Input
            TextField("デッキ名", text: $deckName)
                .padding()
                .background(Color.white.opacity(0.05))
                .cornerRadius(12)
                .foregroundColor(.white)
                .padding(.horizontal)
                .padding(.top)
            
            // Add Item Input
            HStack {
                TextField("フレーズを追加...", text: $newItemText)
                    .padding()
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(12)
                    .foregroundColor(.white)
                    .onSubmit(addItem)
                
                Button(action: addItem) {
                    Image(systemName: "plus")
                        .foregroundColor(.orange)
                        .padding()
                        .background(Color.orange.opacity(0.2))
                        .cornerRadius(12)
                }
                .disabled(newItemText.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(.horizontal)
            .padding(.top, 8)
            
            // Items List
            List {
                ForEach(editingDeck?.items ?? []) { item in
                    HStack {
                        Text(item.text)
                            .foregroundColor(.white.opacity(0.9))
                        Spacer()
                    }
                    .listRowBackground(Color.white.opacity(0.05))
                    .listRowSeparatorTint(Color.white.opacity(0.1))
                    .swipeActions(edge: .trailing) {
                        Button(role: .destructive) {
                            removeItem(item.id)
                        } label: {
                            Label("削除", systemImage: "trash")
                        }
                    }
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            
            // Action Buttons
            HStack(spacing: 12) {
                Button(action: cancelEdit) {
                    Text("キャンセル")
                        .foregroundColor(.white.opacity(0.6))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                }
                
                Button(action: saveDeck) {
                    Text("保存")
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.orange.opacity(0.8))
                        .cornerRadius(12)
                }
                .disabled(deckName.isEmpty || (editingDeck?.items.isEmpty ?? true))
            }
            .padding()
            .background(Color(hex: "0a1428").opacity(0.9))
        }
    }
    
    // MARK: - Logic
    
    private func createNewDeck() {
        let newDeck = Deck(id: UUID().uuidString, name: "デッキ \(appState.decks.count + 1)", items: [])
        startEditing(newDeck)
    }
    
    private func startEditing(_ deck: Deck) {
        editingDeck = deck
        deckName = deck.name
        newItemText = ""
    }
    
    private func addItem() {
        guard !newItemText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        
        var currentItems = editingDeck?.items ?? []
        let newItem = DeckItem(id: UUID().uuidString, text: newItemText)
        currentItems.append(newItem)
        
        editingDeck?.items = currentItems
        newItemText = ""
        
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }
    
    private func removeItem(_ itemId: String) {
        if var items = editingDeck?.items {
            items.removeAll(where: { $0.id == itemId })
            editingDeck?.items = items
        }
    }
    
    private func saveDeck() {
        guard var deck = editingDeck else { return }
        deck.name = deckName
        appState.saveDeck(deck)
        editingDeck = nil
        
        let generator = UINotificationFeedbackGenerator()
        generator.notificationOccurred(.success)
    }
    
    private func cancelEdit() {
        editingDeck = nil
    }
}
