import type { EmotionScores } from '../types/emotions';
import type { BDIResult, DistressLevel } from '../types/bdi';

/**
 * Fuses multimodal signals into a single Behavioral Distress Index (BDI).
 * 
 * **CRITICAL DESIGN PRINCIPLE**: Text is the PRIMARY signal, emojis are SECONDARY/decorative.
 * 
 * Weights are strategically balanced to prioritize deliberate text input:
 * - **Text Content (60%)**: The main emotional signal - what user deliberately writes.
 * - **Typing Behavior (30%)**: Physical baseline of strain (unconscious signals).
 * - **Emoji Content (10%)**: Supplementary/decorative - used for fun, can be sarcastic.
 * 
 * **Why Text Dominates**:
 * - Users are more intentional with words than emojis
 * - Text: "I am angry 😊" → "angry" should win, not the smile
 * - Emojis can be ironic, playful, or just added for aesthetics
 * 
 * Safety: Logic remains rule-based and academic-safe.
 */
export const calculateBDI = (
    typingStress: number,
    textEmotions: EmotionScores,
    emojiEmotions: EmotionScores
): BDIResult => {
    // 1. Calculate Peak Distress from Text (PEAK SIGNAL APPROACH)
    // We use Math.max to ensure one strong emotion isn't diluted by others being low
    const textDistress = Math.max(textEmotions.sadness, textEmotions.anxiety, textEmotions.anger);

    // 2. Calculate Distress from Emojis (SECONDARY/DECORATIVE)
    // Check if any emojis were even detected to avoid pulling the score down artificially
    const hasEmojis = Object.values(emojiEmotions).some(val => val > 0);
    const emojiDistress = hasEmojis
        ? (emojiEmotions.sadness + emojiEmotions.anxiety + emojiEmotions.anger) / 3
        : 0;

    // 3. Positivity Buffer
    // Positivity acts as a dampening factor on the distress index
    // BUT: Text positivity has 3x more weight than emoji positivity
    let positivityFactor = hasEmojis
        ? (textEmotions.positivity * 0.75) + (emojiEmotions.positivity * 0.25)
        : textEmotions.positivity;

    // RULE: Text-Priority Override
    // If text anger OR text sadness is high, we IGNORE emoji positivity to prevent "masking"
    if (textEmotions.anger >= 0.6) {
        positivityFactor = 0; // Completely ignore positivity dampening for high anger
    } else if (textEmotions.anger >= 0.5 || textEmotions.sadness >= 0.5) {
        positivityFactor = textEmotions.positivity / 2; // Only allow text positivity to dampen
    }

    // 4. Fusion Calculation
    // **TEXT-DOMINANT WEIGHTING**: Text gets 60%, Typing 30%, Emoji only 10%
    let baseDistress: number;
    if (!hasEmojis) {
        // No emojis: Split between typing (45%) and text (55%)
        baseDistress = (0.45 * typingStress) + (0.55 * textDistress);
    } else {
        // With emojis: Text still dominates at 60%
        baseDistress = (0.30 * typingStress) + (0.60 * textDistress) + (0.10 * emojiDistress);
    }

    // 5. Dynamic Dampening Safeguard
    // - If baseDistress is high (>= 0.4), positivity should have MINIMAL impact (max -0.1).
    // - If explicit anger is high (textEmotions.anger >= 0.5), we reduce dampening further to preserve frustration signals.
    // - If baseDistress is low (< 0.4), positivity can dampen more normally (up to -0.2).
    let dampeningWeight = baseDistress >= 0.4 ? 0.1 : 0.2;

    // Extra safeguard for Anger: Anger distress should not be easily washed out by a single positive token/emoji
    if (textEmotions.anger >= 0.5) dampeningWeight = Math.min(dampeningWeight, 0.05);

    const bdiScore = baseDistress - (positivityFactor * dampeningWeight);

    // Final normalization and clamping
    let finalScore = Number(Math.max(0, Math.min(1, bdiScore)).toFixed(2));

    // FINAL ANGER HARD OVERRIDE
    // If explicit text anger is >= 0.6, we ensure the index does not drop to "Low"
    if (textEmotions.anger >= 0.6) {
        finalScore = Math.max(finalScore, 0.35);
    }

    // Determine Distress Level
    let distressLevel: DistressLevel = 'Low';
    if (finalScore > 0.6) {
        distressLevel = 'High';
    } else if (finalScore > 0.3) {
        distressLevel = 'Moderate';
    }

    return {
        bdiScore: finalScore,
        distressLevel,
        shutdownDetected: textEmotions.shutdownDetected
    };
};
