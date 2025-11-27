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
    input_ip = data.get('ip', '').strip()
    
    target_ip = None

    if input_ip:
        # Case 1: User typed a specific IP
        target_ip = input_ip
    else:
        # Case 2: User clicked "Use My IP"
        # We must find the user's real IP from the request headers.
        
        # 'X-Forwarded-For' is a standard header used by proxies (like Vercel/Heroku/AWS)
        # to identify the original IP address of the client connecting to the web server.
        if request.headers.get('X-Forwarded-For'):
            # The header can contain multiple IPs (client, proxy1, proxy2...). 
            # We want the first one (the actual client).
            target_ip = request.headers.get('X-Forwarded-For').split(',')[0].strip()
        else:
            # Fallback: If no proxy header, use the direct connection IP
            target_ip = request.remote_addr

        # SPECIAL HANDLING FOR LOCALHOST DEVELOPMENT:
        # If you are running this locally, your IP might look like '127.0.0.1'.
        # ipapi.co cannot lookup '127.0.0.1' because it is not a public IP.
        # In this specific case, we set target_ip back to None, so services.py 
        # performs a "self-lookup" (using your machine's internet connection).
        if target_ip == '127.0.0.1':
            target_ip = None

    # Call the service
    result = get_ip_info(target_ip)
    
    if result.get('error'):
        return jsonify(result), 400
        
    return jsonify(result)

if __name__ == '__main__':
    # Run the app
    app.run(debug=True, port=5000)