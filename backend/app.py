from flask import Flask, request, jsonify
from flask_cors import CORS
from services.analysis_service import AnalysisService
from services.sos_service import SOSService

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration later

analysis_service = AnalysisService()
sos_service = SOSService()

@app.route('/analyze', methods=['POST'])
def analyze():
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
    """
    Manual SOS trigger endpoint.
    """
    try:
        result = sos_service.trigger_sos()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    # Using 0.0.0.0 to make it accessible outside container if needed
    app.run(host='0.0.0.0', port=5000, debug=True)
