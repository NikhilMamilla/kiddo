export interface TypingMetrics {
    typingSpeed: number; // keys per second
    averagePauseDuration: number; // ms
    errorRate: number; // backspaces / total keystrokes
    totalKeystrokes: number;
    backspaceCount: number;
}
