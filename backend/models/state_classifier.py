from utils.constants import NORMAL, ANXIETY, STRESS, DEPRESSION, CRITICAL

class StateClassifier:
    def __init__(self, keyword_extractor):
        self.keyword_extractor = keyword_extractor

    def get_detailed_classification(self, text, sentiment_score):
        """
        Returns detailed classification data for explainability.
        """
        category_matches = self.keyword_extractor.get_category_matches(text)
        
        # Determine classified state
        final_state = self.classify(text, sentiment_score)
        
        # Calculate probabilities
        probabilities = self.get_probabilities(text, sentiment_score)
        
        return {
            "classified_state": final_state,
            "probabilities": probabilities,
            "category_matches": category_matches
        }

    def classify(self, text, sentiment_score):
        """
        Rule-based classification prioritizing Critical Distress, 
        then using keyword counts and sentiment.
        """
        category_matches = self.keyword_extractor.get_category_matches(text)
        
        # 1. Check for Critical Distress (High Priority)
        if category_matches.get("Critical Distress", 0) > 0:
            return CRITICAL
        
        # 2. Check for Depression
        if category_matches.get("Depression", 0) > 1 or (category_matches.get("Depression", 0) > 0 and sentiment_score < -0.4):
            return DEPRESSION
            
        # 3. Check for Anxiety
        if category_matches.get("Anxiety", 0) > 1 or (category_matches.get("Anxiety", 0) > 0 and sentiment_score < -0.2):
            return ANXIETY
            
        # 4. Check for Stress
        if category_matches.get("Stress", 0) > 0:
            return STRESS
            
        # 5. Fallback to Normal or sentiment based
        if sentiment_score < -0.3:
            return STRESS # Generalized stress if negative but no keywords
            
        return NORMAL

    def get_probabilities(self, text, sentiment_score):
        """
        Calculates normalized confidence across all states.
        Sums to exactly 100%.
        """
        category_matches = self.keyword_extractor.get_category_matches(text)
        
        # Base scores
        scores = {
            NORMAL: 10,
            ANXIETY: 5,
            STRESS: 5,
            DEPRESSION: 5,
            CRITICAL: 0
        }
        
        # Adjust based on keywords
        # Reduced multiplier (10 instead of 15) for even better stability with 1000+ words
        multiplier = 10
        scores[ANXIETY] += category_matches.get("Anxiety", 0) * multiplier
        scores[STRESS] += category_matches.get("Stress", 0) * multiplier
        scores[DEPRESSION] += category_matches.get("Depression", 0) * multiplier
        scores[CRITICAL] += category_matches.get("Critical Distress", 0) * 50
        
        # Adjust based on sentiment
        if sentiment_score < -0.5:
            scores[DEPRESSION] += 20
            scores[CRITICAL] += 5
        elif sentiment_score < -0.2:
            scores[STRESS] += 15
            scores[ANXIETY] += 15
        elif sentiment_score > 0.2:
            scores[NORMAL] += 30
            
        # Ensure Critical has weight if keywords found
        if category_matches.get("Critical Distress", 0) > 0:
            # Force high probability for critical
            for k in scores: scores[k] = 0
            scores[CRITICAL] = 100
        else:
            # Normalization
            total = sum(scores.values())
            if total == 0: 
                scores[NORMAL] = 100
            else:
                for state in scores:
                    scores[state] = round((scores[state] / total) * 100)
                
                # Adjust last one to ensure sum is exactly 100
                current_sum = sum(scores.values())
                diff = 100 - current_sum
                # Feed diff to the most likely state to avoid bias
                max_state = max(scores, key=scores.get)
                scores[max_state] += diff
                
        return scores
