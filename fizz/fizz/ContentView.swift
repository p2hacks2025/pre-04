//
//  ContentView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct ContentView: View {
    @State private var appState = AppState()

    var body: some View {
        ZStack {
            Group {
                switch appState.currentScreen {
                case .top:
                    TopView()
                case .waiting:
                    WaitingView()
                case .chat:
                    ChatView()
                case .end:
                    EndView()
                case .deck:
                    DeckCreatorView()
                case .history:
                    HistoryView()
                case .settings:
                    SettingsView()
                }
            }
            .sparklerBackground()
            
            MenuView()
        }
        .environment(appState)
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
}
