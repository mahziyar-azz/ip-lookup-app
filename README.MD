# 🌍 IP GeoLocate

A modern, full-stack Flask application that provides detailed geolocation data for any IP address. It features a responsive UI, dark/light mode, interactive maps via Leaflet.js, and copy-to-clipboard functionality.

## ✨ Features

* 🔍 **IP Lookup:** Instantly fetch data for IPv4/IPv6 addresses.
* 📡 **Auto-Locate:** "Use My IP" button to detect the user's current location.
* 🗺️ **Interactive Map:** Visualizes the location using Leaflet.js with:

  * 📍 Custom markers.
  * 🌓 Dark Mode Support: Automatically switches to CartoDB Dark Matter tiles when dark mode is active.
* 📊 **Data Rich:** Displays ISP, ASN, Continent, Capital, Currency, Timezone, and more.
* 🎛️ **UX Enhancements:**

  * 🌗 Dark/Light Theme: Persists user preference via LocalStorage.
  * 📋 Click-to-Copy: Tap any data point to copy it to the clipboard with a toast notification.
  * 📱 Responsive: Mobile-first design that stacks elegantly on smaller screens.

## 🛠️ Tech Stack

* **Backend:** Python, Flask
* **Frontend:** HTML5, CSS3 (Custom Variables), JavaScript (ES6+)
* **Map API:** Leaflet.js (OpenStreetMap / CartoDB tiles)
* **Data API:** ipapi.co
* **Icons:** FontAwesome 6

## 🚀 Installation & Setup

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/flask-ip-lookup.git
cd flask-ip-lookup
```

### Create a Virtual Environment (Optional but recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
python app.py
```

### View in Browser

Open [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 📂 Project Structure

```
/
├── app.py              # Flask Application Entry Point
├── services.py         # API Request Logic
├── requirements.txt    # Python Dependencies
├── static/
│   ├── css/
│   │   └── style.css   # Main Stylesheet (Theming)
│   └── js/
│       └── main.js     # Frontend Logic (Map, API, Copy)
└── templates/
    ├── base.html       # Base Template (Head, Scripts)
    └── index.html      # Main UI Interface
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source.
