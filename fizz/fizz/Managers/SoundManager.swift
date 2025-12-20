//
//  SoundManager.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/20.
//

import AVFoundation
import SwiftUI

class SoundManager: ObservableObject {
    static let shared = SoundManager()
    
    private var bgmPlayer: AVAudioPlayer?
    private var sfxPlayers: [String: AVAudioPlayer] = [:]
    
    // Looping Sound Players
    private var fireflowerLoopPlayer: AVAudioPlayer?
    
    private init() {
        // Preload sounds if necessary
    }
    
    // MARK: - BGM
    
    func playBGM() {
        guard let url = Bundle.main.url(forResource: "White_snow_chill_days", withExtension: "mp3") else {
            print("❌ BGM File not found")
            return
        }
        
        do {
            if bgmPlayer == nil {
                bgmPlayer = try AVAudioPlayer(contentsOf: url)
                bgmPlayer?.numberOfLoops = -1 // Infinite loop
                bgmPlayer?.volume = 0.3
            }
            if bgmPlayer?.isPlaying == false {
                bgmPlayer?.play()
            }
        } catch {
            print("❌ Error loading BGM: \(error)")
        }
    }
    
    func stopBGM() {
        bgmPlayer?.stop()
    }
    
    // MARK: - SFX
    
    func playCursor() {
        playSound(filename: "cursol", type: "mp3", volume: 0.5)
    }
    
    func playFireUp() {
        playSound(filename: "fireup", type: "mp3", volume: 0.8)
    }
    
    private func playSound(filename: String, type: String, volume: Float) {
        if let url = Bundle.main.url(forResource: filename, withExtension: type) {
            do {
                let player = try AVAudioPlayer(contentsOf: url)
                player.volume = volume
                player.play()
                // Store player strongly so it finishes playing
                sfxPlayers[filename] = player 
            } catch {
                print("❌ Error playing sound \(filename): \(error)")
            }
        } else {
            print("❌ Sound file \(filename) not found")
        }
    }
    
    // MARK: - Looping SFX (Fireflower)
    
    func startFireFlowerLoop() {
        guard let url = Bundle.main.url(forResource: "fireflower", withExtension: "mp3") else { return }
        
        do {
            if fireflowerLoopPlayer == nil {
                fireflowerLoopPlayer = try AVAudioPlayer(contentsOf: url)
                fireflowerLoopPlayer?.numberOfLoops = -1
                fireflowerLoopPlayer?.volume = 0.6
            }
            if fireflowerLoopPlayer?.isPlaying == false {
                fireflowerLoopPlayer?.play()
            }
        } catch {
            print("❌ Error loading fireflower loop: \(error)")
        }
    }
    
    func stopFireFlowerLoop() {
        fireflowerLoopPlayer?.stop()
        fireflowerLoopPlayer = nil
    }
}
