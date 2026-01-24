import type { TypingMetrics } from '../types/metrics';

/**
 * Calculates a normalized stress score (0.0 - 1.0) based on typing behavior.
 * 
 * Logic:
 * - Slow typing speed compared to a baseline increases score.
 * - Long pauses between keystrokes increase score.
 * - High error rate (backspaces) increases score.
 */
export const calculateTypingStressScore = (metrics: TypingMetrics): number => {
    const { typingSpeed, averagePauseDuration, errorRate } = metrics;

    // 1. Normalize Typing Speed (Keys per second)
    // Baseline: 1 cps (Sluggish/High Stress) to 8 cps (Fluid/Low Stress)
    // We want speed to contribute to HIGHER stress when it is LOWER.
    const minSpeed = 1;
    const maxSpeed = 8;
    const normalizedSpeed = Math.max(0, Math.min(1, 1 - (typingSpeed - minSpeed) / (maxSpeed - minSpeed)));

    // 2. Normalize Pause Duration (Milliseconds)
    // Baseline: 100ms (Fluid/Low Stress) to 1500ms (Hesitant/High Stress)
    const minPause = 100;
    const maxPause = 1500;
    const normalizedPause = Math.max(0, Math.min(1, (averagePauseDuration - minPause) / (maxPause - minPause)));

    // 3. Error Rate
    // Directly used as it's already normalized (0-1), though typically rare to hit 1.0.
    // Capping at 0.5 as "very high stress" for errors in academic context.
    const normalizedError = Math.max(0, Math.min(1, errorRate / 0.5));

    // Weighted Average
    // Speed: 40%, Pauses: 40%, Error Rate: 20%
    const stressScore = (0.4 * normalizedSpeed) + (0.4 * normalizedPause) + (0.2 * normalizedError);

    // Return clamped and rounded result
    return Number(Math.max(0, Math.min(1, stressScore)).toFixed(2));
};
