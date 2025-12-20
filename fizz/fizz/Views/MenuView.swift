//
//  MenuView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import SwiftUI

struct MenuView: View {
    @Environment(AppState.self) private var appState
    
    // Slide animation state
    @State private var offset: CGFloat = -300 // Start off-screen (left)
    
    var body: some View {
        ZStack(alignment: .leading) {
            // Overlay background
            Color.black.opacity(appState.isMenuOpen ? 0.6 : 0)
                .ignoresSafeArea()
                .onTapGesture {
                    closeMenu()
                }
            // Block touches when menu is closed so it doesn't interfere with underlying views
            // But allows touches when open to dismiss
            // Actually, if opacity is 0, it might still capture touches?
            // SwiftUI Color is tappable.
            // We'll use allowsHitTesting logic?
            // If we use .opacity, verification: transparent views can receive touches.
            // We should use .allowsHitTesting(appState.isMenuOpen)
            
            // Drawer Content
            VStack(alignment: .leading, spacing: 0) {
                // Header
                HStack {
                    Text("FIZZ")
                        .font(.title2)
                        .fontWeight(.bold)
                        .tracking(2)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                    
                    Button(action: closeMenu) {
                        Image(systemName: "xmark")
                            .foregroundColor(.white.opacity(0.6))
                            .padding(8)
                            .background(Color.white.opacity(0.05))
                            .clipShape(Circle())
                    }
                }
                .padding(24)
                .padding(.top, 40) // Status bar spacing
                .border(width: 1, edges: [.bottom], color: .white.opacity(0.1))
                
                // Menu Items
                VStack(alignment: .leading, spacing: 0) {
                    MenuRow(icon: "greetingcard", text: "会話デッキ") {
                        appState.navigate(to: .deck)
                    }
                    
                    MenuRow(icon: "clock", text: "履歴") {
                        appState.navigate(to: .history)
                    }
                    
                    MenuRow(icon: "gearshape", text: "設定") {
                        appState.navigate(to: .settings)
                    }
                }
                .padding(.vertical, 20)
                
                Spacer()
                
                // Footer
                VStack {
                    Divider().background(Color.white.opacity(0.1))
                    Text("短時間で消える匿名トーク")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.3))
                        .padding(24)
                        .frame(maxWidth: .infinity)
                }
            }
            .frame(width: 280)
            .background(Color(hex: "0a1428"))
            .ignoresSafeArea()
            .offset(x: appState.isMenuOpen ? 0 : -280)
        }
        // Important: When menu is closed, we want touches to pass through the ZStack
        // to the underlying views (TopView etc).
        // Since MenuView is on top in ContentView ZStack.
        .allowsHitTesting(appState.isMenuOpen)
        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: appState.isMenuOpen)
    }
    
    private func closeMenu() {
        appState.closeMenu()
    }
}

struct MenuRow: View {
    var icon: String
    var text: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .resizable()
                    .scaledToFit()
                    .frame(width: 20, height: 20)
                    .foregroundColor(.white.opacity(0.6))
                    .padding(10)
                    .background(Color.white.opacity(0.05))
                    .clipShape(Circle())
                
                Text(text)
                    .foregroundColor(.white.opacity(0.8))
                    .font(.body)
                
                Spacer()
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 12)
            .contentShape(Rectangle()) // Make full row tappable
        }
    }
}

extension View {
    func border(width: CGFloat, edges: [Edge], color: Color) -> some View {
        overlay(EdgeBorder(width: width, edges: edges).foregroundColor(color))
    }
}

struct EdgeBorder: Shape {
    var width: CGFloat
    var edges: [Edge]

    func path(in rect: CGRect) -> Path {
        var path = Path()
        for edge in edges {
            var x: CGFloat {
                switch edge {
                case .top, .bottom, .leading: return rect.minX
                case .trailing: return rect.maxX - width
                }
            }

            var y: CGFloat {
                switch edge {
                case .top, .leading, .trailing: return rect.minY
                case .bottom: return rect.maxY - width
                }
            }

            var w: CGFloat {
                switch edge {
                case .top, .bottom: return rect.width
                case .leading, .trailing: return width
                }
            }

            var h: CGFloat {
                switch edge {
                case .top, .bottom: return width
                case .leading, .trailing: return rect.height
                }
            }
            path.addRect(CGRect(x: x, y: y, width: w, height: h))
        }
        return path
    }
}
