//
//  EndView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct EndView: View {
    @Environment(AppState.self) private var appState
    @State private var opacity = 0.0

    var body: some View {
        VStack(spacing: 30) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 60))
                .foregroundColor(.white.opacity(0.8))
            
            Text("会話が終了しました")
                .font(.title2)
                .foregroundColor(.white)
            
            Text("また新しい火を灯しましょう")
                .font(.body)
                .foregroundColor(.white.opacity(0.6))
            
            Button(action: {
                appState.backToTop()
            }) {
                Text("トップに戻る")
                    .fontWeight(.bold)
                    .padding(.horizontal, 40)
                    .padding(.vertical, 16)
                    .background(Color.white.opacity(0.1))
                    .foregroundColor(.white)
                    .cornerRadius(30)
                    .overlay(
                        RoundedRectangle(cornerRadius: 30)
                            .stroke(Color.white.opacity(0.2), lineWidth: 1)
                    )
            }
            .padding(.top, 20)
        }
        .opacity(opacity)
        .onAppear {
            withAnimation(.easeIn(duration: 1.0)) {
                opacity = 1.0
            }
        }
    }
}
