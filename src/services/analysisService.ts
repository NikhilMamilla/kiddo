import type { PredictionHistoryItem } from '../types/history';

export interface AnalysisResponse {
    prediction_result: string;
    sentiment_analysis?: {
        score: number;
        label: string;
    };
    extracted_keywords?: string[];
    classified_state: string;
    intensity_score?: number;
    state_probabilities?: {
        "Normal": number;
        "Anxiety": number;
        "Stress": number;
        "Depression": number;
        "Critical Distress": number;
    };
    precautions: string[];
    autonomous_action: {
        sos_triggered: boolean;
        message: string;
    };
    decision_explanation?: {
        dominant_state: string;
        trigger_keywords: string[];
        keyword_contributions: Record<string, number>;
        sentiment_influence: number;
        intensity_reasoning: string;
        final_decision_summary: string;
    };
    agent_response: {
        agent_message: string;
        suggested_actions: string[];
        recommended_focus: string;
        urgency_level: "Low" | "Medium" | "High";
        agent_tone: string;
    };
    mode: 'user' | 'review';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const analyzeMessage = async (message: string, mode: 'user' | 'review' = 'user', history: PredictionHistoryItem[] = [], emergencyContacts: any[] = []): Promise<AnalysisResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, mode, history, emergency_contacts: emergencyContacts }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze message');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const triggerSOS = async (emergencyContacts: any[] = []): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/sos/trigger`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emergency_contacts: emergencyContacts })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to trigger SOS');
        }

        return await response.json();
    } catch (error) {
        console.error('SOS API Error:', error);
        throw error;
    }
};
