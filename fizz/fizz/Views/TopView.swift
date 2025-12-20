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
    // Animation states
    @State private var textOpacity: Double = 0.5
    @State private var isPressing: Bool = false
    
    var body: some View {
        ZStack {
            // Main Content (Candle)
            VStack {
                Spacer()
                
                VStack(spacing: 24) {
                    CandleView(isLit: false)
                        .scaleEffect(isPressing ? 1.05 : 1.0)
                        .animation(.easeInOut(duration: 0.2), value: isPressing)
                    
                    Text(isPressing ? "点火中..." : "長押しして火を灯す")
                        .font(.callout)
                        .kerning(2)
                        .foregroundColor(.white.opacity(isPressing ? 1.0 : 0.6))
                        .animation(.easeInOut(duration: 0.2), value: isPressing)
                }
                .contentShape(Rectangle()) // Ensure hit area
                .onLongPressGesture(minimumDuration: 1.0, pressing: { pressing in
                    isPressing = pressing
                    if pressing {
                        let generator = UIImpactFeedbackGenerator(style: .light)
                        generator.impactOccurred()
                    }
                }) {
                    let generator = UIImpactFeedbackGenerator(style: .heavy)
                    generator.impactOccurred()
                    appState.startChat()
                }
                .padding(.bottom, 100)
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
                        SoundManager.shared.playCursor()
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
        .onAppear {
            SoundManager.shared.playBGM()
        }
        .sheet(isPresented: $showingGenreSelector) {
            GenreSelectorView(isPresented: $showingGenreSelector)

                .presentationDetents([.fraction(0.6)]) // Drawer-like
                .presentationDragIndicator(.visible)
        }
    }
}
