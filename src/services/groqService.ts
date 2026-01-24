import Groq from "groq-sdk";

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

let groq: Groq | null = null;

if (API_KEY) {
    groq = new Groq({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true // Required for frontend-only usage
    });
}

export const generateGroqResponse = async (message: string): Promise<string> => {
    if (!groq) {
        console.warn("Groq API Key is missing. Falling back.");
        return "";
    }

    try {
        const SYSTEM_PROMPT = `You are KIDDOO, a calm, professional, and deeply caring mental health support agent. 
        
PERSONALITY: Behaves like a loving, wise Doctor treating a patient. Calm, steady, professional, but radiating care and warmth.
GOAL: Make the user feel safe and cared for, like a patient in good hands.
        
RULES:
- STRICTLY KEEP RESPONSES SHORT: Maximum 2-3 lines.
- No long lectures or lists.
- Tone: "I am here for you," "We will get through this." Professional but affectionate.
- Listen more, speak less. Ask one gentle follow-up question.
        
Examples:
- "I hear you, and I am sorry you are in pain. You are safe here with me. Can you tell me what started this feeling?"
- "Taking a deep breath together might help. I am right here by your side. How does your body feel right now?"
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.1-8b-instant", // Optimized for ultra-fast responses
            temperature: 0.7,
            max_tokens: 60,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "";
    }
};
