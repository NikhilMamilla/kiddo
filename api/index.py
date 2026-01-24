import os
import nltk
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add local nltk_data path for Vercel deployment
nltk_data_path = os.path.join(os.path.dirname(__file__), 'nltk_data')
if os.path.exists(nltk_data_path):
    if nltk_data_path not in nltk.data.path:
        nltk.data.path.append(nltk_data_path)
    logger.info(f"NLTK data path added: {nltk_data_path}")
else:
    logger.warning(f"NLTK data path not found: {nltk_data_path}")

app = Flask(__name__)
CORS(app)

# Initialize services with error handling for easier debugging
init_error = None
try:
    from services.analysis_service import AnalysisService
    from services.sos_service import SOSService
    analysis_service = AnalysisService()
    sos_service = SOSService()
    logger.info("Services initialized successfully")
except Exception as e:
    init_error = str(e)
    logger.error(f"Error initializing services: {init_error}")
    analysis_service = None
    sos_service = None

@app.route('/analyze', methods=['POST'])
def analyze():
    if not analysis_service:
        return jsonify({
            "error": "Backend services failed to initialize.",
            "details": init_error,
            "path": os.getcwd(),
            "contents": os.listdir('.')
        }), 500
    """
    Main endpoint for mental health text analysis.
    """
    data = request.get_json()
    
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' field in request body"}), 400
        
    message = data['message']
    mode = data.get('mode', 'user')
    history = data.get('history', [])
    
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "Message must be a non-empty string"}), 400
        
    try:
        result = analysis_service.perform_full_analysis(message, mode, history)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/sos/trigger', methods=['POST'])
def trigger_sos():
    if not sos_service:
        return jsonify({"error": "SOS service failed to initialize. Check logs."}), 500
    """
    Manual SOS trigger endpoint.
    """
    try:
        data = request.get_json() or {}
        emergency_contacts = data.get('emergency_contacts', [])
        
        result = sos_service.trigger_sos(emergency_contacts)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    # Using 0.0.0.0 to make it accessible outside container if needed
    app.run(host='0.0.0.0', port=5000, debug=True)
