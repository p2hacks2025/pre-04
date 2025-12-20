//
//  ChatView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct ChatView: View {
    @Environment(AppState.self) private var appState
    @StateObject private var chatVM = ChatViewModel()
    
    @State private var inputText: String = ""
    @State private var showExitConfirm = false
    @State private var showDeckPanel = false // Control deck visibility
    
    var body: some View {
        ZStack {
            // Background Layer (Night sky)
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
            
            // Sparkles (Simple background effect)
            SparkleBackground()
            
            // 2. Sparklers Layer (Back layer but visible)
            VStack {
                // Header Area Space
                Spacer().frame(height: 80)
                
                HStack(alignment: .top) {
                    // Partner Sparkler (Left)
                    VStack {
                        Text("相手")
                            .font(.caption)
                            .foregroundColor(.blue.opacity(0.5))
                        SparklerView(state: chatVM.partnerSparkler, isMine: false)
                            .frame(width: 120, height: 300)
                            .scaleEffect(x: -1, y: 1)
                            .allowsHitTesting(false)
                    }
                    
                    Spacer()
                    
                    // My Sparkler (Right)
                    VStack {
                        Text("あなた")
                            .font(.caption)
                            .foregroundColor(.orange.opacity(0.5))
                        SparklerView(state: chatVM.mySparkler, isMine: true)
                            .frame(width: 120, height: 300)
                            .onTapGesture {
                                let generator = UIImpactFeedbackGenerator(style: .medium)
                                generator.impactOccurred()
                                chatVM.sparkAction()
                            }
                    }
                }
                .padding(.horizontal, 20)
                
                Spacer()
            }
            .ignoresSafeArea()
            
            // 1. Messages Layer (Scrollable)
            VStack(spacing: 0) {
                // Header
                HStack {
                    Spacer().frame(width: 44) // Balance
                    Spacer()
                    Text("会話中")
                        .font(.subheadline)
                        .tracking(2)
                        .foregroundColor(.white.opacity(0.4))
                    Spacer()
                    Button(action: {
                        showExitConfirm = true
                    }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white.opacity(0.6))
                            .padding(10)
                            .background(Material.ultraThinMaterial)
                            .clipShape(Circle())
                            .overlay(
                                Circle().stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                    }
                }
                .padding(.horizontal)
                .padding(.top, 10) // Safe Area top handled by Spacer usually
                
                // Messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(chatVM.messages.suffix(6)) { msg in
                                MessageRow(message: msg)
                                    .transition(.opacity.combined(with: .move(edge: .bottom)))
                            }
                        }

                        .padding(.top, 240) // Space for sparklers
                        .padding(.bottom, 20)
                        .padding(.horizontal)
                    }
                    .onChange(of: chatVM.messages) { _, _ in
                        if let last = chatVM.messages.last {
                            withAnimation {
                                proxy.scrollTo(last.id, anchor: .bottom)
                            }
                        }
                    }
                }
                
                // Input Area
                VStack(spacing: 0) {
                    // Deck Panel (Floating above input)
                    if showDeckPanel, let deck = appState.activeDeck {
                        VStack(alignment: .leading, spacing: 10) {
                            Text(deck.name)
                                .font(.caption)
                                .foregroundColor(.orange.opacity(0.8))
                                .padding(.leading, 4)
                            
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                                ForEach(deck.items) { item in
                                    Button(action: {
                                        inputText = item.text
                                        showDeckPanel = false
                                    }) {
                                        Text(item.text)
                                            .font(.caption)
                                            .foregroundColor(.white.opacity(0.9))
                                            .padding(10)
                                            .frame(maxWidth: .infinity, alignment: .leading)
                                            .background(Color.white.opacity(0.08))
                                            .cornerRadius(8)
                                    }
                                }
                            }
                        }
                        .padding()
                        .background(Color(hex: "0a1428").opacity(0.95))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                        .padding(.horizontal)
                        .padding(.bottom, 8)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                    }
                    
                    // Input Bar
                    HStack(spacing: 12) {
                        // Deck Button
                        if appState.activeDeck != nil {
                            Button(action: {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                                    showDeckPanel.toggle()
                                }
                            }) {
                                Image(systemName: "rectangle.grid.2x2.fill") // Deck icon
                                    .font(.system(size: 20))
                                    .foregroundColor(showDeckPanel ? .orange : .white.opacity(0.6))
                                    .padding(10)
                                    .background(Material.ultraThinMaterial)
                                    .clipShape(Circle())
                                    .overlay(
                                        Circle().stroke(Color.white.opacity(0.1), lineWidth: 1)
                                    )
                            }
                        }

                        
                        // Text Field
                        TextField("メッセージを入力...", text: $inputText)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                            .background(Material.ultraThinMaterial)
                            .cornerRadius(24)
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                            .foregroundColor(.white)
                            .onSubmit(sendMessage)
                        
                        // Send Button
                        Button(action: sendMessage) {
                            Image(systemName: "paperplane.fill")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                                .padding(12)
                                .background(LinearGradient(colors: [.orange, Color(hex: "ffca28")], startPoint: .topLeading, endPoint: .bottomTrailing))
                                .clipShape(Circle())
                                .shadow(color: .orange.opacity(0.3), radius: 5)
                        }
                        .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty)
                        .opacity(inputText.trimmingCharacters(in: .whitespaces).isEmpty ? 0.5 : 1.0)
                    }
                    .padding(.horizontal)
                    .padding(.top, 10)
                    .padding(.bottom, 8) // Bottom padding
                    .background(
                        LinearGradient(colors: [Color(hex: "0f1635").opacity(0.0), Color(hex: "0f1635")], startPoint: .top, endPoint: .bottom)
                    )
                }
            }
            
            // Exit Confirm Dialog
            if showExitConfirm {
                Color.black.opacity(0.6).ignoresSafeArea()
                    .onTapGesture { showExitConfirm = false }
                    .transition(.opacity)
                
                VStack(spacing: 24) {
                    VStack(spacing: 8) {
                        Text("会話を終了しますか？")
                            .font(.headline)
                            .foregroundColor(.white)
                        
                        Text("途中で退出すると会話は保存されません")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.5))
                            .multilineTextAlignment(.center)
                    }
                    
                    HStack(spacing: 12) {
                        Button("キャンセル") {
                            withAnimation { showExitConfirm = false }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(12)
                        .foregroundColor(.white.opacity(0.7))
                        
                        Button("退出する") {
                            endChat()
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.red.opacity(0.8))
                        .cornerRadius(12)
                        .foregroundColor(.white)
                    }
                }
                .padding(30)
                .background(Color(hex: "0a1428"))
                .cornerRadius(24)
                .padding(.horizontal, 40)
                .transition(.scale(scale: 0.9).combined(with: .opacity))
            }
        }
        .onAppear {
            SoundManager.shared.startFireFlowerLoop() // Start looping sound
            chatVM.onFinish = {
                endChat()
            }
        }
        .onDisappear {
             SoundManager.shared.stopFireFlowerLoop()
        }

    }
    
    private func sendMessage() {
        guard !inputText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        chatVM.sendMessage(inputText)
        inputText = ""
        showDeckPanel = false // Hide deck if open
        
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }
    
    private func endChat() {
        SoundManager.shared.stopFireFlowerLoop()
        // matchManager.stopListening() // Legacy
        let history = ChatHistory(
            id: UUID().uuidString,
            date: Date(),
            genre: appState.selectedGenre ?? .random,
            duration: 60,
            messageCount: chatVM.messages.count
        )
        appState.endChat(history: history)
    }
}

// MARK: - Subviews

struct SparkleBackground: View {
    let randomPositions: [CGPoint] = (0..<30).map { _ in
        CGPoint(x: CGFloat.random(in: 0...1), y: CGFloat.random(in: 0...1))
    }
    
    var body: some View {
        GeometryReader { geo in
            ForEach(0..<randomPositions.count, id: \.self) { i in
                Circle()
                    .fill(Color.white)
                    .frame(width: CGFloat.random(in: 1...2), height: CGFloat.random(in: 1...2))
                    .position(
                        x: randomPositions[i].x * geo.size.width,
                        y: randomPositions[i].y * geo.size.height
                    )
                    .opacity(Double.random(in: 0.2...0.5))
            }
        }
        .allowsHitTesting(false)
    }
}

struct MessageRow: View {
    let message: Message
    
    var body: some View {
        HStack(alignment: .bottom, spacing: 8) {
            if message.senderId == "me" { Spacer() }
            
            Text(message.content)
                .font(.system(size: 15))
                .lineSpacing(4)
                .foregroundColor(message.senderId == "me" ? Color(hex: "fff3e0") : .white.opacity(0.9)) // Warm white for me
                .padding(.horizontal, 16)
                .padding(.vertical, 10)
                .background(
                    message.senderId == "me"
                    ? Color.white.opacity(0.1)
                    : Color.blue.opacity(0.2)
                )
                .cornerRadius(18, corners: message.senderId == "me"
                              ? [.topLeft, .topRight, .bottomLeft]
                              : [.topLeft, .topRight, .bottomRight])
                .overlay(
                    RoundedCorner(radius: 18, corners: message.senderId == "me"
                                  ? [.topLeft, .topRight, .bottomLeft]
                                  : [.topLeft, .topRight, .bottomRight])
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
            
            if message.senderId != "me" { Spacer() }
        }
    }
}

// MARK: - Helpers

extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape( RoundedCorner(radius: radius, corners: corners) )
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}
