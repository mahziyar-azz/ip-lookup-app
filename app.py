from flask import Flask, render_template, request, jsonify
from services import get_ip_info

app = Flask(__name__)

@app.route('/')
def index():
    """Renders the main page."""
    return render_template('index.html')

@app.route('/api/lookup', methods=['POST'])
def lookup_ip():
    """
    API Endpoint to handle IP lookups.
    Expects JSON payload: {"ip": "1.2.3.4"} or {"ip": ""} (for self lookup)
    """
    data = request.get_json()
    ip_address = data.get('ip', '').strip()
    
    # If ip_address is empty string, pass None to service to trigger "my ip" lookup
    target_ip = ip_address if ip_address else None
    
    result = get_ip_info(target_ip)
    
    if result.get('error'):
        return jsonify(result), 400
        
    return jsonify(result)

if __name__ == '__main__':
    # Run the app
    app.run(debug=True, port=5000)