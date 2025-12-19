import SwiftUI

struct TopView: View {
    @ObservedObject var viewModel: AppViewModel
    
    var body: some View {
        VStack(spacing: 40) {
            Text("FIZZ")
                .font(.largeTitle)
                .fontWeight(.thin)
                .foregroundColor(.orange)
            
            Spacer()
            
            // Genre Selection
            HStack {
                ForEach(Genre.allCases) { genre in
                    Button(action: { viewModel.selectedGenre = genre }) {
                        Text(genre.rawValue)
                            .padding()
                            .background(viewModel.selectedGenre == genre ? Color.orange.opacity(0.3) : Color.gray.opacity(0.1))
                            .cornerRadius(8)
                    }
                }
            }
            
            // Start Button
            Button(action: {
                withAnimation {
                    viewModel.startMatching()
                }
            }) {
                Circle()
                    .fill(
                        RadialGradient(gradient: Gradient(colors: [.yellow, .orange, .red]), center: .center, startRadius: 5, endRadius: 50)
                    )
                    .frame(width: 80, height: 80)
                    .overlay(Text("点火").foregroundColor(.white))
                    .shadow(color: .orange, radius: 10, x: 0, y: 0)
            }
            
            Spacer()
            
            // Menu (Simple implementation)
            HStack {
                Button("Deck") {}
                Spacer()
                Button("History") {}
                Spacer()
                Button("Settings") {}
            }
            .padding()
        }
        .padding()
    }
}
