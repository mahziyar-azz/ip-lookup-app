import requests

def get_ip_info(ip_address=None):
    """
    Queries ipapi.co for IP information.
    If ip_address is None, it queries for the caller's IP.
    """
    try:
        # Construct URL based on whether a specific IP is requested
        if ip_address:
            url = f"https://ipapi.co/{ip_address}/json/"
        else:
            url = "https://ipapi.co/json/"

        headers = {'User-Agent': 'Flask-IP-Lookup-App/1.0'}
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Basic validation to check if API returned an error (ipapi returns 'error': true sometimes)
        if data.get('error'):
            return {'error': True, 'reason': data.get('reason', 'Unknown API error')}
            
        return data

    except requests.exceptions.RequestException as e:
        return {'error': True, 'reason': str(e)}
    except Exception as e:
        return {'error': True, 'reason': 'Internal server error'}