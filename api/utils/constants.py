# Mental Health States
NORMAL = "Normal"
ANXIETY = "Anxiety"
STRESS = "Stress"
DEPRESSION = "Depression"
CRITICAL = "Critical Distress"

ALLOWED_STATES = [NORMAL, ANXIETY, STRESS, DEPRESSION, CRITICAL]

# Thresholds
SENTIMENT_THRESHOLD_NEGATIVE = -0.2
SENTIMENT_THRESHOLD_POSITIVE = 0.2
INTENSITY_THRESHOLD_CRITICAL = 4.0

# Precautions Mapping
PRECAUTIONS = {
    NORMAL: [
        "Maintain a healthy sleep schedule",
        "Keep up with your regular routine",
        "Engage in hobbies you enjoy"
    ],
    ANXIETY: [
        "Practice grounding exercises (5-4-3-2-1 technique)",
        "Reduce caffeine intake",
        "Talk to a trusted person about your worries",
        "Try deep breathing exercises"
    ],
    STRESS: [
        "Take regular breaks during work",
        "Identify and prioritize your tasks",
        "Try a 10-minute meditation",
        "Ensure you're getting adequate physical activity"
    ],
    DEPRESSION: [
        "Set small, achievable daily goals",
        "Try to spend some time outdoors",
        "Reach out to a mental health professional",
        "Avoid isolation; connect with loved ones"
    ],
    CRITICAL: [
        "Contact an emergency service immediately",
        "Reach out to a crisis hotline (e.g., 988 in the US)",
        "Stay with someone you trust",
        "Remove any dangerous items from your vicinity"
    ]
}

# SOS Configuration
MOCK_EMERGENCY_CONTACTS = ["Emergency Contact 1", "Emergency Contact 2"]
