import { useRef, useCallback } from 'react';
import type { TypingMetrics } from '../types/metrics';

export const useTypingMetrics = () => {
    const totalKeystrokes = useRef<number>(0);
    const backspaceCount = useRef<number>(0);
    const typingStartTime = useRef<number | null>(null);
    const lastKeyTime = useRef<number | null>(null);
    const pauseDurations = useRef<number[]>([]);

    const registerKeyPress = useCallback((event: React.KeyboardEvent) => {
        const now = Date.now();

        // Initialize start time on first key press
        if (typingStartTime.current === null) {
            typingStartTime.current = now;
        }

        // Capture pause duration if it's not the first key
        if (lastKeyTime.current !== null) {
            const pause = now - lastKeyTime.current;
            // We consider a "pause" anything between keys significant enough, 
            // but here we just collect all gaps.
            pauseDurations.current.push(pause);
        }

        lastKeyTime.current = now;
        totalKeystrokes.current += 1;

        if (event.key === 'Backspace') {
            backspaceCount.current += 1;
        }
    }, []);

    const resetMetrics = useCallback(() => {
        totalKeystrokes.current = 0;
        backspaceCount.current = 0;
        typingStartTime.current = null;
        lastKeyTime.current = null;
        pauseDurations.current = [];
    }, []);

    const getMetrics = useCallback((): TypingMetrics => {
        const now = Date.now();
        const startTime = typingStartTime.current || now;
        const totalDurationSeconds = (now - startTime) / 1000;

        const typingSpeed = totalDurationSeconds > 0
            ? totalKeystrokes.current / totalDurationSeconds
            : 0;

        const averagePauseDuration = pauseDurations.current.length > 0
            ? pauseDurations.current.reduce((a, b) => a + b, 0) / pauseDurations.current.length
            : 0;

        const errorRate = totalKeystrokes.current > 0
            ? backspaceCount.current / totalKeystrokes.current
            : 0;

        return {
            typingSpeed: Number(typingSpeed.toFixed(2)),
            averagePauseDuration: Number(averagePauseDuration.toFixed(2)),
            errorRate: Number(errorRate.toFixed(4)),
            totalKeystrokes: totalKeystrokes.current,
            backspaceCount: backspaceCount.current,
        };
    }, []);

    return {
        registerKeyPress,
        resetMetrics,
        getMetrics,
    };
};
