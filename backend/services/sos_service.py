import logging
from utils.constants import MOCK_EMERGENCY_CONTACTS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SOSService:
    def trigger_sos(self):
        """
        Mocked SOS trigger. Does not send real messages.
        """
        logger.info("!!! SOS TRIGGERED !!!")
        logger.info(f"Notifying contacts: {MOCK_EMERGENCY_CONTACTS}")
        
        return {
            "sos_triggered": True,
            "contacts_notified": MOCK_EMERGENCY_CONTACTS,
            "message": "Emergency response sequence initiated (MOCK)"
        }

    def no_action(self):
        return {
            "sos_triggered": False,
            "message": "No emergency action required"
        }
