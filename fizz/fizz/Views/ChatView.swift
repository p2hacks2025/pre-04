//
//  ChatView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct Message: Identifiable {
    let id = UUID()
    let text: String
    let isMine: Bool
    let timestamp: Date
}

struct ChatView: View {
    @Environment(AppState.self) private var appState
    @State private var messages: [Message] = []
    @State private var inputText: String = ""
    @State private var myTime: Double = 60
    @State private var partnerTime: Double = 60
    @State private var myMaxTime: Double = 120
    @State private var partnerMaxTime: Double = 120
    @State private var myCooldown: Double = 0
    @State private var showExitConfirm = false
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    Spacer()
                    Text("会話中")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.4))
                    Spacer()
                    Button(action: {
                        showExitConfirm = true
                    }) {
                        Image(systemName: "xmark")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.6))
                            .padding(8)
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                    }
                }
                .padding(.horizontal)
                .padding(.top, 10)
                
                // Sparklers Area
                HStack(alignment: .top) {
                    // Partner Sparkler
                    SparklerBar(time: partnerTime, maxTime: partnerMaxTime, color: .blue, label: "相手")
                    
                    Spacer()
                    
                    // My Sparkler
                    Button(action: extendMyTime) {
                        SparklerBar(time: myTime, maxTime: myMaxTime, color: .orange, label: "あなた")
                            .overlay(
                                Group {
                                    if myCooldown > 0 {
                                        Text("\(Int(myCooldown))s")
                                            .font(.caption2)
                                            .padding(4)
                                            .background(Color.black.opacity(0.6))
                                            .clipShape(Capsule())
                                            .offset(y: -40)
                                    }
                                }
                            )
                    }
                    .disabled(myCooldown > 0 || myTime >= myMaxTime)
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 10)
                
                // Messages Area
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(messages) { msg in
                                HStack {
                                    if msg.isMine { Spacer() }
                                    
                                    Text(msg.text)
                                        .font(.subheadline)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(msg.isMine ? Color.white.opacity(0.1) : Color.blue.opacity(0.3)) // Distinct colors
                                        .foregroundColor(.white.opacity(0.9))
                                        .cornerRadius(16)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                                        )
                                    
                                    if !msg.isMine { Spacer() }
                                }
                                .transition(.opacity.combined(with: .slide))
                            }
                        }
                        .padding()
                    }
                    .onChange(of: messages.count) {
                        if let last = messages.last {
                            withAnimation {
                                proxy.scrollTo(last.id, anchor: .bottom)
                            }
                        }
                    }
                }
                
                // Input Area
                HStack(spacing: 10) {
                    TextField("メッセージを入力...", text: $inputText)
                        .padding(12)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                        .foregroundColor(.white)
                        .onSubmit(sendMessage)
                    
                    Button(action: sendMessage) {
                        Image(systemName: "paperplane.fill")
                            .foregroundColor(.white)
                            .padding(12)
                            .background(Color.orange)
                            .clipShape(Circle())
                    }
                    .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty)
                }
                .padding()
                .background(Color(hex: "0f1635").opacity(0.8)) // Input bar bg
            }
            
            if showExitConfirm {
                Color.black.opacity(0.6).ignoresSafeArea()
                    .onTapGesture { showExitConfirm = false }
                
                VStack(spacing: 20) {
                    Text("会話を終了しますか？")
                        .font(.headline)
                        .foregroundColor(.white)
                    
                    Text("途中で退出すると会話は保存されません")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.5))
                        .multilineTextAlignment(.center)
                    
                    HStack(spacing: 16) {
                        Button("キャンセル") { showExitConfirm = false }
                            .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.white.opacity(0.1))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                        
                        Button("退出する") {
                            endChat()
                        }
                        .padding()
                            .frame(maxWidth: .infinity)
                            .background(Color.red.opacity(0.8))
                            .cornerRadius(12)
                            .foregroundColor(.white)
                    }
                }
                .padding(24)
                .background(Color(hex: "0a1428"))
                .cornerRadius(24)
                .padding(.horizontal, 40)
            }
        }
        .onReceive(timer) { _ in
            if myTime > 0 { myTime -= 1 }
            if partnerTime > 0 { partnerTime -= 1 }
            if myCooldown > 0 { myCooldown -= 1 }
            
            if myTime <= 0 && partnerTime <= 0 {
                endChat()
            }
            
            // Random partner messages logic simulation
            if partnerTime > 5 && messages.count > 0 && Int.random(in: 0...100) < 5 {
                // Simplified random response
                 receiveMessage("相手のメッセージシミュレーション")
            }
        }
    }
    
    private func sendMessage() {
        guard !inputText.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        let msg = Message(text: inputText, isMine: true, timestamp: Date())
        messages.append(msg)
        inputText = ""
        
        let generator = UIImpactFeedbackGenerator(style: .light)
        generator.impactOccurred()
    }
    
    private func receiveMessage(_ text: String) {
        let msg = Message(text: text, isMine: false, timestamp: Date())
        messages.append(msg)
    }
    
    private func extendMyTime() {
        if myCooldown <= 0 && myTime < myMaxTime {
            myTime = min(myMaxTime, myTime + 30)
            myCooldown = 10
            let generator = UIImpactFeedbackGenerator(style: .heavy)
            generator.impactOccurred()
        }
    }
    
    private func endChat() {
        // Create history
        let history = ChatHistory(
            id: UUID().uuidString,
            date: Date(),
            genre: appState.selectedGenre ?? .random,
            duration: 60, // Simplified
            messageCount: messages.count
        )
        appState.endChat(history: history)
    }
}

struct SparklerBar: View {
    var time: Double
    var maxTime: Double
    var color: Color
    var label: String
    
    var body: some View {
        VStack {
            ZStack(alignment: .bottom) {
                Capsule()
                    .fill(Color.white.opacity(0.1))
                    .frame(width: 4, height: 60)
                
                Capsule()
                    .fill(color)
                    .frame(width: 4, height: 60 * CGFloat(time / maxTime))
            }
            
            // Spark effect (simple circle)
            Circle()
                .fill(RadialGradient(colors: [color, .clear], center: .center, startRadius: 2, endRadius: 10))
                .frame(width: 20, height: 20)
                .opacity(0.8)
                .scaleEffect(1.0 + CGFloat.random(in: 0...0.2)) // Not really animating frame-by-frame here without timelineview but okay
            
            Text(label)
                .font(.caption2)
                .foregroundColor(color.opacity(0.8))
        }
    }
}
