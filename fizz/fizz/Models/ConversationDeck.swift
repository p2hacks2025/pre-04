import Foundation

struct ConversationDeck: Identifiable {
    let id: UUID
    var name: String
    var messages: [String]
}
