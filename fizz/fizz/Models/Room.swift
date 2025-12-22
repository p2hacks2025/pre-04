import Foundation
import FirebaseFirestore

struct Room: Identifiable, Codable {
    @DocumentID var id: String?
    let userIds: [String]
    let createdAt: Date
}
