import type { EmotionScores } from '../types/emotions';

/**
 * Lightweight emoji-emotion analyzer.
 * Extracts emojis from text and maps them to emotional categories.
 */

type EmojiCategory = 'sadness' | 'anxiety' | 'anger' | 'positivity';

const EMOJI_MAP: Record<string, EmojiCategory> = {
    // Sadness
    '😞': 'sadness', '😢': 'sadness', '😭': 'sadness', '😟': 'sadness', '😔': 'sadness',
    '💔': 'sadness', '😿': 'sadness', '🙁': 'sadness', '😥': 'sadness', '🥺': 'sadness',

    // Anxiety
    '😰': 'anxiety', '😨': 'anxiety', '😱': 'anxiety', '😖': 'anxiety', '😬': 'anxiety',
    '🥵': 'anxiety', '🥶': 'anxiety', '🤔': 'anxiety', '🤨': 'anxiety',

    // Anger
    '😡': 'anger', '😠': 'anger', '🤬': 'anger', '😤': 'anger', '💢': 'anger',
    '👿': 'anger', '👊': 'anger', '👎': 'anger',

    // Positivity
    '😊': 'positivity', '🙂': 'positivity', '😁': 'positivity', '😄': 'positivity', '🌟': 'positivity',
    '✨': 'positivity', '❤️': 'positivity', '💙': 'positivity', '🌈': 'positivity', '🙏': 'positivity',
    '💪': 'positivity', '👍': 'positivity', '🥰': 'positivity', '😍': 'positivity'
};

// Regex to match emojis
const EMOJI_REGEX = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

export const analyzeEmojiEmotion = (text: string): EmotionScores => {
    const emojis = text.match(EMOJI_REGEX) || [];

    let sadnessCount = 0;
    let anxietyCount = 0;
    let angerCount = 0;
    let positivityCount = 0;

    if (emojis.length > 0) {
        emojis.forEach(emoji => {
            const category = EMOJI_MAP[emoji];
            if (category === 'sadness') sadnessCount++;
            else if (category === 'anxiety') anxietyCount++;
            else if (category === 'anger') angerCount++;
            else if (category === 'positivity') positivityCount++;
        });
    }

    const normalize = (count: number) => {
        return Number(Math.min(1.0, count * 0.5).toFixed(2));
    };

    return {
        sadness: normalize(sadnessCount),
        anxiety: normalize(anxietyCount),
        anger: normalize(angerCount),
        positivity: normalize(positivityCount),
        shutdownDetected: false
    };
};
