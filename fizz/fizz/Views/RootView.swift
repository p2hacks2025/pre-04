import SwiftUI

struct RootView: View {
    @StateObject private var appVM = AppViewModel()
    
    var body: some View {
        ZStack {
            // Global Background
            Color.black.ignoresSafeArea()
            
            switch appVM.currentState {
            case .top:
                TopView(viewModel: appVM)
            case .waiting:
                WaitingView()
            case .chat:
                ChatView(appVM: appVM)
            case .result:
                ResultView(appVM: appVM)
            }
        }
        .environmentObject(appVM)
        .preferredColorScheme(.dark)
    }
}
