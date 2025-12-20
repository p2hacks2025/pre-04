import SwiftUI

// MARK: - Particle System Models

struct SparklerParticle: Identifiable {
    let id = UUID()
    var position: CGPoint
    var velocity: CGPoint
    var life: Double // 1.0 (birth) -> 0.0 (death)
    var color: Color
    var scale: CGFloat
    let type: ParticleType
    
    enum ParticleType {
        case core   // The main burning ball
        case spark  // Flying sparks
        case branch // Split spark
    }
}

class SparklerSystem {
    var particles: [SparklerParticle] = []
    let center = CGPoint(x: 0, y: 0) // Relative origin
    
    // Time tracking internal to system to avoid View State updates
    var lastUpdate: Date = Date()
    var isFirstUpdate = true
    
    // Config
    private let gravity: CGFloat = 80.0
    private let airResistance: CGFloat = 0.95
    
    func update(now: Date, intensity: Double, tipPosition: CGPoint) {
        if isFirstUpdate {
            lastUpdate = now
            isFirstUpdate = false
            return
        }
        
        let deltaTime = now.timeIntervalSince(lastUpdate)
        lastUpdate = now
        
        // Cap large deltas (e.g. paused app)
        let dt = min(deltaTime, 0.1)
        
        // 1. Emit new particles
        emitParticles(deltaTime: dt, intensity: intensity, tipPosition: tipPosition)
        
        // 2. Update existing particles
        var survivingParticles: [SparklerParticle] = []
        
        for var particle in particles {
            // Physics
            particle.velocity.y += gravity * dt
            particle.velocity.x *= airResistance
            particle.velocity.y *= airResistance
            
            // Turbulence
            particle.velocity.x += CGFloat.random(in: -20...20) * dt
            
            // Move
            particle.position.x += particle.velocity.x * dt
            particle.position.y += particle.velocity.y * dt
            
            // Age
            let decayRate = (particle.type == .core) ? 0.0 : (1.0 + Double.random(in: 0...1.0))
            particle.life -= decayRate * dt
            
            // Branching logic (Pine needle effect)
            if particle.type == .spark && particle.life < 0.5 && Double.random(in: 0...1) < (0.1 * intensity) {
                // Split!
                let splitCount = Int.random(in: 2...3)
                for _ in 0..<splitCount {
                    let angle = Double.random(in: 0...(2 * .pi))
                    let speed = CGFloat.random(in: 10...30)
                    let velocity = CGPoint(
                        x: particle.velocity.x + CGFloat(cos(angle)) * speed,
                        y: particle.velocity.y + CGFloat(sin(angle)) * speed
                    )
                    survivingParticles.append(SparklerParticle(
                        position: particle.position,
                        velocity: velocity,
                        life: particle.life * 0.8,
                        color: .orange,
                        scale: particle.scale * 0.6,
                        type: .branch
                    ))
                }
                particle.life = 0 // Original dies after split
            }
            
            // Color Update based on life
            particle.color = colorForLife(particle.life)
            
            if particle.life > 0 {
                survivingParticles.append(particle)
            }
        }
        
        particles = survivingParticles
    }
    
    private func emitParticles(deltaTime: TimeInterval, intensity: Double, tipPosition: CGPoint) {
        // Base emission rate modified by intensity - BOOSTED
        let emissionRate = Int(150.0 * intensity)
        let particlesToSpawn = Int(Double(emissionRate) * deltaTime * 60.0) 
        
        if particlesToSpawn > 0 {
            for _ in 0..<particlesToSpawn {
                let angle = Double.random(in: 0...(2 * .pi))
                let maxSpeed = max(30.0, 150.0 * CGFloat(intensity))
                let speed = CGFloat.random(in: 20...maxSpeed)
                
                let velocity = CGPoint(x: CGFloat(cos(angle)) * speed, y: CGFloat(sin(angle)) * speed)
                
                // Randomly spawn a "Glow" particle
                let isGlow = Double.random(in: 0...1) < 0.1
                
                if isGlow {
                     particles.append(SparklerParticle(
                        position: tipPosition,
                        velocity: velocity,
                        life: Double.random(in: 0.3...0.6),
                        color: Color(red: 1.0, green: 0.9, blue: 0.6).opacity(0.5),
                        scale: CGFloat.random(in: 8...15), // Big soft glow
                        type: .spark
                    ))
                } else {
                    particles.append(SparklerParticle(
                        position: tipPosition,
                        velocity: velocity,
                        life: Double.random(in: 0.5...1.2),
                        color: Color(red: 1.0, green: 1.0, blue: 0.8), // White-yellow
                        scale: CGFloat.random(in: 2...5), // Bigger sparks
                        type: .spark
                    ))
                }
            }
        }
    }
    
    private func colorForLife(_ life: Double) -> Color {
        // Life 1.0 -> 0.0
        // White/Yellow -> Orange -> Red -> Gray
        if life > 0.8 {
            return Color(red: 1.0, green: 1.0, blue: 0.9) // Ultra bright
        } else if life > 0.5 {
            return Color(red: 1.0, green: 0.8, blue: 0.4) // Golden
        } else if life > 0.2 {
            return Color(red: 1.0, green: 0.4, blue: 0.1) // Orange
        } else {
            return Color(white: 0.5, opacity: life * 2) // Fade out
        }
    }
    
    // Trigger burst (tap action)
    func burst(at position: CGPoint) {
        for _ in 0..<30 {
            let angle = Double.random(in: 0...(2 * .pi))
            let speed = CGFloat.random(in: 100...200)
            particles.append(SparklerParticle(
                position: position,
                velocity: CGPoint(x: CGFloat(cos(angle)) * speed, y: CGFloat(sin(angle)) * speed),
                life: 0.8,
                color: .white,
                scale: 2.5,
                type: .spark
            ))
        }
    }
}

// MARK: - View

struct SparklerView: View {
    let state: SparklerState
    let isMine: Bool
    
    // Internal physics state
    @State private var system = SparklerSystem()
    
    var body: some View {
        TimelineView(.animation) { timeline in
            let now = timeline.date

            GeometryReader { geo in
                let size = geo.size
                let centerX = size.width / 2
                
                let scaleFactor: CGFloat = 3.0
                let currentHandelLength = CGFloat(state.maxDuration) * scaleFactor
                
                let origin = CGPoint(x: centerX, y: 0)
                let tip = CGPoint(x: centerX, y: currentHandelLength)
                
                // Side Effect: Update System (Class mutation)
                // No View State is modified here, so no infinite loop.
                let _ = system.update(now: now, intensity: state.currentIntensity, tipPosition: tip)
                
                Canvas { context, size in
                    // Draw Handle
                    let path = Path { p in
                        p.move(to: origin)
                        p.addLine(to: tip)
                    }
                    context.stroke(path, with: .color(.gray), lineWidth: 2)
                    
                    // Draw Molten Ball (The Core)
                    let coreColor = state.currentIntensity > 0.5 ? Color.orange : Color.red
                    // Ball size grows with intensity
                    let coreSize: CGFloat = 8.0 + CGFloat(state.currentIntensity * 4.0)
                    let coreRect = CGRect(x: tip.x - coreSize/2, y: tip.y - coreSize/2, width: coreSize, height: coreSize)
                    
                    var coreContext = context
                    coreContext.addFilter(.blur(radius: 2))
                    coreContext.fill(Path(ellipseIn: coreRect), with: .color(coreColor))
                    
                    // Draw Particles
                    for particle in system.particles {
                        let pRect = CGRect(
                            x: particle.position.x - particle.scale/2,
                            y: particle.position.y - particle.scale/2,
                            width: particle.scale,
                            height: particle.scale
                        )
                        
                        var pContext = context
                        // Additive blend for sparks
                        if particle.type != .core {
                            pContext.blendMode = .plusLighter
                        }
                        
                        pContext.fill(Path(ellipseIn: pRect), with: .color(particle.color))
                    }
                }
            }
        }
        .onTapGesture {
            // Interaction logic handled by parent (ChatView)
        }
    }
}

