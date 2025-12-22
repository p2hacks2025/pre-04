//
//  MatchManager.swift
//  fizz
//
//  Created by technolo-gia on 2025/12/21.
//

import Foundation
import FirebaseFirestore
import Combine

class MatchManager: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isMatching = false
    @Published var matchFound = false
    @Published var currentRoomId: String?
    
    private var db = Firestore.firestore()
    private var listenerRegistration: ListenerRegistration?
    private var roomListenerRegistration: ListenerRegistration?
    
    var userId: String {
        let id = UserDefaults.standard.string(forKey: "userId") ?? UUID().uuidString
        UserDefaults.standard.set(id, forKey: "userId")
        return id
    }
    
    // MARK: - Matching
    
    func startMatching() {
        isMatching = true
        matchFound = false
        messages = []
        
        findMatchRecursively()
    }
    
    private func findMatchRecursively() {
        guard isMatching else { return }
        
        let waitingRef = db.collection("waiting_queue")
        
        // 1. Query for a potential partner
        waitingRef.whereField(FieldPath.documentID(), isNotEqualTo: userId).limit(to: 1).getDocuments { snapshot, error in
            if let error = error {
                print("Error querying waiting queue: \(error)")
                // If query fails, just add self to queue as fallback? Or retry?
                self.addToQueue()
                return
            }
            
            guard let documents = snapshot?.documents, let partnerDoc = documents.first else {
                // No one waiting, add self
                self.addToQueue()
                return
            }
            
            // 2. Try to claim partner in transaction
            self.attemptClaim(partnerDoc: partnerDoc)
        }
    }
    
    private func attemptClaim(partnerDoc: QueryDocumentSnapshot) {
        db.runTransaction({ (transaction, errorPointer) -> Any? in
            let partnerRef = partnerDoc.reference
            let partnerSnapshot: DocumentSnapshot
            do {
                partnerSnapshot = try transaction.getDocument(partnerRef)
            } catch let fetchError as NSError {
                errorPointer?.pointee = fetchError
                return nil
            }
            
            if !partnerSnapshot.exists {
                return nil // Already taken
            }
            
            // Match Logic
            let partnerId = partnerDoc.documentID
            let roomUserIds = [self.userId, partnerId].sorted()
            let roomId = roomUserIds.joined(separator: "_")
            
            // Create Room
            let roomRef = self.db.collection("rooms").document(roomId)
            let roomData: [String: Any] = [
                "userIds": roomUserIds,
                "createdAt": FieldValue.serverTimestamp()
            ]
            transaction.setData(roomData, forDocument: roomRef)
            
            // Delete partner from waiting
            transaction.deleteDocument(partnerRef)
            
            return roomId
        }) { (object, error) in
            if let error = error {
                print("Transaction failed: \(error) - Retrying...")
                // Retry
                self.findMatchRecursively()
            } else if let roomId = object as? String {
                // Success
                print("Match found! Room: \(roomId)")
                self.currentRoomId = roomId
                self.matchFound = true
                self.isMatching = false
                self.listenToRoom(roomId: roomId)
            } else {
                // Transaction returned nil (Partner taken), retry
                print("Partner taken, retrying...")
                self.findMatchRecursively()
            }
        }
    }
    
    private func addToQueue() {
        let myRef = db.collection("waiting_queue").document(userId)
        myRef.setData(["createdAt": FieldValue.serverTimestamp()]) { error in
            if let error = error {
                print("Error adding to queue: \(error)")
                self.isMatching = false
            } else {
                print("Added to queue. Waiting for match...")
                self.listenForMatch()
            }
        }
    }
    
    private func listenForMatch() {
        guard roomListenerRegistration == nil else { return }
        
        // Watch for a room where userIds contains me
        roomListenerRegistration = db.collection("rooms")
            .whereField("userIds", arrayContains: userId)
            .addSnapshotListener { snapshot, error in
                guard let snapshot = snapshot else { return }
                
                for diff in snapshot.documentChanges {
                    if diff.type == .added {
                        let roomId = diff.document.documentID
                        print("Match found (listener)! Room: \(roomId)")
                        self.currentRoomId = roomId
                        self.matchFound = true
                        self.isMatching = false
                        self.roomListenerRegistration?.remove()
                        self.roomListenerRegistration = nil
                        self.listenToRoom(roomId: roomId)
                        return
                    }
                }
            }
    }

    
    func cancelMatching() {
        isMatching = false
        roomListenerRegistration?.remove()
        // Remove self from queue
        db.collection("waiting_queue").document(userId).delete()
    }
    
    // MARK: - Chat
    
    private func listenToRoom(roomId: String) {
        let query = db.collection("rooms").document(roomId).collection("messages")
            .order(by: "timestamp", descending: false)
        
        listenerRegistration = query.addSnapshotListener { snapshot, error in
            guard let documents = snapshot?.documents else {
                print("Error fetching messages: \(error!)")
                return
            }
            
            self.messages = documents.compactMap { doc -> Message? in
                try? doc.data(as: Message.self)
            }
            // Keep only last 6 in memory/UI if desired, but for now specific logic in VM
        }
    }
    
    func sendMessage(_ text: String) {
        guard let roomId = currentRoomId else { return }
        
        let message = Message(
            id: nil, // Firestore auto ID
            senderId: userId,
            content: text,
            timestamp: Date()
        )
        
        do {
            try db.collection("rooms").document(roomId).collection("messages").addDocument(from: message)
        } catch {
            print("Error sending message: \(error)")
        }
    }
    
    func stopListening() {
        listenerRegistration?.remove()
        roomListenerRegistration?.remove()
        messages = []
        currentRoomId = nil
    }
}
