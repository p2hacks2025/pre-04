import SwiftUI
import Combine

class ChatViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var mySparkler: SparklerState
    @Published var partnerSparkler: SparklerState
    
    // Deck for selection
    @Published var selectedDeck: ConversationDeck?
    @Published var availableDecks: [ConversationDeck] = [
        ConversationDeck(id: UUID(), name: "First Date", messages: ["Please tell me your hobby.", "What is your favorite food?", "Where are you from?", "Have a nice day!"]),
        ConversationDeck(id: UUID(), name: "Deep Talk", messages: ["What is love?", "Do you believe in fate?", "What is your dream?", "Are you happy?"])
    ]
    
    // Interaction State
    private var lastTapTime: Date = Date.distantPast
    private let tapCooldown: TimeInterval = 5.0
    
    // Timer
    private var timer: AnyCancellable?
    private let sessionStartTime: Date
    
    // Game Over Handler
    var onFinish: (() -> Void)?
    
    init() {
        self.mySparkler = SparklerState(maxDuration: 60, currentIntensity: 1.0)
        self.partnerSparkler = SparklerState(maxDuration: 60, currentIntensity: 1.0)
        self.sessionStartTime = Date()
        self.selectedDeck = availableDecks.first
        
        startTimer()
    }
    
    func startTimer() {
        timer = Timer.publish(every: 0.1, on: .main, in: .common).autoconnect()
            .sink { [weak self] _ in
                self?.gameLoop()
            }
    }
    
    private func gameLoop() {
        let deltaTime = 0.1
        
        // 1. Update Sparklers
        updateSparklerPhysics(state: &mySparkler, dt: deltaTime)
        updateSparklerPhysics(state: &partnerSparkler, dt: deltaTime) // Partner simulation
        
        // 2. Cleanup Messages
        cleanupOldMessages()
        
        // 3. Check End Condition
        if mySparkler.isExtinguished || partnerSparkler.isExtinguished {
            finishChat()
        }
    }
    
    private func updateSparklerPhysics(state: inout SparklerState, dt: TimeInterval) {
        // Decrease intensity naturally
        state.currentIntensity -= (SparklerState.burnRatePerSecond * 0.5 * dt)
        if state.currentIntensity < 0.1 { state.currentIntensity = 0.1 } // Minimum glow until handle runs out
        
        // Burn handle based on intensity
        // Higher intensity = faster burn
        let burnAmount = dt * (0.5 + state.currentIntensity)
        state.maxDuration -= burnAmount
        
        if state.maxDuration <= 0 {
            state.maxDuration = 0
            state.isExtinguished = true
        }
    }
    
    private func cleanupOldMessages() {
        let now = Date()
        // Keep only messages younger than 5 seconds visible
        // Or strictly keep last 3.
        // Logic: Filter messages that are "too old" or keep last 3.
        // Implementation: Just filter for rendering is done in View usually, 
        // but here we can remove them from memory if we want true ephemeral.
        
        // Remove extremely old messages (e.g. > 10s) to keep memory clean, 
        // View will handle the fading of recent ones.
        if messages.count > 10 {
            messages.removeFirst(messages.count - 10)
        }
    }
    
    func sendMessage(_ text: String) {
        let msg = Message(senderId: "me", content: text, timestamp: Date())
        messages.append(msg)
        
        // Boost intensity slightly on talking?
        sparkAction()
    }
    
    func sparkAction() {
        let now = Date()
        if now.timeIntervalSince(lastTapTime) < tapCooldown {
            return
        }
        lastTapTime = now
        
        // Recover intensity
        withAnimation {
            mySparkler.currentIntensity = min(1.0, mySparkler.currentIntensity + SparklerState.recoveryAmount)
            // Penalty: Recovering intensity consumes a bit of handle immediately? 
            // Or just allow it. Let's allow it as a mechanic to keep the fire alive but handle serves as absolute limit.
        }
    }
    
    func finishChat() {
        timer?.cancel()
        onFinish?()
    }
}
