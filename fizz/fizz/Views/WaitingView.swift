import SwiftUI

struct WaitingView: View {
    var body: some View {
        VStack {
            Text("Looking for someone...")
                .foregroundColor(.gray)
            // Placeholder for single sparkler animation
            Circle()
                .trim(from: 0, to: 0.7)
                .stroke(Color.orange, lineWidth: 2)
                .frame(width: 50, height: 50)
                .rotationEffect(.degrees(360))
                .animation(Animation.linear(duration: 2).repeatForever(autoreverses: false), value: true)
        }
    }
}
