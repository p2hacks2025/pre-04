import Foundation

struct Message: Identifiable, Equatable {
    let id: UUID = UUID()
    let senderId: String
    let content: String
    let timestamp: Date
    
    // Logic for ephemeral visibility will be handled by comparing timestamp to current time
}
