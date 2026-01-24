import logging
import os
from twilio.rest import Client
from utils.constants import MOCK_EMERGENCY_CONTACTS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SOSService:
    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.from_number = os.getenv("TWILIO_PHONE_NUMBER")
        
        self.client = None
        if self.account_sid and self.auth_token:
            try:
                self.client = Client(self.account_sid, self.auth_token)
            except Exception as e:
                logger.error(f"Failed to initialize Twilio Client: {e}")

    def trigger_sos(self, emergency_contacts=None):
        """
        Triggers SOS alert via Twilio SMS.
        """
        logger.info("!!! SOS TRIGGERED !!!")
        contacts = emergency_contacts if emergency_contacts else MOCK_EMERGENCY_CONTACTS
        
        results = []
        if self.client and self.from_number:
            for contact in contacts:
                try:
                    name = contact.get('name', 'Contact')
                    phone = contact.get('phone')
                    
                    if phone:
                        message = self.client.messages.create(
                            body=f"🚨 EMERGENCY ALERT: This is an automated message from KIDDOO. The user has triggered a mental health SOS. Status: Critical. Please check on them immediately.",
                            from_=self.from_number,
                            to=phone
                        )
                        logger.info(f"SMS sent to {name} ({phone}): {message.sid}")
                        results.append({"name": name, "status": "sent", "sid": message.sid})
                except Exception as e:
                    logger.error(f"Failed to send SMS to {contact}: {e}")
                    results.append({"name": name, "status": "failed", "error": str(e)})
        else:
            logger.warning("Twilio not configured. Using Mock Logic.")
            results = [{"name": c.get('name', 'Mock'), "status": "mock_sent"} for c in contacts]

        return {
            "sos_triggered": True,
            "contacts_notified": results,
            "message": "Emergency response sequence initiated"
        }

    def no_action(self):
        return {
            "sos_triggered": False,
            "message": "No emergency action required"
        }
