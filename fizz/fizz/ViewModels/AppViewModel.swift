import SwiftUI
import Combine

class AppViewModel: ObservableObject {
    enum AppState {
        case top
        case waiting
        case chat
        case result
    }
    
    @Published var currentState: AppState = .top
    @Published var selectedGenre: Genre = .casual
    
    // Navigation Methods
    func startMatching() {
        currentState = .waiting
        // Simulate matching delay
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.currentState = .chat
        }
    }
    
    func endChat() {
        currentState = .result
    }
    
    func backToTop() {
        currentState = .top
    }
}
