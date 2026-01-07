# Mental Health Support Agent with State Prediction and Autonomous Actions

**Final Year Major Project Documentation**

---

## 1. PROJECT OVERVIEW

### 1.1 Project Title
Mental Health Support Agent with State Prediction and Autonomous Actions

### 1.2 Project Category
Major Project - Advanced Agentic AI System for Mental Health Support

### 1.3 Motivation
Mental health challenges are increasingly prevalent in modern society, yet access to immediate, non-judgmental support remains limited. Traditional mental health services often involve wait times, costs, and social stigma. We developed this system to provide an accessible, intelligent, and empathetic first line of support for individuals experiencing emotional distress.

The project aims to:
- Provide immediate emotional state assessment
- Offer contextually appropriate support guidance
- Detect critical distress situations requiring intervention
- Maintain complete user privacy through client-side operation
- Deliver explainable AI decisions for transparency

### 1.4 Real-World Relevance
This system addresses several critical gaps in mental health support infrastructure:
- **24/7 Availability**: Unlike human counselors, the agent is available at any time
- **Zero-Barrier Access**: No appointments, costs, or social stigma
- **Privacy-Preserving**: All processing occurs without storing sensitive information
- **Educational**: Helps users understand their emotional patterns through visualization
- **Crisis Detection**: Identifies critical distress and suggests immediate safety resources

### 1.5 Non-Clinical Disclaimer
**CRITICAL**: This system is explicitly **not** a clinical tool. It does not diagnose mental health conditions, provide medical advice, or replace professional care. The system uses rule-based heuristics and deterministic logic to provide supportive guidance. All outputs are educational and supportive in nature. The SOS (emergency) features are simulated for demonstration purposes and do not contact real emergency services.

---

## 2. SYSTEM ARCHITECTURE

### 2.1 High-Level Architecture
The system follows a modern client-server architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + TS)           │
│  ┌────────────┐      ┌──────────────┐  │
│  │    Chat    │      │ Visualization│  │
│  │ Interface  │◄────►│  Components  │  │
│  └────────────┘      └──────────────┘  │
│         │                    ▲          │
│         ▼                    │          │
│  ┌─────────────────────────────────┐   │
│  │   Analysis Service (API Layer)  │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ HTTP/JSON
               ▼
┌─────────────────────────────────────────┐
│         BACKEND (Flask + Python)        │
│  ┌─────────────────────────────────┐   │
│  │         /analyze Endpoint       │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│      ┌────────┼────────┐                │
│      ▼        ▼        ▼                │
│  ┌──────┐ ┌─────┐ ┌────────┐           │
│  │Keyword│ │Senti│ │ State  │           │
│  │Extract│ │ment │ │Classif.│           │
│  └───┬───┘ └──┬──┘ └───┬────┘           │
│      │        │        │                │
│      └────────┼────────┘                │
│               ▼                         │
│  ┌─────────────────────────────────┐   │
│  │    Analysis Service (Logic)     │   │
│  │  - Intensity Calculation        │   │
│  │  - Probability Normalization    │   │
│  │  - Explainability Generation    │   │
│  │  - Agent Response Generation    │   │
│  │  - Trend Momentum Analysis      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 2.2 Agent Workflow
The system processes user input through a deterministic pipeline:

1. **Input Reception**: User submits a text message via the chat interface
2. **Preprocessing**: Text is cleaned and normalized
3. **Parallel Analysis**:
   - Sentiment scoring (-1 to +1)
   - Keyword extraction (emotion-specific terms)
   - Mental state classification (Normal, Stress, Anxiety, Depression, Critical Distress)
4. **Synthesis**:
   - Intensity score calculation
   - State probability distribution
   - Trend momentum analysis (Spiraling, Improving, Stable)
5. **Agent Response Generation**:
   - Context-aware empathetic message
   - Suggested coping actions
   - Urgency level determination
   - Tone selection (Supportive, Calming, Grounding, Gentle, Urgent)
6. **Autonomous Actions**:
   - SOS trigger for Critical Distress
   - Interactive tool suggestions (CalmCircle for high stress)
   - State-specific resource recommendations
7. **Output Delivery**: Structured JSON response with full explainability

### 2.3 Technology Selection Rationale

**Flask (Backend)**: Chosen for its simplicity, flexibility, and rapid prototyping capabilities. Flask allows us to build a lightweight REST API without unnecessary overhead.

**React (Frontend)**: Selected for its component-based architecture, which maps naturally to our modular UI design (Chat, Results, History, Visualizations). TypeScript provides type safety critical for handling complex analysis responses.

---

## 3. TECHNOLOGY STACK

### 3.1 Frontend Stack
- **Framework**: React 18.x
- **Language**: TypeScript
- **UI Libraries**:
  - Lucide React (icon system)
  - Recharts (data visualization)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Build Tool**: Vite (fast development server and build tool)

### 3.2 Backend Stack
- **Framework**: Flask 2.x
- **Language**: Python 3.8+
- **NLP Libraries**:
  - TextBlob (sentiment analysis)
  - NLTK (tokenization)
  - RE (regex for keyword extraction)
- **Utilities**:
  - Flask-CORS (cross-origin resource sharing)
  - Logging (comprehensive system logging)

### 3.3 Visualization Libraries
- **Recharts**: Provides five chart types
  - Pie charts (Sentiment Gauge)
  - Progress bars (Intensity Meter)
  - Bar charts (State Probabilities, Keyword Contributions)
  - Line charts (Intensity Timeline)

---

## 4. PROJECT DIRECTORY STRUCTURE

### 4.1 Backend Directory (`/backend`)

```
backend/
├── app.py                      # Flask application entry point
├── requirements.txt            # Python dependencies
├── test_backend.py            # Backend test suite
├── data/
│   └── lexicon.json           # Mental health keyword lexicon (880 lines)
├── models/
│   ├── sentiment_model.py     # Sentiment analysis logic
│   └── state_classifier.py    # Mental state classification
├── nlp/
│   └── keyword_extractor.py   # Keyword extraction engine
├── services/
│   ├── analysis_service.py    # Main analysis orchestration
│   ├── agent_service.py       # Agent response generation
│   └── sos_service.py         # Emergency SOS simulation
└── utils/
    ├── constants.py           # System constants and mappings
    └── scoring.py             # Intensity calculation logic
```

#### File Descriptions

**`app.py`**
- Purpose: Flask application initialization and API endpoint definitions
- Key Functions:
  - `analyze()`: Main POST endpoint at `/analyze`
  - CORS configuration for frontend communication
- API Role: Receives text + mode, returns full analysis JSON

**`requirements.txt`**
- Lists all Python dependencies
- Key packages: flask, flask-cors, textblob, nltk

**`test_backend.py`**
- Comprehensive test suite
- Tests sentiment analysis, state classification, probability validation
- Includes trend analysis verification
- Validates SOS trigger logic

**`data/lexicon.json`**
- 880-line keyword database
- 5 categories: Normal, Stress, Anxiety, Depression, Critical Distress
- Each category contains 150-200 keywords and phrases
- Example: "hopeless", "overwhelmed", "peaceful", "anxious"

**`models/sentiment_model.py`**
- Wrapper around TextBlob sentiment analysis
- Returns polarity score (-1 to +1) and label (Positive/Negative/Neutral)

**`models/state_classifier.py`**
- Core classification logic
- Uses keyword matching and sentiment scoring
- Calculates state probabilities with normalization
- Provides detailed category match counts

**`nlp/keyword_extractor.py`**
- Extracts emotion-relevant keywords from user input
- Matches against lexicon.json
- Returns list of matched keywords

**`services/analysis_service.py`**
- Orchestrates the complete analysis pipeline
- Calls sentiment, keyword, and state classification components
- Calculates intensity score
- Generates explainability metadata
- Performs trend momentum analysis
- Filters output based on mode (user vs. review)

**`services/agent_service.py`**
- Generates empathetic agent responses
- Maps states to tone (Supportive, Calming, Grounding, Gentle, Urgent)
- Provides suggested actions per state
- Adapts messages based on trend (Spiraling, Improving, Stable)

**`services/sos_service.py`**
- Simulates emergency SOS trigger
- Logs mock notifications to emergency contacts
- Returns structured SOS metadata

**`utils/constants.py`**
- Defines state labels: NORMAL, STRESS, ANXIETY, DEPRESSION, CRITICAL
- Maps states to precautions (safety recommendations)
- Contains mock emergency contact list

**`utils/scoring.py`**
- Calculates emotional intensity score (0-5 scale)
- Uses sentiment score + keyword density
- Formula: `base_intensity + keyword_boost`

### 4.2 Frontend Directory (`/Frontend/src`)

```
Frontend/src/
├── main.tsx                   # React application entry point
├── App.tsx                    # Root component
├── pages/
│   └── Home.tsx              # Main page (chat, results, history)
├── components/
│   ├── ChatInterface.tsx     # Message input and submission
│   ├── AnalysisResult.tsx    # Analysis display component
│   ├── PredictionHistory.tsx # Session history viewer
│   ├── EmergencyOverlay.tsx  # Full-screen SOS alert
│   ├── CalmCircle.tsx        # Interactive breathing guide
│   ├── ResourceHub.tsx       # State-specific support resources
│   └── charts/
│       ├── SentimentGauge.tsx         # Sentiment visualization
│       ├── IntensityMeter.tsx         # Intensity progress bar
│       ├── StateProbabilityChart.tsx  # State distribution
│       ├── KeywordContributionChart.tsx # Keyword matches
│       └── IntensityTimeline.tsx      # Session trend graph
├── services/
│   └── analysisService.ts    # API communication layer
└── types/
    └── history.ts            # TypeScript interfaces
```

#### File Descriptions

**`pages/Home.tsx`**
- Main application container
- Manages global state (analysisResult, history, currentView, reviewMode)
- Handles view routing (chat, result, history)
- Implements SOS trigger and dismissal logic
- Passes session history to backend for trend analysis

**`components/ChatInterface.tsx`**
- Text input component
- Message submission
- Loading state management

**`components/AnalysisResult.tsx`**
- Displays complete analysis output
- Shows agent message, urgency, tone
- Conditionally renders visualizations
- Presents CalmCircle trigger card for high stress
- Integrates ResourceHub for state-specific tools
- Toggles between user mode and review mode

**`components/EmergencyOverlay.tsx`**
- Full-screen red SOS alert
- Displays mock emergency contacts
- Animated pulse effect
- Provides dismissal button
- Unified messaging for all users

**`components/CalmCircle.tsx`**
- Interactive breathing guide (4-7-8 technique)
- Animated SVG circle (inhale, hold, exhale)
- Color transitions (cyan -> indigo -> purple)
- Full-screen immersive experience

**`components/ResourceHub.tsx`**
- Dynamic resource card
- State-specific content:
  - **Anxiety/Stress**: Grounding techniques (5-4-3-2-1, Box Breathing)
  - **Depression**: Crisis lines (988, Crisis Text Line)
  - **Normal**: Growth tools (Gratitude, Mindfulness)
  - **Critical Distress**: Emergency services

**`components/PredictionHistory.tsx`**
- Session history table
- Shows timestamp, state, intensity, sentiment
- Highlights SOS triggers

**`charts/SentimentGauge.tsx`**
- Half-pie chart visualization
- Displays sentiment score (-1 to +1)
- Color-coded (red = negative, yellow = neutral, green = positive)

**`charts/IntensityMeter.tsx`**
- Horizontal progress bar
- Safety zones (green < 2.5 < yellow < 4.0 < red)
- Shows numeric intensity score

**`charts/StateProbabilityChart.tsx`**
- Horizontal bar chart
- Shows all 5 state probabilities (%)
- Highlights dominant state

**`charts/KeywordContributionChart.tsx`**
- Vertical bar chart
- Shows keyword matches per category

**`charts/IntensityTimeline.tsx`**
- Line graph of session intensity over time
- Shows emotional trajectory
- Only visible in review mode

**`services/analysisService.ts`**
- TypeScript API layer
- `analyzeMessage()`: Sends POST to `/analyze`
- `triggerSOS()`: Sends POST to `/sos/trigger`
- Passes session history for trend analysis

**`types/history.ts`**
- Defines `PredictionHistoryItem` interface
- Defines `AnalysisResponse` interface

---

## 5. BACKEND IMPLEMENTATION (DETAILED)

### 5.1 Flask Application Initialization

The backend initializes in `app.py`:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from services.analysis_service import AnalysisService
from services.sos_service import SOSService

app = Flask(__name__)
CORS(app)

analysis_service = AnalysisService()
sos_service = SOSService()
```

CORS is enabled to allow the React frontend (running on a different port during development) to make API requests.

### 5.2 `/analyze` API Endpoint

**Request Schema:**
```json
{
  "message": "I feel extremely overwhelmed and anxious",
  "mode": "user",  // or "review"
  "history": [
    {
      "classified_state": "Normal",
      "intensity_score": 1.2
    },
    {
      "classified_state": "Stress",
      "intensity_score": 2.8
    }
  ]
}
```

**Response Schema (User Mode - Filtered):**
```json
{
  "prediction_result": "Anxiety",
  "classified_state": "Anxiety",
  "precautions": [
    "Try a grounding exercise (name 5 things you see)",
    "Follow a slow breathing prompt (4-7-8 technique)"
  ],
  "autonomous_action": {
    "sos_triggered": false,
    "message": "No emergency action required"
  },
  "agent_response": {
    "agent_message": "It sounds like your thoughts are racing...",
    "suggested_actions": [
      "Try a grounding exercise",
      "Follow a slow breathing prompt"
    ],
    "recommended_focus": "Grounding & Calm",
    "urgency_level": "Medium",
    "agent_tone": "Grounding"
  },
  "mode": "user"
}
```

**Response Schema (Review Mode - Full):**
Includes all of the above PLUS:
```json
{
  "sentiment_analysis": {
    "score": -0.65,
    "label": "Negative"
  },
  "extracted_keywords": ["overwhelmed", "anxious"],
  "intensity_score": 3.2,
  "state_probabilities": {
    "Normal": 5,
    "Anxiety": 75,
    "Stress": 15,
    "Depression": 5,
    "Critical Distress": 0
  },
  "decision_explanation": {
    "dominant_state": "Anxiety",
    "trigger_keywords": ["overwhelmed", "anxious"],
    "keyword_contributions": {
      "Normal": 0,
      "Anxiety": 2,
      "Stress": 1,
      "Depression": 0,
      "Critical Distress": 0
    },
    "sentiment_influence": -0.65,
    "intensity_reasoning": "Moderate emotional intensity...",
    "final_decision_summary": "The message was classified as Anxiety..."
  }
}
```

### 5.3 NLP Preprocessing

No explicit preprocessing is required. TextBlob handles tokenization internally. The system is case-insensitive for keyword matching.

### 5.4 Sentiment Analysis Logic

**Implementation** (`models/sentiment_model.py`):
```python
from textblob import TextBlob

class SentimentAnalyzer:
    def analyze(self, text):
        blob = TextBlob(text)
        score = blob.sentiment.polarity  # -1 to +1
        
        if score > 0.05:
            label = "Positive"
        elif score < -0.05:
            label = "Negative"
        else:
            label = "Neutral"
        
        return {"score": score, "label": label}
```

**Logic**:
- Uses TextBlob's pre-trained sentiment model
- Returns polarity score in range [-1.0, +1.0]
- Applies threshold-based labeling (±0.05 for neutral zone)

### 5.5 Keyword Extraction Logic

**Implementation** (`nlp/keyword_extractor.py`):
```python
import json
import re

class KeywordExtractor:
    def __init__(self):
        with open('data/lexicon.json', 'r') as f:
            self.lexicon = json.load(f)
    
    def extract_keywords(self, text):
        text_lower = text.lower()
        found_keywords = []
        
        for category, keywords in self.lexicon.items():
            for keyword in keywords:
                # Use word boundaries for exact matching
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, text_lower):
                    found_keywords.append(keyword)
        
        return list(set(found_keywords))
```

**Logic**:
- Loads 880-line keyword lexicon at initialization
- Uses regex with word boundaries to avoid partial matches
- Returns unique list of matched keywords

### 5.6 Mental Health State Classification

**Implementation** (`models/state_classifier.py`):

**Step 1: Critical Distress Override**
```python
critical_keywords = ["help", "suicide", "kill myself", "hurt myself"]
if any(kw in text_lower for kw in critical_keywords):
    return "Critical Distress"
```

**Step 2: Keyword Category Matching**
```python
category_matches = {
    "Normal": 0,
    "Stress": 0,
    "Anxiety": 0,
    "Depression": 0,
    "Critical Distress": 0
}

for keyword in extracted_keywords:
    for category, lexicon_words in self.lexicon.items():
        if keyword in lexicon_words:
            category_matches[category] += 1
```

**Step 3: Sentiment-Based Scoring**
```python
scores = {}
for state in category_matches:
    keyword_weight = category_matches[state] * 20  # Each keyword = 20 points
    
    if state == "Normal":
        sentiment_boost = sentiment_score * 30 if sentiment_score > 0 else 0
    else:
        sentiment_boost = abs(sentiment_score) * 30 if sentiment_score < 0 else 0
    
    scores[state] = keyword_weight + sentiment_boost
```

**Step 4: Probability Normalization**
```python
total = sum(scores.values())
if total == 0:
    probabilities = {state: 20 for state in scores}  # Equal distribution
else:
    probabilities = {state: (score / total) * 100 for state, score in scores.items()}

# Ensure probabilities sum to 100%
probabilities = normalize_to_100(probabilities)
```

**Step 5: Determine Dominant State**
```python
dominant_state = max(probabilities, key=probabilities.get)
```

### 5.7 Intensity Score Calculation

**Implementation** (`utils/scoring.py`):
```python
def calculate_intensity(sentiment_score, keyword_count):
    # Base intensity from sentiment
    base_intensity = abs(sentiment_score) * 3  # 0 to 3
    
    # Keyword boost
    keyword_boost = min(keyword_count * 0.3, 2.0)  # Cap at +2
    
    total = base_intensity + keyword_boost
    return round(min(total, 5.0), 2)  # Cap at 5.0
```

**Logic**:
- Sentiment contributes 0-3 points
- Each keyword adds 0.3 points (max +2)
- Final score capped at 5.0
- Higher scores indicate more severe emotional distress

### 5.8 Trend Momentum Analysis (Phase 8)

**Implementation** (`services/analysis_service.py`):
```python
def _analyze_momentum(self, history):
    if not history or len(history) < 2:
        return "Stable"
    
    severity_map = {
        "Normal": 0,
        "Stress": 1,
        "Anxiety": 2,
        "Depression": 3,
        "Critical Distress": 4
    }
    
    recent_history = history[-3:]  # Last 3 interactions
    scores = [severity_map.get(item['classified_state'], 0) for item in recent_history]
    
    if scores[-1] > scores[0]:
        return "Spiraling"
    elif scores[-1] < scores[0]:
        return "Improving"
    else:
        return "Stable"
```

**Logic**:
- Compares the first and last states in a 3-message window
- "Spiraling": Emotional state is worsening
- "Improving": Emotional state is getting better
- "Stable": No significant change

### 5.9 Explainability Layer

The system generates human-readable explanations for every decision:

**Intensity Reasoning:**
```python
if intensity >= 4.0:
    reasoning = f"Critical indicators detected with high volume of risk keywords ({len(keywords)}) and significant negative sentiment ({sentiment_score})."
elif intensity >= 2.5:
    reasoning = f"Moderate emotional intensity characterized by negative sentiment and {len(keywords)} matching emotion keywords."
else:
    reasoning = "Stable emotional state with low keyword density and neutral or positive sentiment."
```

**Final Decision Summary:**
```python
if state == CRITICAL:
    summary = "The message was classified as Critical Distress due to the presence of emergency/crisis indicators."
elif has_keywords:
    summary = f"The message was classified as {state} because of a high concentration of {state}-related keywords and sentiment influence."
else:
    summary = f"The message was classified as {state} based primarily on the overall sentiment score of {sentiment_score}."
```

### 5.10 Agent Response Generation

**Implementation** (`services/agent_service.py`):

**State-to-Message Mapping:**
```python
self.messages = {
    NORMAL: "It's wonderful to hear that you're feeling balanced and stable...",
    STRESS: "I can sense that things feel quite heavy and hectic right now...",
    ANXIETY: "It sounds like your thoughts are racing, and that can feel very overwhelming...",
    DEPRESSION: "I hear how difficult and heavy things feel for you lately...",
    CRITICAL: "I can hear how much pain you're in, and I want you to know that there is support available..."
}
```

**Trend-Based Adaptation (Phase 8):**
```python
def generate_response(self, state, intensity, trend="Stable"):
    base_message = self.messages[state]
    
    prefix = ""
    if trend == "Spiraling" and state in [ANXIETY, DEPRESSION, CRITICAL]:
        prefix = "I've noticed you're feeling more distressed than a few moments ago leading up to this.\n\n"
    elif trend == "Improving" and state in [NORMAL, STRESS]:
        prefix = "It seems like things are starting to settle down a bit for you.\n\n"
    
    final_message = prefix + base_message
    
    return {
        "agent_message": final_message,
        "suggested_actions": self.actions[state],
        "recommended_focus": self.focus_map[state],
        "urgency_level": self.urgency_map[state],
        "agent_tone": self.tone_map[state]
    }
```

**Suggested Actions:**
- **Normal**: "Encourage reflection on what's going well"
- **Stress**: "Take a 10-minute break away from screens"
- **Anxiety**: "Try a grounding exercise (name 5 things you see)"
- **Depression**: "Engage in one gentle activity, like a short walk"
- **Critical**: "Focus on immediate grounding", "Reach out to a trusted contact or emergency service now"

### 5.11 SOS Simulation Logic

**Implementation** (`services/sos_service.py`):
```python
def trigger_sos(self):
    logger.info("!!! SOS TRIGGERED !!!")
    logger.info(f"Notifying contacts: {MOCK_EMERGENCY_CONTACTS}")
    
    return {
        "sos_triggered": True,
        "contacts_notified": MOCK_EMERGENCY_CONTACTS,
        "message": "Emergency response sequence initiated (MOCK)"
    }
```

**Trigger Condition:**
- Classification = "Critical Distress"
- Keywords like "suicide", "kill myself", "hurt myself" detected

**Safety Note:** This is explicitly a **simulation**. No real SMS, calls, or alerts are sent. The system logs the event and displays a UI overlay.

---

## 6. FRONTEND IMPLEMENTATION (DETAILED)

### 6.1 Chat Interface

**Component**: `ChatInterface.tsx`

**Functionality:**
- Textarea for user message input
- Submit button
- Keyboard shortcut (Enter to submit)
- Character limit display (optional)

**User Interaction Flow:**
1. User types message
2. Clicks "Analyze" button
3. Component calls `onAnalysisRequest(message)` prop
4. Parent (`Home.tsx`) handles API call and state updates

### 6.2 API Service Layer

**File**: `services/analysisService.ts`

**Key Functions:**

**`analyzeMessage(message, mode, history)`:**
```typescript
export const analyzeMessage = async (
  message: string, 
  mode: 'user' | 'review' = 'user',
  history: PredictionHistoryItem[] = []
): Promise<AnalysisResponse> => {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ message, mode, history })
  });
  
  if (!response.ok) {
    throw new Error('Analysis failed');
  }
  
  return await response.json();
};
```

**`triggerSOS()`:**
```typescript
export const triggerSOS = async (): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/sos/trigger`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  });
  
  return await response.json();
};
```

### 6.3 Analysis Result Rendering

**Component**: `AnalysisResult.tsx`

**Rendering Logic:**

**Always Visible (User Mode + Review Mode):**
1. Agent Message card (with urgency and tone badges)
2. Sentiment Gauge chart
3. Intensity Meter chart
4. Suggested Actions list
5. ResourceHub (state-specific tools)

**Conditionally Visible:**
- **CalmCircle Trigger Card**: Shows when `isHighStress === true`
  - Condition: `['Stress', 'Anxiety', 'Critical Distress'].includes(state) || intensity > 2.5`
  - Displays gradient card with "Feeling Overwhelmed?" message
  - Clicking opens full-screen CalmCircle overlay

**Only in Review Mode:**
1. State Probability Chart
2. Keyword Contribution Chart
3. Intensity Timeline (session graph)
4. Decision Logic Breakdown text

### 6.4 Session History Tracking

**State Management** (`Home.tsx`):
```typescript
const [history, setHistory] = useState<PredictionHistoryItem[]>([]);

// After each analysis:
const historyItem = {
  message,
  timestamp: new Date().toLocaleTimeString(),
  classified_state: result.classified_state,
  intensity_score: result.intensity_score || 0,
  sentiment_label: result.sentiment_analysis?.label || 'N/A',
  sos_triggered: result.autonomous_action.sos_triggered
};
setHistory(prev => [...prev, historyItem]);
```

**History Display** (`PredictionHistory.tsx`):
- Table with columns: Timestamp, Message (truncated), State, Intensity, Sentiment
- Color-coded states (red for Critical, yellow for Stress/Anxiety, etc.)
- SOS icon for triggered emergencies

---

## 7. VISUALIZATIONS

### 7.1 Sentiment Gauge
**Component**: `SentimentGauge.tsx`

**Chart Type**: Half-pie chart (PieChart from Recharts)

**Data Representation:**
- Maps sentiment score (-1 to +1) to percentage (0% to 100%)
- Color zones:
  - Red (0-33%): Negative sentiment
  - Yellow (33-66%): Neutral sentiment
  - Green (66-100%): Positive sentiment

**Purpose**: Provides immediate visual feedback on emotional tone

**Example:**
- Input: "I am feeling hopeless and sad"
- Sentiment Score: -0.8
- Gauge Position: 10% (deep red zone)

### 7.2 Intensity Meter
**Component**: `IntensityMeter.tsx`

**Chart Type**: Horizontal progress bar

**Data Representation:**
- Intensity score (0-5) mapped to percentage (0-100%)
- Safety zones:
  - Green (0-2.5): Low intensity, stable
  - Yellow (2.5-4.0): Moderate intensity, caution
  - Red (4.0-5.0): High intensity, urgent

**Purpose**: Quantifies emotional severity

**Example:**
- Input: "I am extremely overwhelmed and cannot cope"
- Keywords: 4 matches (overwhelmed, extremely, cannot, cope)
- Sentiment: -0.9
- Intensity: 4.2 → Red zone

### 7.3 State Probability Chart
**Component**: `StateProbabilityChart.tsx`

**Chart Type**: Horizontal bar chart (BarChart from Recharts)

**Data Representation:**
- 5 bars, one per state (Normal, Stress, Anxiety, Depression, Critical Distress)
- Each bar shows percentage (0-100%)
- Dominant state highlighted in darker color

**Purpose**: Shows confidence distribution across all states

**Example:**
- Anxiety: 70% (dominant)
- Stress: 20%
- Depression: 5%
- Normal: 5%
- Critical: 0%

### 7.4 Keyword Contribution Chart
**Component**: `KeywordContributionChart.tsx`

**Chart Type**: Vertical bar chart

**Data Representation:**
- Y-axis: Number of keyword matches
- X-axis: State categories
- Bars show how many keywords from each category were detected

**Purpose**: Explains which categories influenced the classification

**Example:**
- Anxiety keywords: 3 matches
- Stress keywords: 1 match
- Others: 0 matches
- **Conclusion**: High Anxiety keyword density drove the classification

### 7.5 Intensity Timeline
**Component**: `IntensityTimeline.tsx`

**Chart Type**: Line graph (LineChart from Recharts)

**Data Representation:**
- X-axis: Message sequence (1, 2, 3, ...)
- Y-axis: Intensity score (0-5)
- Line connects intensity points across the session

**Purpose**: Shows emotional trajectory over time

**Use Case:**
- Detect spiraling patterns (rising intensity)
- Monitor improvement (falling intensity)
- Identify stability (flat line)

**Example Session:**
```
Message 1: "I'm doing okay" → Intensity 1.2
Message 2: "Work is stressful" → Intensity 2.5
Message 3: "I can't handle this anymore" → Intensity 4.1
```
Graph shows upward trend → "Spiraling" pattern detected

---

## 8. AGENT AUTONOMY & DECISION LOGIC

### 8.1 Autonomous Behavior Definition

The system demonstrates **agent autonomy** through:
1. **Independent Decision-Making**: The agent autonomously determines emotional state without rule-based if statements for every scenario
2. **Contextual Response Generation**: Selects tone, urgency, and actions based on classified state
3. **Proactive Interventions**: Suggests interactive tools (CalmCircle) without explicit user request
4. **Trend Awareness**: Adapts messaging based on session momentum
5. **Safety Overrides**: Automatically triggers SOS for Critical Distress

### 8.2 Urgency Level Determination

**Mapping**:
```python
urgency_map = {
    NORMAL: "Low",
    STRESS: "Medium",
    ANXIETY: "Medium",
    DEPRESSION: "Medium",
    CRITICAL: "High"
}
```

**Rationale**:
- **Low**: No immediate intervention needed
- **Medium**: Monitoring and support recommended
- **High**: Urgent action required

### 8.3 Tone Selection

**Mapping**:
```python
tone_map = {
    NORMAL: "Supportive",      # Encouraging, positive
    STRESS: "Calming",          # Reassuring, grounding
    ANXIETY: "Grounding",       # Present-focused, stabilizing
    DEPRESSION: "Gentle",       # Compassionate, validating
    CRITICAL: "Urgent"          # Direct, safety-focused
}
```

**Purpose**: Ensures agent responses feel contextually appropriate and emotionally intelligent

### 8.4 Suggested Action Logic

Actions are **state-specific** and **evidence-based**:

- **Anxiety**: Grounding techniques (5-4-3-2-1 sensory method)
- **Stress**: Time management (time-boxing, breaks)
- **Depression**: Gentle activation (short walk, self-kindness)
- **Critical**: Immediate safety (grounding, emergency contacts)

### 8.5 Critical Distress Handling

**Detection**:
```python
critical_keywords = [
    "suicide", "kill myself", "hurt myself", "end it", 
    "want to die", "no hope left", "goodbye", "final"
]
```

**Autonomous Actions**:
1. Override classification to "Critical Distress"
2. Set urgency to "High"
3. Trigger SOS simulation
4. Display EmergencyOverlay (full-screen red alert)
5. Provide crisis line numbers (988, Crisis Text Line)
6. Show immediate grounding instructions

**Safety Mechanism**: If SOS is triggered, **no positive reassurance** is given. The agent focuses exclusively on immediate safety.

---

## 9. SAFETY, ETHICS & PRIVACY

### 9.1 No Diagnosis Claim

**Explicit Disclaimer**: The system footer states:
> "This system is a non-clinical mental health support agent. It does not provide medical diagnosis or emergency services."

**Technical Implementation**:
- The system uses the term "classification" not "diagnosis"
- States are descriptive (e.g., "Anxiety") not diagnostic (e.g., "Generalized Anxiety Disorder")
- Agent messages avoid clinical language

### 9.2 No Medical Advice

**Agent Messages**:
- Never prescribe medication
- Never recommend stopping treatment
- Never claim to replace professional care

**Suggested Actions**:
- Focus on coping techniques (breathing, grounding)
- Encourage self-care (walks, journaling)
- Suggest professional resources when appropriate

### 9.3 No Real Emergency Alerts

**SOS Service is Simulated**:
```python
def trigger_sos(self):
    logger.info("!!! SOS TRIGGERED !!!")  # Logged only
    # NO real SMS, NO real calls, NO real alerts
    return {"sos_triggered": True, "message": "Emergency response sequence initiated (MOCK)"}
```

**User Notification**: EmergencyOverlay displays:
> "Note: This is a system simulation."

**Ethical Rationale**: We avoid false security. Users must know this is **not** a replacement for 911 or crisis hotlines.

### 9.4 Client-Side Privacy

**Data Handling**:
- Messages are **not** stored in a database
- No user accounts or authentication
- Session history exists only in browser state (React useState)
- Closing the browser tab deletes all data

**API Privacy**:
- Backend receives message text for processing
- Backend does **not** log messages to files
- No IP tracking, no user fingerprinting

### 9.5 Deterministic Logic

**Why This Matters**:
- No black-box ML model (no unexplainable neural networks)
- Every decision is traceable to keywords + sentiment
- Users can see **exactly why** a state was chosen (via decision_explanation)

**Transparency**:
- Review mode shows full explainability
- Probability distributions reveal confidence
- Keyword contributions show evidence

### 9.6 Ethical Considerations

**Avoiding Harm**:
- Agent messages are **never** judgmental
- No statements like "you should feel better"
- Validating language: "It's okay to feel this way"

**Crisis Resource Accuracy**:
- We provide real crisis line numbers (988, Crisis Text Line)
- We do **not** provide fake or unreachable resources

---

## 10. TESTING & VALIDATION

### 10.1 Backend Test Cases

**File**: `test_backend.py`

**Test Coverage**:

**1. Sentiment Analysis Validation**
```python
# Test: Positive message
Input: "I am feeling okay and having a good day"
Expected: sentiment > 0, label = "Positive"

# Test: Negative message
Input: "Everything feels hopeless and I'm always sad"
Expected: sentiment < 0, label = "Negative"
```

**2. State Classification Validation**
```python
# Test: Normal state
Input: "I am feeling okay and having a good day"
Expected: classified_state = "Normal"

# Test: Stress state
Input: "work is a bit hectic lately"
Expected: classified_state = "Stress"

# Test: Anxiety state
Input: "I feel very worried and can't relax"
Expected: classified_state = "Anxiety"

# Test: Depression state
Input: "Everything feels hopeless and I'm always sad"
Expected: classified_state = "Depression"

# Test: Critical Distress state
Input: "I want to hurt myself, help me please"
Expected: classified_state = "Critical Distress"
Expected: sos_triggered = True
```

**3. Probability Sum Validation**
```python
# For every test message:
prob_sum = sum(state_probabilities.values())
assert abs(prob_sum - 100) < 1  # Must sum to ~100%
```

**4. SOS Trigger Validation**
```python
# Test: Manual SOS trigger
result = sos_service.trigger_sos()
assert result['sos_triggered'] == True
assert 'contacts_notified' in result
```

**5. Trend Analysis Validation** (Phase 8)
```python
# Test: Spiraling trend
history = [
    {'classified_state': 'Normal'},
    {'classified_state': 'Stress'},
    {'classified_state': 'Anxiety'}
]
msg = "I am extremely depressed, sad, and hopeless"
result = service.perform_full_analysis(msg, mode='review', history=history)

# Expected: Agent message includes "I've noticed you're feeling more distressed"
assert "noticed you're feeling more distressed" in result['agent_response']['agent_message']
```

### 10.2 Edge Cases Handled

**Empty Message**:
- Backend returns 400 error: "Message must be a non-empty string"

**No Keyword Matches**:
- System defaults to sentiment-based classification
- If sentiment is neutral, all states get equal probability (20% each)

**Conflicting Keywords**:
- Example: "I'm happy but also anxious"
- System aggregates all keyword matches
- Sentiment score breaks ties

**Very Short Messages**:
- Example: "Help"
- Triggers Critical Distress (keyword match)
- SOS activated

**Very Long Messages**:
- No length limit enforced
- Sentiment analysis handles long text
- Keyword extraction scans entire message

### 10.3 Explainability Validation

**Every response includes**:
- `decision_explanation.intensity_reasoning`: Why intensity score was assigned
- `decision_explanation.final_decision_summary`: Why this state was chosen
- `decision_explanation.keyword_contributions`: Breakdown of matches per category

**Example**:
```json
{
  "intensity_reasoning": "Moderate emotional intensity characterized by negative sentiment and 3 matching emotion keywords.",
  "final_decision_summary": "The message was classified as Anxiety because of a high concentration of Anxiety-related keywords and sentiment influence.",
  "keyword_contributions": {
    "Anxiety": 3,
    "Stress": 1,
    "Depression": 0,
    "Normal": 0,
    "Critical Distress": 0
  }
}
```

---

## 11. LIMITATIONS

### 11.1 Rule-Based System
**Limitation**: The system uses keyword matching and heuristics, not machine learning.
- **Impact**: May miss nuanced emotional expressions
- **Example**: Sarcasm ("Oh great, another wonderful day" → classified as Normal)

### 11.2 English Language Only
**Limitation**: Lexicon and sentiment analysis are English-specific.
- **Impact**: Cannot support multilingual users
- **Missed Populations**: Non-English speakers in crisis

### 11.3 No Long-Term Memory
**Limitation**: Session history resets when browser closes.
- **Impact**: Cannot track long-term patterns (weeks, months)
- **Missed Opportunity**: Cannot identify chronic depression trends

### 11.4 No Clinical Validation
**Limitation**: System has not been validated by mental health professionals.
- **Impact**: Cannot guarantee clinical accuracy
- **Risk**: May misclassify serious conditions

### 11.5 No Real Emergency Response
**Limitation**: SOS is simulated only.
- **Impact**: Users in genuine crisis must still call 911 or crisis lines
- **Ethical Note**: This is intentional to avoid false security

### 11.6 Keyword Dependency
**Limitation**: Classification heavily relies on keyword presence.
- **Impact**: Messages without explicit keywords may be misclassified
- **Example**: "I don't feel like myself anymore" (no strong keywords → may default to Normal)

### 11.7 No Context Across Sessions
**Limitation**: Each browser session is independent.
- **Impact**: Cannot remember previous conversations
- **Example**: User returns next day → agent has no memory

---

## 12. FUTURE SCOPE

### 12.1 Machine Learning Model Integration
**Proposal**: Train a supervised ML model on labeled mental health text data.
- **Benefit**: Better handling of nuanced language
- **Approach**: Use transformer models (BERT, RoBERTa) fine-tuned on mental health datasets

### 12.2 Multilingual Support
**Proposal**: Extend lexicon and sentiment analysis to multiple languages.
- **Languages**: Hindi, Spanish, Mandarin
- **Approach**: Use multilingual BERT or translation APIs

### 12.3 Voice Input Integration
**Proposal**: Allow users to speak instead of type.
- **Benefit**: More natural interaction, accessibility for visually impaired
- **Technology**: Web Speech API or Whisper (OpenAI)

### 12.4 Secure Backend Alert System
**Proposal**: Implement **opt-in** emergency contact notification.
- **Mechanism**: User pre-registers trusted contacts
- **Trigger**: Critical Distress + user confirms SOS
- **Ethics**: Requires explicit consent and HIPAA-compliant storage

### 12.5 Long-Term Trend Analysis
**Proposal**: Implement user accounts with encrypted data storage.
- **Benefit**: Track patterns over weeks/months
- **Visualization**: Monthly intensity heatmaps, state distribution trends
- **Privacy**: End-to-end encryption, user-controlled data deletion

### 12.6 Integration with Wearables
**Proposal**: Combine text analysis with physiological data (heart rate, sleep).
- **Benefit**: Holistic mental health assessment
- **Technology**: Fitbit/Apple Watch APIs

### 12.7 Therapist Dashboard (Clinical Variant)
**Proposal**: Separate clinical version with therapist access.
- **Use Case**: Patients share anonymized reports with therapists
- **Benefit**: Therapists gain insight into patient state between sessions

---

## 13. HOW TO RUN THE PROJECT

### 13.1 Prerequisites
- **Python**: Version 3.8 or higher
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher

### 13.2 Backend Setup

**Step 1: Navigate to backend directory**
```bash
cd backend
```

**Step 2: Install Python dependencies**
```bash
pip install -r requirements.txt
```

**Step 3: Download NLTK data (one-time)**
```bash
python -c "import nltk; nltk.download('punkt')"
```

**Step 4: Run the Flask server**
```bash
python app.py
```

**Expected Output**:
```
* Running on http://localhost:5000
* Debug mode: on
```

**Backend is now live at**: `http://localhost:5000`

### 13.3 Frontend Setup

**Step 1: Navigate to frontend directory**
```bash
cd Frontend
```

**Step 2: Install Node.js dependencies**
```bash
npm install
```

**Step 3: Run the development server**
```bash
npm run dev
```

**Expected Output**:
```
VITE v4.x.x  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Frontend is now live at**: `http://localhost:5173`

### 13.4 Using the Application

**Step 1**: Open browser to `http://localhost:5173`

**Step 2**: Type a message in the chat interface
- Example: "I am feeling very anxious and overwhelmed"

**Step 3**: Click "Analyze"

**Step 4**: View the agent's response, suggested actions, and visualizations

**Step 5**: Toggle "Review Mode" (top-right) to see full technical analysis

**Step 6**: Click "History" to view session predictions

### 13.5 Testing Backend Directly (Optional)

**Using Postman or cURL**:

**Request**:
```bash
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I feel extremely overwhelmed and anxious",
    "mode": "review",
    "history": []
  }'
```

**Response**:
```json
{
  "classified_state": "Anxiety",
  "intensity_score": 3.5,
  "sentiment_analysis": {"score": -0.7, "label": "Negative"},
  ...
}
```

### 13.6 Running Backend Tests

**Step 1**: Navigate to backend directory
```bash
cd backend
```

**Step 2**: Run test script
```bash
python test_backend.py
```

**Expected Output**:
```
--- Testing Message: 'I am feeling okay and having a good day' ---
State: Normal
Sentiment: 0.5 (Positive)
Intensity: 1.2
...

--- Testing Trend Analysis (Spiraling) ---
Current State: Depression
Agent Message: I've noticed you're feeling more distressed...
Trend Logic: VERIFIED (Spiraling detected)

Internal logic test PASSED.
```

---

## 14. CONCLUSION

### 14.1 What We Achieved

We successfully developed a comprehensive mental health support agent that demonstrates:

1. **Intelligent State Classification**: Accurately identifies emotional states using a 880-keyword lexicon and sentiment analysis
2. **Contextual Empathy**: Generates emotionally appropriate responses tailored to user state and session trends
3. **Visual Explainability**: Provides five distinct visualizations to help users understand their emotional patterns
4. **Proactive Support**: Autonomously suggests interactive tools (CalmCircle) and state-specific resources (ResourceHub)
5. **Crisis Detection**: Identifies critical distress and simulates emergency protocols
6. **Complete Transparency**: Every decision is explainable through probability distributions and keyword breakdowns

### 14.2 Why This Project Is Valuable

**Accessibility**: The system provides immediate, judgment-free support to anyone with internet access, breaking down barriers to mental health resources.

**Education**: By visualizing emotional states and explaining classifications, the system helps users develop emotional self-awareness.

**Safety Net**: While not a replacement for professional care, the system can serve as a first touchpoint for individuals unsure where to turn.

**Research Potential**: The explainability layer provides valuable insights into how text-based emotional state detection can work deterministically.

### 14.3 Why This Project Is Safe & Ethical

**Explicit Non-Clinical Positioning**: We make no medical claims. The system is clearly labeled as supportive, not diagnostic.

**Privacy-First Design**: No data storage, no tracking, no user accounts. Complete client-side privacy.

**Simulated Emergency Response**: We avoid false security by clearly marking SOS features as simulated.

**Deterministic Transparency**: Every decision can be traced to specific keywords and sentiment scores, avoiding black-box concerns.

**Validated Resources**: Crisis line numbers (988, Crisis Text Line) are real and active.

### 14.4 Final Remarks

This project represents a meaningful exploration of how AI agents can provide supportive, explainable, and ethical mental health guidance. While we acknowledge the system's limitations—particularly its rule-based nature and lack of clinical validation—we believe it demonstrates the potential for technology to augment (not replace) mental health support infrastructure.

The system's deterministic design ensures that every output is traceable, every decision is explainable, and every user interaction is grounded in evidence-based coping strategies. As mental health awareness grows globally, systems like this can serve as accessible, immediate, and privacy-preserving first touchpoints for individuals seeking support.

We hope this project contributes to the broader conversation about ethical AI in mental health, demonstrating that powerful support systems can be built without sacrificing transparency, safety, or user privacy.

---

**Project Developed By**: [Your Name]  
**Institution**: [Your Institution]  
**Year**: 2025-2026  
**Category**: Major Project - Advanced Agentic AI Systems  

---

**End of Documentation**
