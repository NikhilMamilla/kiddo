import type { BDIResult, DistressLevel } from '../types/bdi';

/**
 * Generates a supportive, non-clinical response based on the distress level.
 * 
 * Guidelines:
 * - Calm, supportive, non-judgmental.
 * - Non-medical, no diagnosis.
 * - Short (1-3 sentences).
 */

const RESPONSES: Record<DistressLevel, string[]> = {
    Low: [
        "It sounds like you're handling things well. Keep it up!",
        "I'm glad to hear you're feeling okay. It's great to have these positive moments.",
        "Thank you for sharing that with me. It's good to stay connected with how you're feeling.",
        "That's wonderful. Staying positive really makes a difference."
    ],
    Moderate: [
        "I hear that things might be a bit challenging right now. Let's take a moment together.",
        "It's okay to feel this way. I'm taking note of what you're sharing.",
        "That sounds like a lot to carry. I'm here to listen as you talk through it.",
        "Thank you for being honest about how you're feeling. I'm here with you.",
        "I might be reading this wrong, but it sounds like something isn’t sitting right. I'm here if you want to elaborate.",
        "I'm here for you, even if right now feels a bit complicated to put into words."
    ],
    High: [
        "I'm concerned to hear you're feeling this way. It might be helpful to talk this through with someone you trust.",
        "That sounds very difficult to handle alone. Please remember there are people who care and want to support you.",
        "I hear how much you're going through right now. Seeking some extra support could make a real difference.",
        "Thank you for sharing these deep feelings with me. If things feel overwhelming, reaching out to a professional is a brave and helpful step."
    ]
};


export const generateSupportResponse = (bdiResult: BDIResult): string => {
    // ABSOLUTE RULE: Shutdown detected ALWAYS returns a neutral check-in
    if (bdiResult.shutdownDetected === true) {
        return "I'm here if you want to talk about what's behind that.";
    }

    const categoryResponses = RESPONSES[bdiResult.distressLevel];
    const randomIndex = Math.floor(Math.random() * categoryResponses.length);
    return categoryResponses[randomIndex];
};
