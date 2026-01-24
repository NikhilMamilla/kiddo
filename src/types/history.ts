export interface PredictionHistoryItem {
    message: string;
    timestamp: string;
    classified_state: string;
    intensity_score: number;
    sentiment_label: string;
    sos_triggered: boolean;
}
