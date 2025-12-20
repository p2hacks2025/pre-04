//
//  SettingsView.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/20.
//

import SwiftUI

struct SettingsView: View {
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
                    
                    Text("設定")
                        .font(.title3)
                        .foregroundColor(.white.opacity(0.8))
                    
                    Spacer()
                }
                .padding()
                .background(Color(hex: "0a1428").opacity(0.8))
                
                // Content
                ScrollView {
                    VStack(spacing: 20) {
                        
                        // Sound Settings
                        settingRow(
                            icon: "speaker.wave.2",
                            title: "サウンド",
                            subtitle: "効果音を再生",
                            isOn: Bindable(appState).isSoundEnabled
                        )
                        
                        // Vibration Settings
                        settingRow(
                            icon: "iphone.radiowaves.left.and.right",
                            title: "バイブレーション",
                            subtitle: "振動フィードバック",
                            isOn: Bindable(appState).isVibrationEnabled
                        )
                        
                        // App Info
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(alignment: .top, spacing: 12) {
                                Image(systemName: "info.circle")
                                    .foregroundColor(.white.opacity(0.7))
                                    .padding(.top, 2)
                                
                                VStack(alignment: .leading, spacing: 8) {
                                    Text("FIZZについて")
                                        .font(.headline)
                                        .foregroundColor(.white.opacity(0.8))
                                    
                                    Text("線香花火のように短く儚い、\n匿名の会話を楽しむアプリです。")
                                        .font(.caption)
                                        .foregroundColor(.white.opacity(0.5))
                                        .fixedSize(horizontal: false, vertical: true)
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("バージョン: 1.0.0")
                                        Text("© 2024 FIZZ")
                                    }
                                    .font(.caption2)
                                    .foregroundColor(.white.opacity(0.4))
                                }
                            }
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                        
                        // Caution
                        VStack(alignment: .leading, spacing: 8) {
                            Text("ご利用上の注意")
                                .font(.caption)
                                .foregroundColor(Color(hex: "fcd34d"))
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("• 会話は記録されません")
                                Text("• 個人情報は共有しないでください")
                                Text("• 他者への思いやりを忘れずに")
                            }
                            .font(.caption2)
                            .foregroundColor(Color(hex: "fcd34d").opacity(0.6))
                        }
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: "f59e0b").opacity(0.1))
                        .cornerRadius(16)
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color(hex: "f59e0b").opacity(0.2), lineWidth: 1)
                        )
                    }
                    .padding()
                }
            }
        }
    }
    
    private func settingRow(icon: String, title: String, subtitle: String, isOn: Binding<Bool>) -> some View {
        HStack {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .foregroundColor(isOn.wrappedValue ? .white.opacity(0.7) : .white.opacity(0.4))
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.body)
                        .foregroundColor(.white.opacity(0.8))
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.4))
                }
            }
            
            Spacer()
            
            Toggle("", isOn: isOn)
                .labelsHidden()
                .tint(.orange)
        }
        .padding()
        .background(Color.white.opacity(0.05))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.1), lineWidth: 1)
        )
    }
}
