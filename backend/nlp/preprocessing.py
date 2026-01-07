import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download necessary resources
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

def clean_text(text):
    """
    Lowercase, remove special characters, and tokenize text.
    """
    if not text:
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove special characters
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    return text

def preprocess_text(text):
    """
    Full preprocessing pipeline: cleaning, tokenization, and stopword removal.
    """
    text = clean_text(text)
    
    tokens = word_tokenize(text)
    
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [w for w in tokens if w not in stop_words]
    
    return filtered_tokens
