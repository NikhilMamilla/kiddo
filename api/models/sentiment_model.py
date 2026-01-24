from textblob import TextBlob
import os
import json

class SentimentAnalyzer:
    def __init__(self):
        # Load critical lexicon for sentiment overrides
        lex_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'lexicon.json')
        with open(lex_path, 'r') as f:
            lex = json.load(f)
            self.critical_phrases = lex.get("Critical Distress", [])
            self.depression_phrases = lex.get("Depression", [])

    def analyze(self, text):
        """
        Calculates sentiment with a critical phrase and keyword override.
        """
        lower_text = text.lower()
        
        # 1. Broad Critical Keyword Sweep (Highest Priority)
        # Even if the phrase isn't exact, these words in any non-positive context are critical
        danger_words = ['suicide', 'kill myself', 'killing myself', 'end my life', 'want to die', 'going to die', 'end it all']
        if any(dw in lower_text for dw in danger_words):
            return {"score": -1.0, "label": "Critical"}

        # Standalone 'die' or 'kill' check
        if ' die ' in f' {lower_text} ' or ' kill ' in f' {lower_text} ':
             return {"score": -1.0, "label": "Critical"}
            
        # 2. Critical Phrase Lexicon Override
        if any(phrase in lower_text for phrase in self.critical_phrases):
            return {"score": -1.0, "label": "Critical"}
            
        # 3. Depression/Severe Negative Override
        if any(phrase in lower_text for phrase in self.depression_phrases):
            analysis = TextBlob(text)
            score = min(analysis.sentiment.polarity, -0.6)
            return {"score": round(score, 2), "label": "Negative"}

        # 3. Standard TextBlob fallback
        analysis = TextBlob(text)
        score = analysis.sentiment.polarity
        
        if score > 0.1:
            label = "Positive"
        elif score < -0.1:
            label = "Negative"
        else:
            label = "Neutral"
            
        return {
            "score": round(score, 2),
            "label": label
        }
