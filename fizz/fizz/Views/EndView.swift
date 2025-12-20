//
//  EndView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct EndView: View {
    @Environment(AppState.self) private var appState
    
    // Animation States
    @State private var textOpacity = 0.0
    @State private var textOffset: CGFloat = 20
    @State private var detailsOpacity = 0.0
    @State private var detailsScale: CGFloat = 0.9
    @State private var buttonOpacity = 0.0
    @State private var buttonOffset: CGFloat = 20
    @State private var scentScale: CGFloat = 1.0
    @State private var scentOpacity: Double = 1.0
    
    // Smoke Particles
    @State private var smokeParticles: [SmokeParticle] = []
    
    // Stars
    private let stars: [StarProperties] = (0..<60).map { _ in StarProperties.random() }
    
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
            
            // Stars
            ForEach(0..<stars.count, id: \.self) { i in
                let star = stars[i]
                Circle()
                    .fill(Color.white)
                    .frame(width: 1.5, height: 1.5)
                    .position(x: star.x * UIScreen.main.bounds.width,
                              y: star.y * UIScreen.main.bounds.height)
                    .opacity(0.3)
                    // Simple twinkling could be added here with onAppear animation but keeping static/subtle for now
                    // due to performance with ForEach
            }
            
            // Smoke & Scent Area (Top 35%)
            GeometryReader { geo in
                let centerX = geo.size.width / 2
                let topY = geo.size.height * 0.35
                
                ZStack {
                    // Smoke
                    ForEach(smokeParticles) { particle in
                        SmokeView(particle: particle)
                            .position(x: centerX, y: topY)
                    }
                    
                    // Remaining Scent (Glowing Dot)
                    Circle()
                        .fill(Color.orange)
                        .frame(width: 24, height: 24)
                        .blur(radius: 2)
                        .shadow(color: .orange, radius: 15)
                        .position(x: centerX, y: topY)
                        .scaleEffect(scentScale)
                        .opacity(scentOpacity)
                }
            }
            .ignoresSafeArea()
            
            // Text Content
            VStack(spacing: 0) {
                Spacer()
                
                VStack(spacing: 24) {
                    Text("火が落ちました")
                        .font(.title2)
                        .tracking(4)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Text("言葉は消えても\n温かさは残り香として心に")
                        .font(.subheadline)
                        .tracking(1)
                        .multilineTextAlignment(.center)
                        .foregroundColor(.white.opacity(0.5))
                        .lineSpacing(8)
                }
                .opacity(textOpacity)
                .offset(y: textOffset)
                
                SizedBox(height: 32)
                
                // History Summary (Most recent)
                if let history = appState.chatHistories.first {
                    HStack(spacing: 32) {
                        VStack(spacing: 4) {
                            Circle()
                                .fill(Color.orange)
                                .frame(width: 12, height: 12)
                                .shadow(color: .orange, radius: 5)
                            Text("残り香")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.4))
                        }
                        
                        VStack(spacing: 0) {
                            Text("\(Int(history.duration))")
                                .font(.title)
                                .foregroundColor(.white.opacity(0.7))
                            Text("秒")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.4))
                        }
                        
                        VStack(spacing: 0) {
                            Text("\(history.messageCount)")
                                .font(.title)
                                .foregroundColor(.white.opacity(0.7))
                            Text("言葉")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.4))
                        }
                    }
                    .padding(.horizontal, 40)
                    .padding(.vertical, 24)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(16)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                    .scaleEffect(detailsScale)
                    .opacity(detailsOpacity)
                }
                
                SizedBox(height: 32)
                
                Text("この瞬間は、もう二度と戻らない")
                    .font(.caption)
                    .tracking(2)
                    .foregroundColor(.white.opacity(0.3))
                    .opacity(detailsOpacity)
                
                Spacer()
                
                Button(action: {
                    appState.backToTop()
                }) {
                    HStack {
                        Image(systemName: "house")
                        Text("また火を灯す")
                            .tracking(2)
                    }
                    .foregroundColor(.white.opacity(0.7))
                    .padding(.horizontal, 32)
                    .padding(.vertical, 16)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(30)
                    .overlay(
                        RoundedRectangle(cornerRadius: 30)
                            .stroke(Color.white.opacity(0.1), lineWidth: 1)
                    )
                }
                .padding(.bottom, 60)
                .opacity(buttonOpacity)
                .offset(y: buttonOffset)
            }
        }
        .onAppear {
            startAnimations()
        }
    }
    
    private func startAnimations() {
        // 1. Generate Smoke
        for i in 0..<8 {
            let delay = Double(i) * 0.2
            let particle = SmokeParticle(id: i, delay: delay)
            smokeParticles.append(particle)
        }
        
        // 2. Scent Fade
        withAnimation(.easeOut(duration: 2.0)) {
            scentScale = 0.8
            scentOpacity = 0.6
        }
        
        // 3. Text Appear
        withAnimation(.easeOut(duration: 1.0).delay(1.0)) {
            textOpacity = 1.0
            textOffset = 0
        }
        
        // 4. Details Appear
        withAnimation(.spring(response: 0.6, dampingFraction: 0.7).delay(1.5)) {
            detailsOpacity = 1.0
            detailsScale = 1.0
        }
        
        // 5. Button Appear
        withAnimation(.easeOut(duration: 1.0).delay(2.5)) {
            buttonOpacity = 1.0
            buttonOffset = 0
        }
    }
}

// MARK: - Helper Views & Models

struct SizedBox: View {
    let height: CGFloat
    var body: some View {
        Color.clear.frame(height: height)
    }
}

struct StarProperties {
    let x: Double
    let y: Double
    
    static func random() -> StarProperties {
        StarProperties(x: Double.random(in: 0...1), y: Double.random(in: 0...1))
    }
}

struct SmokeParticle: Identifiable {
    let id: Int
    let delay: Double
}

struct SmokeView: View {
    let particle: SmokeParticle
    @State private var offset: CGFloat = 0
    @State private var xOffset: CGFloat = 0
    @State private var opacity: Double = 0.5
    @State private var scale: CGFloat = 0.5
    
    var body: some View {
        Circle()
            .fill(RadialGradient(
                gradient: Gradient(colors: [Color.white.opacity(0.3), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 30
            ))
            .frame(width: 60, height: 60)
            .scaleEffect(scale)
            .opacity(opacity)
            .offset(x: xOffset, y: offset)
            .onAppear {
                withAnimation(.easeOut(duration: 3.0).delay(particle.delay)) {
                    offset = -150
                    xOffset = CGFloat.random(in: -30...30)
                    opacity = 0
                    scale = 2.0
                }
            }
    }
}
