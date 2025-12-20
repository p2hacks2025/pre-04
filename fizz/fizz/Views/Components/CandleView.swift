//
//  CandleView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/20.
//

import SwiftUI

struct CandleView: View {
    var isLit: Bool
    
    // Flame Animation State
    @State private var flameOscillation: CGFloat = 0.0 // Main sway
    @State private var flameScaleY: CGFloat = 1.0 // Height flicker
    @State private var flameScaleX: CGFloat = 1.0 // Width breathing
    @State private var coreWhiteOpacity: Double = 0.5
    
    // Wind/Draft Simulation
    @State private var windStrength: CGFloat = 0.0
    
    var body: some View {
        ZStack {
            // Candle Body
            RoundedRectangle(cornerRadius: 10)
                .fill(
                    LinearGradient(
                        gradient: Gradient(colors: [
                            Color.yellow.opacity(0.2),
                            Color.orange.opacity(0.3)
                        ]),
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .frame(width: 80, height: 112)
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
                .fill(Color(hex: "2d2d2d")) // Dark charcoal
                .frame(width: 3, height: 14)
                .offset(y: -56 - 6) // Half height (56) + half wick (7)
            
            // Flame
            if isLit {
                ZStack {
                    // 1. Outer Glow (Large, diffuse)
                    Circle()
                        .fill(Color.orange.opacity(0.3))
                        .frame(width: 60, height: 60)
                        .scaleEffect(x: flameScaleX * 1.1, y: flameScaleY * 1.1)
                        .blur(radius: 10)
                        .offset(y: -10)
                    
                    // 2. Main Flame Body (Teardrop)
                    FlameShape()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color(hex: "ff9d00"), // Orange-Gold tip
                                    Color(hex: "ffca28")  // Yellow body
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .frame(width: 24, height: 40)
                        .mask(FlameShape().frame(width: 24, height: 40)) // Clip nicely
                        .scaleEffect(x: flameScaleX, y: flameScaleY, anchor: .bottom)
                        .rotationEffect(.degrees(Double(flameOscillation * 5)), anchor: .bottom)
                    
                    // 3. Inner Core (Blue base)
                    FlameShape()
                        .fill(
                            LinearGradient(
                                gradient: Gradient(stops: [
                                    .init(color: .clear, location: 0.0),
                                    .init(color: Color(hex: "1e88e5").opacity(0.6), location: 0.8), // Blue base
                                    .init(color: Color(hex: "0d47a1").opacity(0.8), location: 1.0)  // Dark blue root
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                        .frame(width: 16, height: 30)
                        .scaleEffect(x: flameScaleX * 0.8, y: flameScaleY * 0.9, anchor: .bottom)
                        .offset(y: 4) // Sit at bottom
                        .blendMode(.screen)
                    
                    // 4. White Hot Center (Flickering brightness)
                    Circle()
                        .fill(Color.white.opacity(coreWhiteOpacity))
                        .frame(width: 6, height: 8)
                        .blur(radius: 2)
                        .offset(y: 10)
                }
                .offset(y: -56 - 12 - 16) // Top of wick - extra upward shift for flame base
                .onAppear {
                    startRealFlameAnimation()
                }
            }
        }
    }
    
    private func startRealFlameAnimation() {
        // 1. Height Flicker (Rapid)
        withAnimation(.easeInOut(duration: 0.1).repeatForever(autoreverses: true)) {
            flameScaleY = 1.05
        }
        
        // 2. Width Breathing (Slower)
        withAnimation(.easeInOut(duration: 0.6).repeatForever(autoreverses: true)) {
            flameScaleX = 0.95
        }
        
        // 3. Core Opacity Pulse
        withAnimation(.linear(duration: 0.08).repeatForever(autoreverses: true)) {
            coreWhiteOpacity = 0.8
        }
        
        // 4. Random Breeze (Physics simulation loop)
        runWindSimulation()
    }
    
    private func runWindSimulation() {
        // Randomly change wind target
        let targetWind = CGFloat.random(in: -1...1)
        
        withAnimation(.spring(response: 0.5, dampingFraction: 0.4, blendDuration: 0.5)) {
            flameOscillation = targetWind
        }
        
        // Recurse with random delay
        DispatchQueue.main.asyncAfter(deadline: .now() + Double.random(in: 0.2...1.5)) {
            runWindSimulation()
        }
    }
}

// MARK: - Shapes

struct FlameShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        let width = rect.width
        let height = rect.height
        
        // Start at bottom center
        path.move(to: CGPoint(x: width * 0.5, y: height))
        
        // Curve to bottom left bulge
        path.addCurve(
            to: CGPoint(x: 0, y: height * 0.65),
            control1: CGPoint(x: width * 0.5, y: height),
            control2: CGPoint(x: 0, y: height * 0.85)
        )
        
        // Curve to top tip
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: 0),
            control1: CGPoint(x: 0, y: height * 0.3),
            control2: CGPoint(x: width * 0.5, y: height * 0.2)
        )
        
        // Curve down to bottom right bulge
        path.addCurve(
            to: CGPoint(x: width, y: height * 0.65),
            control1: CGPoint(x: width * 0.5, y: height * 0.2),
            control2: CGPoint(x: width, y: height * 0.3)
        )
        
        // Curve back to start
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: height),
            control1: CGPoint(x: width, y: height * 0.85),
            control2: CGPoint(x: width * 0.5, y: height)
        )
        
        path.closeSubpath()
        return path
    }
}

#Preview {
    ZStack {
        Color.black.ignoresSafeArea()
        CandleView(isLit: true)
    }
}
