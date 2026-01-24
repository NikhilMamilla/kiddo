def calculate_intensity(sentiment_score, keyword_count):
    """
    Calculates intensity with a safety floor for high keyword counts.
    """
    # Force high intensity for any significant keyword matches (especially weighted ones)
    if keyword_count >= 10: # Our new Critical weighting
        return 5.0

    # Sentiment contribution (0-2.5)
    sentiment_intensity = (1.0 - sentiment_score) * 1.25
    
    # Keyword contribution (0-2.5)
    kw_intensity = min(keyword_count * 0.5, 2.5)
    
    total_intensity = sentiment_intensity + kw_intensity
    
    return round(min(total_intensity, 5.0), 1)
