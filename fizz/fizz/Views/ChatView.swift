import SwiftUI

struct ChatView: View {
    @ObservedObject var appVM: AppViewModel
    @StateObject private var chatVM = ChatViewModel()
    
    // For deck selector visibility
    @State private var isDeckExpanded: Bool = true
    
    var body: some View {
        ZStack {
            // Background Layer (Night sky maybe?)
            Color.black.ignoresSafeArea()
            
            // 1. Messages Layer (Ephemeral)
            VStack {
                Spacer()
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 8) {
                            ForEach(chatVM.messages) { msg in
                                MessageRow(message: msg)
                                    .transition(.opacity)
                            }
                        }
                    }
                    .onChange(of: chatVM.messages) { _ in
                        if let lastConfig = chatVM.messages.last {
                            withAnimation {
                                proxy.scrollTo(lastConfig.id, anchor: .bottom)
                            }
                        }
                    }
                }
                .mask(LinearGradient(gradient: Gradient(colors: [.clear, .black, .black, .clear]), startPoint: .top, endPoint: .bottom))
                .frame(height: 300) // Limited height for "floating" feel
                
                Spacer() 
            }
            .padding(.bottom, 200) // Make room for sparklers
            
            // 2. Sparklers Layer (Bottom)
            VStack {
                Spacer()
                HStack {
                    // My Sparkler (Left)
                    SparklerView(state: chatVM.mySparkler, isMine: true)
                        .frame(width: 150, height: 300)
                        .onTapGesture {
                            chatVM.sparkAction()
                        }
                    
                    Spacer()
                    
                    // Partner (Right)
                    SparklerView(state: chatVM.partnerSparkler, isMine: false)
                        .frame(width: 150, height: 300)
                        .allowsHitTesting(false) // Can't touch partner's
                }
                .padding(.horizontal)
            }
            
            // 3. Deck Selector (Floating above keyboard area)
            VStack {
                Spacer()
                if isDeckExpanded {
                    DeckSelectorView(
                        decks: chatVM.availableDecks,
                        selectedDeck: $chatVM.selectedDeck,
                        onSend: { text in
                            chatVM.sendMessage(text)
                        }
                    )
                    .background(Color.black.opacity(0.8))
                    .cornerRadius(12, corners: [.topLeft, .topRight])
                    .transition(.move(edge: .bottom))
                }
            }
            .ignoresSafeArea(.keyboard) 
        }
        .onAppear {
            chatVM.onFinish = {
                withAnimation {
                    appVM.endChat()
                }
            }
        }
    }
}

// Subview: Single Message Row
struct MessageRow: View {
    let message: Message
    @State private var opacity: Double = 1.0
    
    var body: some View {
        Text(message.content)
            .font(.system(size: 18, weight: .medium, design: .serif))
            .foregroundColor(.white)
            .padding(.horizontal)
            .padding(.vertical, 4)
            .shadow(color: .orange.opacity(0.5), radius: 4, x: 0, y: 0)
            .opacity(opacity)
            .onAppear {
                // Determine ephemeral fade out logic here if not handled by removal
                // Requirement: "Latest 2-3 only".
                // We rely on List removal or we can fade out old ones visually too.
                // Let's rely on list presence, but add an animation-in.
            }
    }
}

// Subview: Deck Selector
struct DeckSelectorView: View {
    let decks: [ConversationDeck]
    @Binding var selectedDeck: ConversationDeck?
    let onSend: (String) -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            // Deck Tabs
            ScrollView(.horizontal, showsIndicators: false) {
                HStack {
                    ForEach(decks) { deck in
                        Text(deck.name)
                            .font(.caption)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(selectedDeck?.id == deck.id ? Color.orange : Color.gray.opacity(0.3))
                            .cornerRadius(15)
                            .foregroundColor(.white)
                            .onTapGesture {
                                selectedDeck = deck
                            }
                    }
                }
                .padding()
            }
            
            Divider().background(Color.gray.opacity(0.5))
            
            // Phrases
            if let deck = selectedDeck {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(deck.messages, id: \.self) { phrase in
                            Button(action: {
                                onSend(phrase)
                            }) {
                                Text(phrase)
                                    .font(.system(size: 16))
                                    .fontWeight(.semibold)
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(VisualEffectBlur(blurStyle: .systemThinMaterialDark))
                                    .cornerRadius(8)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(Color.white.opacity(0.2), lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding()
                }
                .frame(height: 80)
            }
        }
        .padding(.bottom, 20) // Base padding
    }
}

// Extension for partial corner radius
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape( RoundedCorner(radius: radius, corners: corners) )
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(roundedRect: rect, byRoundingCorners: corners, cornerRadii: CGSize(width: radius, height: radius))
        return Path(path.cgPath)
    }
}

// Blur View helper
struct VisualEffectBlur: UIViewRepresentable {
    var blurStyle: UIBlurEffect.Style
    func makeUIView(context: Context) -> UIVisualEffectView {
        return UIVisualEffectView(effect: UIBlurEffect(style: blurStyle))
    }
    func updateUIView(_ uiView: UIVisualEffectView, context: Context) {
        uiView.effect = UIBlurEffect(style: blurStyle)
    }
}
