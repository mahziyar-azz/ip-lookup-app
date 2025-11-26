document.addEventListener('DOMContentLoaded', () => {
    // --- Variables ---
    const form = document.getElementById('lookup-form');
    const input = document.getElementById('ip-input');
    const btnMyIp = document.getElementById('btn-my-ip');
    const resultsArea = document.getElementById('results-area');
    const loader = document.getElementById('loader');
    const errorMsg = document.getElementById('error-msg');
    const themeBtn = document.getElementById('theme-toggle');
    
    let map = null;
    let marker = null;
    let currentTileLayer = null; // Track the tile layer to switch themes

    // Tile URLs
    const TILES = {
        light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    };

    const ATTRIBUTIONS = {
        light: '© OpenStreetMap',
        dark: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    };

    // --- Theme Handling ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        themeBtn.innerHTML = isDark 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
            
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Update map tiles immediately if map exists
        if (map) {
            updateTileLayer(isDark);
        }
    });

    // --- Event Listeners ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const ip = input.value.trim();
        fetchIpData(ip);
    });

    btnMyIp.addEventListener('click', () => {
        input.value = ''; // Clear input for visual clarity
        fetchIpData(''); // Empty string triggers "my ip" logic in backend
    });

    // --- API Logic ---
    async function fetchIpData(ip) {
        // Reset UI
        errorMsg.classList.add('hidden');
        resultsArea.classList.add('hidden');
        loader.classList.remove('hidden');

        try {
            const response = await fetch('/api/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip: ip })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.reason || 'Failed to fetch IP data.');
            }

            renderResults(data);

        } catch (error) {
            console.error(error);
            showError(error.message);
        } finally {
            loader.classList.add('hidden');
        }
    }

    // --- Rendering Logic ---
    function renderResults(data) {
        // 1. Update Text Fields
        setText('res-ip', data.ip);
        setText('res-country', `${data.country_name} (${data.country_code})`);
        
        // --- NEW FIELDS ---
        setText('res-capital', data.country_capital);

        // Continent mapping
        const continentNames = {
            "AF": "Africa",
            "AN": "Antarctica",
            "AS": "Asia",
            "EU": "Europe",
            "NA": "North America",
            "OC": "Oceania",
            "SA": "South America"
        };
        const cCode = data.continent_code;
        // If name exists in map, show "Name (Code)", otherwise just show Code
        const cDisplay = continentNames[cCode] ? `${continentNames[cCode]} (${cCode})` : cCode;
        setText('res-continent', cDisplay);

        setText('res-version', data.version);
        // ------------------

        setText('res-city', data.city);
        setText('res-region', `${data.region} (${data.region_code})`);
        setText('res-postal', data.postal);
        setText('res-coords', `${data.latitude}, ${data.longitude}`);
        
        setText('res-asn', data.asn);
        setText('res-org', data.org); // This populates the "ISP" row
        setText('res-host', data.hostname || 'N/A');

        setText('res-timezone', data.timezone);
        setText('res-currency', `${data.currency_name} (${data.currency})`);
        setText('res-callcode', data.country_calling_code);
        
        // Format population with commas
        const pop = data.country_population ? data.country_population.toLocaleString() : 'N/A';
        setText('res-pop', pop);

        // 2. Update Flag
        const flagImg = document.getElementById('res-flag');
        if (data.country_code) {
            flagImg.src = `https://flagcdn.com/w80/${data.country_code.toLowerCase()}.png`;
            flagImg.classList.remove('hidden');
        } else {
            flagImg.classList.add('hidden');
        }

        // 3. Show Container
        resultsArea.classList.remove('hidden');

        // 4. Update Map (after container is visible so Leaflet calculates size correctly)
        updateMap(data.latitude, data.longitude);
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value || 'N/A';
    }

    function showError(msg) {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }

    // --- Map Logic ---
    function updateMap(lat, lng) {
        if (!lat || !lng) return;

        // Initialize map if not exists
        if (!map) {
            map = L.map('map').setView([lat, lng], 13);
            
            // Initial Tile Load based on current theme
            const isDark = document.body.classList.contains('dark-mode');
            updateTileLayer(isDark);

        } else {
            map.setView([lat, lng], 13);
        }

        // Update Marker
        if (marker) {
            marker.setLatLng([lat, lng]);
        } else {
            marker = L.marker([lat, lng]).addTo(map);
        }
        
        // Fix Leaflet grey tile issue on dynamic show
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }

    function updateTileLayer(isDark) {
        // If a layer exists, remove it
        if (currentTileLayer) {
            map.removeLayer(currentTileLayer);
        }

        const url = isDark ? TILES.dark : TILES.light;
        const attrib = isDark ? ATTRIBUTIONS.dark : ATTRIBUTIONS.light;

        currentTileLayer = L.tileLayer(url, {
            maxZoom: 19,
            attribution: attrib
        }).addTo(map);
    }

    // --- COPY TO CLIPBOARD LOGIC ---
    window.copyText = function(container) {
        const textSpan = container.querySelector('.text-val');
        const tooltip = container.querySelector('.tooltip');
        
        if (!textSpan || !tooltip) return;

        const textToCopy = textSpan.textContent;

        if (!textToCopy || textToCopy === '---' || textToCopy === 'N/A' || textToCopy === '-') return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                showTooltip(tooltip);
            }).catch(err => console.error('Copy failed', err));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            showTooltip(tooltip);
        }
    };

    function showTooltip(tooltipEl) {
        tooltipEl.classList.add('show');
        setTimeout(() => {
            tooltipEl.classList.remove('show');
        }, 2000);
    }
});