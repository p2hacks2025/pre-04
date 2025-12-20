//
//  WaitingView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct WaitingView: View {
    @Environment(AppState.self) private var appState
    
    // Animation States
    @State private var isMatched = false
    @State private var showSparkler = false
    @State private var candleOffset: CGFloat = 0
    @State private var sparklerState = SparklerState(maxDuration: 60, currentIntensity: 0.0)
    
    // Sparkler Position helper
    @State private var sparklerOffsetY: CGFloat = -400 // Start offscreen top
    
    var body: some View {
        ZStack {
            // Background Sparkles for atmosphere
            SparklesView(count: 30)
                .ignoreSafeAreaAndBlur()
            
            VStack {
                Spacer()
                
                // Match TopView layout: Content at bottom
                VStack(spacing: 24) {
                    ZStack {
                        // 1. Candle
                        CandleView(isLit: true)
                            .scaleEffect(isMatched ? 0.8 : 1.0)
                            .offset(y: candleOffset)
                            .animation(.easeInOut(duration: 1.0), value: candleOffset)
                            .animation(.spring(response: 0.5, dampingFraction: 0.7), value: isMatched)

                        // 2. Sparkler (Descends upon match)
                        if showSparkler {
                            SparklerView(state: sparklerState, isMine: true)
                                .frame(width: 150, height: 300)
                                .offset(y: sparklerOffsetY)
                                .transition(.move(edge: .top))
                        }
                    }
                    // No fixed height, let it size to content
                    
                    // Text Area
                    VStack(spacing: 16) {
                        if !isMatched {
                            Text("マッチング中...")
                                .font(.title2)
                                .foregroundColor(.white)
                                .transition(.opacity)
                            
                            if let genre = appState.selectedGenre {
                                Text(genre.displayName)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 4)
                                    .background(Color.white.opacity(0.1))
                                    .cornerRadius(8)
                                    .foregroundColor(.white.opacity(0.8))
                            }
                        } else {
                             Text("マッチしました！！")
                                .font(.title)
                                .fontWeight(.bold)
                                .foregroundColor(.orange)
                                .scaleEffect(1.2)
                                .transition(.scale.combined(with: .opacity))
                        }
                    }
                    .animation(.easeInOut, value: isMatched)
                }
                .padding(.bottom, 100) // Match TopView
                
                if !isMatched {
                    Button("キャンセル") {
                        appState.backToTop()
                    }
                    .foregroundColor(.white.opacity(0.6))
                    .padding(.top, 20) // spacing from content
                    .padding(.bottom, 50) // extra bottom safe area
                    .transition(.opacity)
                }
            }
        }
        .onAppear {
            startMatchingSimulation()
        }
    }
    
    private func startMatchingSimulation() {
        // Simulate Match Delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
            startIgnitionSequence()
        }
    }
    
    private func startIgnitionSequence() {
        // 1. Matched State
        withAnimation {
            isMatched = true
        }
        
        // 2. Show Sparkler & Move Candle
        showSparkler = true
        
        withAnimation(.easeInOut(duration: 1.5)) {
            // Adjust offsets for the new bottom-aligned layout
            // Sparkler view height is 300. Handle is ~180. Center is at 150.
            // ZStack alignment is center.
            // Candle is at center.
            // We want sparkler tip (bottom of handle) to meet candle flame (top of candle).
            
            // Start high up (offscreen) -> Move down
            // Initial state (set in property): -400.
            
            // Target state:
            // If sparkler center is at 0, its tip is at +something?
            // SparklerView draws from top(0) to length.
            // In SparklerView: origin=(centerX,0), tip=(centerX, length).
            // So View origin is Top-Center of frame? No, GeometryReader.
            // Frame is 300. Length 180. Tip at y=180.
            // If offset is 0, frame intersects ZStack center.
            // Candle (Circle) frame default ~60?
            // Flame matches candle top.
            
            // We want Sparkler Tip (y=180 relative to frame top) to be at Candle Top.
            // Let's set target offset such that sparkler descends.
            
            sparklerOffsetY = -80 // Move down significantly.
            candleOffset = 0 // Keep candle steady
        }
        
        // 3. Ignite!
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
            igniteSparkler()
        }
    }
    
    private func igniteSparkler() {
        // Intense burst
        sparklerState.currentIntensity = 1.0
        
        SoundManager.shared.playFireUp()
        
        let generator = UIImpactFeedbackGenerator(style: .heavy)

        generator.impactOccurred()
        
        // 4. Transition to Chat after brief spectacle
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
             appState.matched()
        }
    }
}

extension View {
    func ignoreSafeAreaAndBlur() -> some View {
        self.modifier(IgnoredBlurBackground())
    }
}

struct IgnoredBlurBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .ignoresSafeArea()
            .blur(radius: 2) // Slight depth of field focus on foreground
            .overlay(Color.black.opacity(0.3)) // Dim background
    }
}
