import Foundation

enum Genre: String, CaseIterable, Identifiable {
    case chat = "雑談"
    case hobby = "趣味"
    case complain = "愚痴"
    
    var id: String { self.rawValue }
}
