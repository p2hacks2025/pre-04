import SwiftUI

struct ResultView: View {
    @ObservedObject var appVM: AppViewModel
    
    var body: some View {
        VStack {
            Text("Finished")
                .font(.title)
                .foregroundColor(.white)
            
            Button("Back to Top") {
                withAnimation {
                    appVM.backToTop()
                }
            }
            .padding()
            .background(Color.white.opacity(0.2))
            .cornerRadius(10)
        }
    }
}
