import Foundation

struct SparklerState {
    var maxDuration: TimeInterval // "持ち手の長さ" - Total potential life
    var currentIntensity: Double // "火花の勢い" (0.0 to 1.0)
    var isExtinguished: Bool = false
    
    // Constant for burn rate
    static let burnRatePerSecond: Double = 0.1
    // Constant for recovery
    static let recoveryAmount: Double = 0.2
}
