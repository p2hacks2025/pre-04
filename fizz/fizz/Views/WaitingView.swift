//
//  WaitingView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct WaitingView: View {
    @Environment(AppState.self) private var appState
    @State private var pulseScale: CGFloat = 1.0
    @State private var pulseOpacity: Double = 0.5
    
    var body: some View {
        VStack {
            Spacer()
            
            ZStack {
                // Pulse Circles
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    .frame(width: 200, height: 200)
                    .scaleEffect(pulseScale)
                    .opacity(pulseOpacity)
                
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    .frame(width: 150, height: 150)
                    .scaleEffect(pulseScale)
                    .opacity(pulseOpacity)
                    .animation(.easeInOut(duration: 2).repeatForever(autoreverses: false).delay(0.5), value: pulseScale)

                // Center Icon/Text
                VStack(spacing: 16) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                    
                    Text("マッチング中...")
                        .font(.title2)
                        .foregroundColor(.white)
                    
                    if let genre = appState.selectedGenre {
                        Text(genre.displayName)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 4)
                            .background(Color.white.opacity(0.1))
                            .cornerRadius(8)
                            .foregroundColor(.white.opacity(0.8))
                    }
                }
            }
            .onAppear {
                withAnimation(.easeInOut(duration: 2).repeatForever(autoreverses: false)) {
                    pulseScale = 1.5
                    pulseOpacity = 0.0
                }
                
                // Simulate matching delay
                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                    appState.matched()
                }
            }
            
            Spacer()
            
            Button("キャンセル") {
                appState.backToTop()
            }
            .foregroundColor(.white.opacity(0.6))
            .padding(.bottom, 50)
        }
    }
}
