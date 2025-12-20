//
//  AppTypes.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/19.
//

import Foundation

enum Screen {
    case top
    case waiting
    case chat
    case end
    case deck
    case history
    case settings
}

enum Genre: String, CaseIterable, Identifiable, Codable {
    case hobby
    case casual
    case complaint
    case life
    case work
    case random
    
    var id: String { rawValue }
    
    var displayName: String {
        switch self {
        case .hobby: return "趣味"
        case .casual: return "雑談"
        case .complaint: return "愚痴"
        case .life: return "人生"
        case .work: return "仕事"
        case .random: return "ランダム"
        }
    }
}

struct DeckItem: Identifiable, Codable {
    var id: String
    var text: String
}

struct Deck: Identifiable, Codable {
    var id: String
    var name: String
    var items: [DeckItem]
}

struct ChatHistory: Identifiable, Codable {
    var id: String
    var date: Date
    var genre: Genre
    var duration: TimeInterval
    var messageCount: Int
}
