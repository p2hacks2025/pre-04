//
//  SparklesView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct Sparkle: Identifiable {
    let id = UUID()
    var x: CGFloat
    var y: CGFloat
    var scale: CGFloat
    var duration: Double
    var delay: Double
}

struct SparklesView: View {
    let count: Int
    @State private var sparkles: [Sparkle] = []

    init(count: Int = 50) {
        self.count = count
    }

    var body: some View {
        GeometryReader { geometry in
            ZStack {
                ForEach(sparkles) { sparkle in
                    Circle()
                        .fill(Color.white)
                        .frame(width: 2, height: 2)
                        .scaleEffect(sparkle.scale)
                        .position(x: sparkle.x * geometry.size.width, y: sparkle.y * geometry.size.height)
                        .opacity(Double.random(in: 0.3...0.8))
                        .animation(
                            Animation.easeInOut(duration: sparkle.duration)
                                .repeatForever(autoreverses: true)
                                .delay(sparkle.delay),
                            value: sparkle.scale
                        )
                        .onAppear {
                            // Trigger animation by changing a state if needed, 
                            // but here the initial state set in init/onAppear is static unless we vary it.
                            // To make them "twinkle", we should animate opacity or scale.
                        }
                }
            }
            .onAppear {
                createSparkles()
            }
        }
        .allowsHitTesting(false)
    }

    private func createSparkles() {
        var newSparkles: [Sparkle] = []
        for _ in 0..<count {
            newSparkles.append(
                Sparkle(
                    x: CGFloat.random(in: 0...1),
                    y: CGFloat.random(in: 0...1),
                    scale: CGFloat.random(in: 0.5...1.5),
                    duration: Double.random(in: 2...5),
                    delay: Double.random(in: 0...3)
                )
            )
        }
        sparkles = newSparkles
    }
}

// A reusable background modifier to apply the gradient and sparkles
struct SparklerBackground: ViewModifier {
    func body(content: Content) -> some View {
        ZStack {
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
            
            SparklesView(count: 80)
            
            content
        }
    }
}

extension View {
    func sparklerBackground() -> some View {
        self.modifier(SparklerBackground())
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
