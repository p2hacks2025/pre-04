//
//  HistoryView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/20.
//

import SwiftUI

struct HistoryView: View {
    @Environment(AppState.self) private var appState
    
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
            
            VStack(spacing: 0) {
                // Header
                HStack {
                    Button(action: {
                        appState.navigateBack()
                    }) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 20))
                            .foregroundColor(.white.opacity(0.7))
                            .padding(10)
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                    }
                    
                    Text("履歴")
                        .font(.title3)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                }
                .padding()
                .background(Color(hex: "0a1428").opacity(0.8))
                
                // Content
                ScrollView {
                    if appState.chatHistories.isEmpty {
                        VStack(spacing: 20) {
                            Image(systemName: "message.circle")
                                .font(.system(size: 40))
                                .foregroundColor(.white.opacity(0.2))
                                .frame(width: 80, height: 80)
                                .background(Color.white.opacity(0.05))
                                .clipShape(Circle())
                            
                            Text("まだ履歴がありません")
                                .foregroundColor(.white.opacity(0.4))
                            
                            Text("会話を始めると\nここに記録されます")
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.3))
                                .multilineTextAlignment(.center)
                        }
                        .padding(.top, 60)
                    } else {
                        VStack(spacing: 12) {
                            ForEach(appState.chatHistories) { history in
                                historyRow(history: history)
                            }
                        }
                        .padding()
                    }
                }
            }
        }
    }
    
    private func historyRow(history: ChatHistory) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(formatDate(history.date) + " " + formatTime(history.date))
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.7))
                    
                    Text(history.genre.displayName)
                        .font(.caption2)
                        .fontWeight(.bold)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(genreColor(history.genre).opacity(0.2))
                        .foregroundColor(genreColor(history.genre))
                        .cornerRadius(6)
                }
                Spacer()
            }
            
            HStack(spacing: 20) {
                HStack(spacing: 6) {
                    Image(systemName: "clock")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.4))
                    Text("\(Int(history.duration))秒")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                }
                
                HStack(spacing: 6) {
                    Image(systemName: "message")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.4))
                    Text("\(history.messageCount)件")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                }
            }
        }
        .padding()
        .background(Color.white.opacity(0.05))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
    
    private func genreColor(_ genre: Genre) -> Color {
        switch genre {
        case .hobby: return Color(hex: "FF6B9D")
        case .casual: return Color(hex: "4ECDC4")
        case .complaint: return Color(hex: "95E1D3")
        case .life: return Color(hex: "F38181")
        case .work: return Color(hex: "FFA07A")
        case .random: return Color(hex: "DDA15E")
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy.MM.dd"
        return formatter.string(from: date)
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}
