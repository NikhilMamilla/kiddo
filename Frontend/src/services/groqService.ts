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
        const SYSTEM_PROMPT = `You are a charming, simple, and pleasantly polite mental health companion.

STYLE: Extremely BRIEF and CONCISE. 1-2 short sentences max.
TONE: Charming, delightful, and very polite.
GOAL: Acknowledge the user's text with a lovely, relevant, and simple response.

RULES:
- Be charming and pleasant like a dear friend.
- Keep it very short and simple.
- Stay directly relevant to what the user said.
- Never mention diagnostic data, scores, or give medical advice.
- Avoid being preachy or lengthy.

Examples:
"That sounds lovely! I'm so happy for you."
"I hear you, and I'm right here by your side."
"You're doing so well, and I truly appreciate your strength."
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
            model: "llama-3.3-70b-versatile", // Updated from deprecated llama3-8b-8192
            temperature: 0.7,
            max_tokens: 80,
        });

        return completion.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("Groq API Error:", error);
        return "";
    }
};
