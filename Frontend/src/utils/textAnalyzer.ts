import type { EmotionScores } from '../types/emotions';

/**
 * ADVANCED EMOTION ANALYZER - Version 2.0
 * 
 * Features:
 * 1. Negation Detection ("not happy" → negative)
 * 2. Intensity Modifiers ("very sad" → higher score)
 * 3. Multi-word Phrases ("feel like giving up")
 * 4. Context-Aware Scoring
 * 5. Contradiction Resolution
 */

const LEXICON = {
    sadness: ['sad', 'unhappy', 'lonely', 'miserable', 'heartbroken', 'gloomy', 'down', 'depressed', 'crying', 'tears', 'hopeless', 'grief', 'sorrow', 'hurt', 'pain', 'regret', 'empty', 'worthless', 'despair', 'broken', 'defeated', 'lost'],
    anxiety: ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'fear', 'stress', 'pressure', 'overwhelmed', 'tense', 'uneasy', 'restless', 'shaking', 'dread', 'terrified', 'frightened', 'paranoid', 'concerned'],
    anger: ['angry', 'mad', 'furious', 'annoyed', 'frustrated', 'irritated', 'hate', 'rage', 'resentment', 'bitter', 'offended', 'outrage', 'hostile', 'agitated', 'pissed', 'disgusting', 'awful', 'terrible', 'stupid', 'ridiculous', 'upset', 'annoying', 'infuriating', 'enraged'],
    positivity: ['happy', 'good', 'great', 'awesome', 'wonderful', 'joy', 'excited', 'content', 'calm', 'peaceful', 'relaxed', 'grateful', 'love', 'blessed', 'proud', 'smile', 'thanks', 'fine', 'ok', 'okay', 'amazing', 'fantastic', 'brilliant', 'excellent']
};

// Core keywords for fuzzy matching (typo tolerance)
const CORE_KEYWORDS = {
    anger: ['angry', 'mad', 'furious', 'pissed', 'annoyed', 'frustrated', 'hate'],
    sadness: ['sad', 'depressed', 'miserable', 'lonely', 'hopeless', 'hurt', 'unhappy', 'worthless'],
    anxiety: ['anxious', 'worried', 'scared', 'panic', 'afraid', 'nervous', 'stress', 'overwhelmed'],
    positivity: ['happy', 'excited', 'glad', 'joyful', 'wonderful', 'awesome', 'great']
};

// Multi-word phrases (high-priority detection)
const PHRASES = {
    critical: [
        'want to die', 'end it all', 'kill myself', 'no point', 'give up',
        'can\'t go on', 'better off dead', 'not worth living'
    ],
    depression: [
        'feel empty', 'feel worthless', 'feel hopeless', 'feel alone',
        'no one cares', 'hate myself', 'feel numb', 'can\'t feel'
    ],
    anxiety: [
        'can\'t breathe', 'heart racing', 'panic attack', 'feel trapped',
        'losing control', 'going crazy', 'can\'t stop worrying'
    ],
    anger: [
        'so angry', 'hate everything', 'pissed off', 'fed up',
        'can\'t stand', 'sick of', 'drives me crazy'
    ]
};

// Negation words
const NEGATIONS = ['not', 'no', 'never', 'none', 'nobody', 'nothing', 'neither', 'nowhere', 'hardly', 'barely', 'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'can\'t', 'cannot'];

// Intensity modifiers
const INTENSIFIERS = {
    high: ['very', 'extremely', 'incredibly', 'super', 'really', 'so', 'absolutely', 'totally', 'completely'],
    medium: ['quite', 'pretty', 'fairly', 'rather', 'somewhat'],
    low: ['a bit', 'slightly', 'kind of', 'sort of', 'a little']
};

// Diminishers (reduce intensity)
const DIMINISHERS = ['barely', 'hardly', 'scarcely', 'almost'];

export const analyzeTextEmotion = (text: string): EmotionScores => {
    const lower = text.toLowerCase().trim();
    const rawWords = (lower.match(/\b(\w+)\b/g) || []) as string[];

    // STEP 1: Multi-word phrase detection (highest priority)
    let criticalPhraseDetected = false;
    let depressionPhraseScore = 0;
    let anxietyPhraseScore = 0;
    let angerPhraseScore = 0;

    for (const phrase of PHRASES.critical) {
        if (lower.includes(phrase)) {
            criticalPhraseDetected = true;
            depressionPhraseScore = 1.0;
        }
    }

    for (const phrase of PHRASES.depression) {
        if (lower.includes(phrase)) depressionPhraseScore = Math.max(depressionPhraseScore, 0.8);
    }

    for (const phrase of PHRASES.anxiety) {
        if (lower.includes(phrase)) anxietyPhraseScore = Math.max(anxietyPhraseScore, 0.8);
    }

    for (const phrase of PHRASES.anger) {
        if (lower.includes(phrase)) angerPhraseScore = Math.max(angerPhraseScore, 0.7);
    }

    // STEP 2: Shutdown detection (early return)
    const shutdownWords = ['whatever', 'fine', 'ok', 'okay', 'wow', 'nice'];
    const cleanLower = lower.replace(/[.!?]$/, '');

    if (text.trim().length <= 10 && shutdownWords.includes(cleanLower)) {
        return {
            sadness: 0,
            anxiety: 0,
            anger: 0.4,
            positivity: 0,
            shutdownDetected: true
        };
    }

    // STEP 3: Build word context map (track negations and intensifiers)
    const wordContext = new Map<number, { word: string; negated: boolean; intensity: number }>();

    for (let i = 0; i < rawWords.length; i++) {
        const word = rawWords[i];
        let negated = false;
        let intensity = 1.0;

        // Check for negation in previous 2 words
        for (let j = Math.max(0, i - 2); j < i; j++) {
            if (NEGATIONS.includes(rawWords[j])) {
                negated = true;
            }
        }

        // Check for intensifiers in previous word
        if (i > 0) {
            const prevWord = rawWords[i - 1];
            if (INTENSIFIERS.high.includes(prevWord)) intensity = 1.5;
            else if (INTENSIFIERS.medium.includes(prevWord)) intensity = 1.2;
            else if (INTENSIFIERS.low.includes(prevWord)) intensity = 0.7;
        }

        // Check for diminishers
        if (i > 0 && DIMINISHERS.includes(rawWords[i - 1])) {
            intensity = 0.5;
        }

        wordContext.set(i, { word, negated, intensity });
    }

    // STEP 4: Count emotions with context awareness
    let sadCount = 0;
    let anxCount = 0;
    let angCount = 0;
    let posCount = 0;

    for (let i = 0; i < rawWords.length; i++) {
        const ctx = wordContext.get(i)!;
        const word = ctx.word;
        const modifier = ctx.intensity * (ctx.negated ? -1 : 1);

        // Exact word matching
        if (LEXICON.sadness.includes(word)) {
            sadCount += modifier;
        }
        if (LEXICON.anxiety.includes(word)) {
            anxCount += modifier;
        }
        if (LEXICON.anger.includes(word)) {
            angCount += modifier;
        }
        if (LEXICON.positivity.includes(word)) {
            posCount += modifier;
        }
    }

    // STEP 5: Robust Fuzzy Matching for typos (all emotions)
    for (const rawWord of rawWords) {
        // Robust check for character repetition and common typos
        // e.g., "angryy" -> "angry", "depresed" -> "depressed"
        const cleanWord = rawWord.replace(/(.)\1+/g, '$1'); // Collapse repeated chars

        const checkMatch = (wordToCheck: string, coreList: string[]) => {
            return coreList.some(core =>
                wordToCheck.includes(core) ||
                core.includes(wordToCheck) ||
                (wordToCheck.length > 3 && core.startsWith(wordToCheck.slice(0, -1)))
            );
        };

        if (checkMatch(rawWord, CORE_KEYWORDS.anger) || checkMatch(cleanWord, CORE_KEYWORDS.anger)) {
            angCount = Math.max(angCount, 1.2); // Boost specifically for high-intensity matches
        }
        if (checkMatch(rawWord, CORE_KEYWORDS.sadness) || checkMatch(cleanWord, CORE_KEYWORDS.sadness)) {
            sadCount = Math.max(sadCount, 1.2);
        }
        if (checkMatch(rawWord, CORE_KEYWORDS.anxiety) || checkMatch(cleanWord, CORE_KEYWORDS.anxiety)) {
            anxCount = Math.max(anxCount, 1.2);
        }
        if (checkMatch(rawWord, CORE_KEYWORDS.positivity) || checkMatch(cleanWord, CORE_KEYWORDS.positivity)) {
            posCount = Math.max(posCount, 1.2);
        }
    }

    // STEP 6: Normalize scores
    const norm = (c: number) => Number(Math.max(0, Math.min(1.0, c * 0.3)).toFixed(2));

    let sadRes = norm(sadCount);
    let anxRes = norm(anxCount);
    let angRes = norm(angCount);
    let posRes = norm(posCount);

    // Apply phrase-level boosts
    sadRes = Math.max(sadRes, depressionPhraseScore);
    anxRes = Math.max(anxRes, anxietyPhraseScore);
    angRes = Math.max(angRes, angerPhraseScore);

    // STEP 7: Sarcasm detection
    let sarcasmFactor = 1.0;
    const hasDistress = (sadCount + anxCount + angCount) > 0;

    if ((lower.endsWith('.') || lower.endsWith('...')) &&
        ['great', 'perfect', 'fine', 'awesome'].some(t => lower.includes(t)) &&
        text.length < 50 && !hasDistress) {
        sarcasmFactor = 0.4;
    }

    // STEP 8: Shutdown phrase detection
    const shutdownPhrases = ['whatever', 'fine.', 'ok.', 'wow.', 'nice.', 'really helpful.'];
    let shutdownDetected = shutdownPhrases.some(p => lower === p);

    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    if (sentences.length >= 3 && sentences.every(s => s.toLowerCase() === sentences[0].toLowerCase())) {
        shutdownDetected = true;
    }

    if (shutdownDetected) {
        posRes = 0;
        sarcasmFactor = 0;
        angRes = Math.max(angRes, 0.4);
    }

    // STEP 9: High-impact keyword boosts
    for (const word of rawWords) {
        if (['sad', 'depressed', 'miserable', 'hopeless', 'worthless', 'empty', 'lonely', 'broken'].includes(word)) {
            sadRes = Math.max(sadRes, 0.65);
        }
        if (['anxious', 'worried', 'panic', 'scared', 'terrified', 'afraid', 'nervous', 'overwhelmed'].includes(word)) {
            anxRes = Math.max(anxRes, 0.65);
        }
        if (['angry', 'mad', 'furious', 'pissed', 'annoyed', 'frustrated', 'hate', 'rage', 'infuriated'].includes(word)) {
            angRes = Math.max(angRes, 0.65);
        }
        if (['happy', 'excited', 'wonderful', 'awesome', 'joyful', 'blessed', 'grateful', 'amazing'].includes(word)) {
            posRes = Math.max(posRes, 0.65);
        }
    }

    // STEP 10: Critical override (Broad & Sensitive)
    const dangerWords = ['die', 'kill', 'suicide', 'end it', 'want to die', 'going to die', 'end it all', 'goodbye forever'];
    const isCrisis = dangerWords.some(dw => lower.includes(dw)) || criticalPhraseDetected;

    if (isCrisis) {
        sadRes = 1.0;
        angRes = Math.max(angRes, 0.8);
        posRes = 0;
        shutdownDetected = true;
    }

    return {
        sadness: sadRes,
        anxiety: anxRes,
        anger: angRes,
        positivity: Number((posRes * sarcasmFactor).toFixed(2)),
        shutdownDetected
    };
};
