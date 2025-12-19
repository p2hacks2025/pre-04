//
//  TopView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct TopView: View {
    @Environment(AppState.self) private var appState
    @State private var showingGenreSelector = false
    
    // Animation states
    @State private var candleOpacity: Double = 0.0
    @State private var textOpacity: Double = 0.5
    
    var body: some View {
        ZStack {
            // Main Content (Candle)
            VStack {
                Button(action: {
                    let generator = UIImpactFeedbackGenerator(style: .medium)
                    generator.impactOccurred()
                    appState.startChat()
                }) {
                    ZStack {
                        // Candle Body
                        RoundedRectangle(cornerRadius: 10) // rounded-t-sm roughly
                            .fill(
                                LinearGradient(
                                    gradient: Gradient(colors: [
                                        Color.yellow.opacity(0.2), // amber-100/200 approximation
                                        Color.orange.opacity(0.3)
                                    ]),
                                    startPoint: .top,
                                    endPoint: .bottom
                                )
                            )
                            .frame(width: 80, height: 112) // w-20 h-28 (20*4, 28*4) -> 80, 112
                            .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 10)
                            .overlay(
                                LinearGradient(
                                    colors: [.clear, .white.opacity(0.1), .clear],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                        
                        // Wick
                        Rectangle()
                            .fill(Color.gray) // gray-800
                            .frame(width: 2, height: 12)
                            .offset(y: -56 - 6) // Half height + half wick
                        
                        // Sparkles around candle (Static/Simple animation for now)
                        // In React code: multiple divs with random generated positions.
                        // Here we keep it simple for MVP.
                    }
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.bottom, 32)
                
                Text("タップして火を灯す")
                    .foregroundColor(.white.opacity(0.5))
                    .opacity(textOpacity)
                    .onAppear {
                        withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: true)) {
                            textOpacity = 0.8
                        }
                    }
            }
            
            // Bottom Genre Selector Button
            VStack {
                Spacer()
                
                Button(action: {
                    showingGenreSelector = true
                }) {
                    HStack {
                        if let genre = appState.selectedGenre {
                            Text(genre.displayName)
                                .foregroundColor(Color(hex: "fcd34d")) // amber-300
                        } else {
                            Text("話したいジャンルを選ぶ")
                                .foregroundColor(.white.opacity(0.7))
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 30)
            }
            
            // Header
            VStack {
                HStack {
                    Button(action: {
                        print("Menu button tapped")
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                        appState.openMenu()
                    }) {
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 24))
                            .foregroundColor(.white.opacity(0.7))
                            .padding()
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                            .overlay(
                                Circle()
                                    .stroke(Color.white.opacity(0.1), lineWidth: 1)
                            )
                            .contentShape(Circle()) // Check hit test
                    }
                    
                    Spacer()
                    
                    Text("FIZZ")
                        .font(.custom("Times New Roman", size: 24)) // Serif approximated
                        .tracking(3)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                    
                    // Empty spacer to balance layout
                    Color.clear.frame(width: 52, height: 52)
                }
                .padding(.horizontal)
                .padding(.top, 10)
                
                Spacer()
            }
            .safeAreaPadding()
        }
        .sheet(isPresented: $showingGenreSelector) {
            GenreSelectorView(isPresented: $showingGenreSelector)
                .presentationDetents([.fraction(0.6)]) // Drawer-like
                .presentationDragIndicator(.visible)
        }
    }
}
