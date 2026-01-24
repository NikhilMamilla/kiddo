from nlp.keyword_extractor import KeywordExtractor
from models.sentiment_model import SentimentAnalyzer
from models.state_classifier import StateClassifier
from utils.scoring import calculate_intensity
from utils.constants import PRECAUTIONS, CRITICAL
from services.sos_service import SOSService
from services.agent_service import AgentService

class AnalysisService:
    def __init__(self):
        self.keyword_extractor = KeywordExtractor()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.state_classifier = StateClassifier(self.keyword_extractor)
        self.sos_service = SOSService()
        self.agent_service = AgentService()

    def _analyze_momentum(self, history):
        """
        Analyzes the last few interactions to determine emotional momentum.
        Returns: "Stable", "Spiraling", or "Improving"
        """
        if not history or len(history) < 2:
            return "Stable"
            
        severity_map = {
            "Normal": 0,
            "Stress": 1,
            "Anxiety": 2,
            "Depression": 3,
            "Critical Distress": 4
        }
        
        # Get last 3 states (assuming history is list of dicts with 'classified_state')
        recent_history = history[-3:]
        scores = [severity_map.get(item.get('classified_state', 'Normal'), 0) for item in recent_history]
        
        if len(scores) < 2:
            return "Stable"
            
        # Compare first and last of the recent window
        first = scores[0]
        last = scores[-1]
        
        if last > first:
            return "Spiraling"
        elif last < first:
            return "Improving"
            
        return "Stable"

    def perform_full_analysis(self, message, mode='user', history=[]):
        # 1. Sentiment Analysis
        sentiment = self.sentiment_analyzer.analyze(message)
        
        # 2. Keyword Extraction
        keywords = self.keyword_extractor.extract_keywords(message)
        
        # 3. Detailed Classification
        detailed_data = self.state_classifier.get_detailed_classification(message, sentiment['score'])
        state = detailed_data['classified_state']
        probabilities = detailed_data['probabilities']
        keyword_contributions = detailed_data['category_matches']
        
        # 4. Intensity Score
        # We pass the Total match weights (especially Critical weighting) to ensure intensity floor triggers
        total_match_weight = sum(keyword_contributions.values())
        intensity = calculate_intensity(sentiment['score'], total_match_weight)
        
        # 5. Trend Analysis (NEW Phase 8)
        trend = self._analyze_momentum(history)
        
        # 6. Agent Response (Updated Phase 8)
        agent_resp = self.agent_service.generate_response(state, intensity, trend)
        
        # 6. Intensity Reasoning Logic
        if intensity >= 4.0:
            intensity_reasoning = f"Critical indicators detected with high volume of risk keywords ({len(keywords)}) and significant negative sentiment ({sentiment['score']})."
        elif intensity >= 2.5:
            intensity_reasoning = f"Moderate emotional intensity characterized by negative sentiment and {len(keywords)} matching emotion keywords."
        else:
            intensity_reasoning = "Stable emotional state with low keyword density and neutral or positive sentiment."

        # 7. Final Decision Summary
        has_keywords = any(count > 0 for count in keyword_contributions.values())
        if state == CRITICAL:
            summary = "The message was classified as Critical Distress due to the presence of emergency/crisis indicators."
        elif has_keywords:
            summary = f"The message was classified as {state} because of a high concentration of {state}-related keywords and sentiment influence."
        else:
            summary = f"The message was classified as {state} based primarily on the overall sentiment score of {sentiment['score']}."

        # 8. Precautions
        precautions = PRECAUTIONS.get(state, PRECAUTIONS["Normal"])
        
        # 9. Autonomous Action (SOS)
        sos_action = {"sos_triggered": False, "message": "No emergency action required"}
        if state == CRITICAL:
            sos_action = self.sos_service.trigger_sos()
            
        full_response = {
            "prediction_result": state,
            "sentiment_analysis": sentiment,
            "extracted_keywords": keywords,
            "classified_state": state,
            "intensity_score": intensity,
            "state_probabilities": probabilities,
            "precautions": precautions,
            "autonomous_action": sos_action,
            "decision_explanation": {
                "dominant_state": state,
                "trigger_keywords": keywords,
                "keyword_contributions": keyword_contributions,
                "sentiment_influence": sentiment['score'],
                "intensity_reasoning": intensity_reasoning,
                "final_decision_summary": summary
            },
            "agent_response": agent_resp,
            "mode": mode
        }

        # Filtering based on mode
        if mode == 'user':
            # Hide heavy analytics for user mode, but keep sentiment/intensity for UI
            filtered_response = {
                "prediction_result": full_response["prediction_result"],
                "sentiment_analysis": full_response["sentiment_analysis"],  # Added for frontend
                "intensity_score": full_response["intensity_score"],  # Added for frontend
                "classified_state": full_response["classified_state"],
                "precautions": full_response["precautions"],
                "autonomous_action": full_response["autonomous_action"],
                "agent_response": full_response["agent_response"],
                "mode": mode
            }
            return filtered_response

        # Return full response for review mode
        return full_response
