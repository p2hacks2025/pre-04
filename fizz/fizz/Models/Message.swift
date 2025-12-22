import FirebaseFirestore

struct Message: Identifiable, Codable, Equatable {
    @DocumentID var id: String?
    let senderId: String
    let content: String
    let timestamp: Date
    
    // Logic for ephemeral visibility will be handled by comparing timestamp to current time
}

