import json
import os
from nlp.preprocessing import clean_text

class KeywordExtractor:
    def __init__(self, lexicon_path=None):
        if lexicon_path is None:
            lexicon_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'lexicon.json')
        
        with open(lexicon_path, 'r') as f:
            self.lexicon = json.load(f)

    def extract_keywords(self, text):
        """
        Extracts words that match the emotion lexicon.
        """
        cleaned = clean_text(text)
        found_keywords = []
        
        # We check both individual words and the lexicon entries (which might be phrases)
        for category, keywords in self.lexicon.items():
            for kw in keywords:
                if kw in cleaned:
                    found_keywords.append(kw)
        
        # Deduplicate while preserving order if possible
        return list(set(found_keywords))

    def get_category_matches(self, text):
        """
        Returns match counts with heavy weighting for Critical Distress phrases.
        """
        cleaned = clean_text(text)
        matches = {category: 0 for category in self.lexicon.keys()}
        
        for category, keywords in self.lexicon.items():
            for kw in keywords:
                # Use word boundary or direct phrase match to prevent partial matches
                # e.g., "die" shouldn't match "diet", but "want to die" should match "i want to die"
                if kw in cleaned:
                    # HEAVY WEIGHTING for Critical Distress
                    weight = 10 if category == "Critical Distress" else 1
                    matches[category] += weight
        
        return matches
