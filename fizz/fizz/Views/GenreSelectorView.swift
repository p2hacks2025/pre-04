//
//  GenreSelectorView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct GenreSelectorView: View {
    @Binding var isPresented: Bool
    @Environment(AppState.self) private var appState
    
    let columns = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    var body: some View {
        ZStack {
            Color(hex: "0a1428").ignoresSafeArea() // Background matching app theme
            
            VStack(spacing: 20) {
                Text("ジャンルを選択")
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .padding(.top)
                
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(Genre.allCases) { genre in
                        Button(action: {
                            appState.selectedGenre = genre
                            isPresented = false
                        }) {
                            VStack {
                                Text(genre.displayName)
                                    .font(.headline)
                                    .foregroundColor(appState.selectedGenre == genre ? .black : .white)
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 80)
                            .background(
                                appState.selectedGenre == genre ?
                                Color(hex: "fcd34d") : // amber-300
                                Color.white.opacity(0.1)
                            )
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(
                                        appState.selectedGenre == genre ? Color.clear : Color.white.opacity(0.2),
                                        lineWidth: 1
                                    )
                            )
                        }
                    }
                }
                .padding()
                
                if appState.selectedGenre != nil {
                    Button("選択解除") {
                        appState.selectedGenre = nil
                        isPresented = false
                    }
                    .foregroundColor(.white.opacity(0.5))
                    .padding(.top)
                }
                
                Spacer()
            }
        }
    }
}
