from utils.constants import NORMAL, ANXIETY, STRESS, DEPRESSION, CRITICAL

class AgentService:
    def __init__(self):
        # State-based message templates (Empathetic & Non-clinical)
        self.messages = {
            NORMAL: "It's wonderful to hear that you're feeling balanced and stable.\n\nKeeping up with your positive habits will help you maintain this clarity and energy.\n\nYou're doing great, keep it up!",
            STRESS: "I can sense that things feel quite heavy and hectic right now.\n\nIt's important to remember that you don't have to carry everything at once. Let's try to take things one step at a time.\n\nYou've got this, and I'm here to listen.",
            ANXIETY: "It sounds like your thoughts are racing, and that can feel very overwhelming and scary.\n\nI'm right here with you. Let's focus on finding a small moment of calm together.\n\nDeep breaths—we can handle this together.",
            DEPRESSION: "I hear how difficult and heavy things feel for you lately.\n\nIt's okay to feel this way, and I want you to know that your feelings are valid. You don't have to face this alone.\n\nYou matter, and I'm glad you're sharing this with me.",
            CRITICAL: "I can hear how much pain you're in, and I want you to know that there is support available.\n\nYour safety is the most important thing right now. Please lean on those who can help you through this.\n\nYou are not alone—please stay with me."
        }

        # Suggested actions mapping
        self.actions = {
            NORMAL: [
                "Encourage reflection on what's going well",
                "Maintain your current healthy routine",
                "Try a 5-minute gratitude journaling session"
            ],
            STRESS: [
                "Take a 10-minute break away from screens",
                "Try time-boxing your tasks to avoid feeling overwhelmed",
                "Practice a quick muscle relaxation exercise"
            ],
            ANXIETY: [
                "Try a grounding exercise (name 5 things you see)",
                "Follow a slow breathing prompt (4-7-8 technique)",
                "Reduce environmental stimulation (dim lights, quiet space)"
            ],
            DEPRESSION: [
                "Engage in one gentle activity, like a short walk",
                "Practice self-kindness; talk to yourself like a friend",
                "Reach out to a trusted person just to say hello"
            ],
            CRITICAL: [
                "Focus on immediate grounding (feel your feet on the floor)",
                "Reach out to a trusted contact or emergency service now",
                "Remember that this intense feeling will pass with support",
                "Stay in a safe, well-lit place with people if possible"
            ]
        }

        # Focus recommendations
        self.focus_map = {
            NORMAL: "Maintenance & Growth",
            STRESS: "Rest & Prioritization",
            ANXIETY: "Grounding & Calm",
            DEPRESSION: "Self-Compassion & Connection",
            CRITICAL: "Safety & Immediate Support"
        }

        # Urgency mapping
        self.urgency_map = {
            NORMAL: "Low",
            STRESS: "Medium",
            ANXIETY: "Medium",
            DEPRESSION: "Medium",
            CRITICAL: "High"
        }

        # Tone mapping
        self.tone_map = {
            NORMAL: "Supportive",
            STRESS: "Calming",
            ANXIETY: "Grounding",
            DEPRESSION: "Gentle",
            CRITICAL: "Urgent"
        }

    def generate_response(self, state, intensity, trend="Stable"):
        """
        Generates a deterministic, empathetic agent response based on the detected state and session trend.
        """
        base_message = self.messages.get(state, self.messages[NORMAL])
        
        # Contextual prefix based on trend
        prefix = ""
        if trend == "Spiraling" and state in [ANXIETY, DEPRESSION, CRITICAL]:
            prefix = "I've noticed you're feeling more distressed than a few moments ago leading up to this.\n\n"
        elif trend == "Improving" and state in [NORMAL, STRESS]:
            prefix = "It seems like things are starting to settle down a bit for you.\n\n"
            
        final_message = prefix + base_message

        return {
            "agent_message": final_message,
            "suggested_actions": self.actions.get(state, self.actions[NORMAL]),
            "recommended_focus": self.focus_map.get(state, self.focus_map[NORMAL]),
            "urgency_level": self.urgency_map.get(state, self.urgency_map[NORMAL]),
            "agent_tone": self.tone_map.get(state, self.tone_map[NORMAL])
        }
