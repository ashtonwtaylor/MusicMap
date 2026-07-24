const map = L.map('map').setView([0, 0], 3);

let currentAudio = null;

function playStation(station) {
    if (currentAudio) {
        currentAudio.pause();
    }

    const nowPlaying = document.getElementById('now-playing-name');
    const errorSpan = document.getElementById('player-error');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');

    errorSpan.textContent = '';
    nowPlaying.textContent = `Loading: ${station.name}...`;

    currentAudio = new Audio(station.url_resolved);
    currentAudio.volume = volumeSlider.value;

    currentAudio.addEventListener('playing', () => {
        nowPlaying.textContent = station.name;
        playPauseBtn.textContent = 'Pause';
    });

    currentAudio.addEventListener('error', () => {
        errorSpan.textContent = `Unable to play "${station.name}" - stream currently unavailable. Try another station, or try this one again later.`;
        nowPlaying.textContent = 'No station currently playing.';
    });

    currentAudio.play().catch((err) => {
        if (err.name === 'NotAllowedError') {
            errorSpan.textContent = `Playback blocked by your browser — try clicking the station again.`;
        } else {
            errorSpan.textContent = `Unable to play "${station.name}" — ${err.message}`;
        }
    });
}

function showStationsForCountry(countryName, countryCode) {
    const url = `https://de1.api.radio-browser.info/json/stations/search?countrycode=${countryCode}&order=clickcount&reverse=true&limit=15`;

    fetch(url)
        .then(res => res.json())
        .then(stations => {
            const panel = document.getElementById('station-panel');
            const list = document.getElementById('station-list');
            const heading = document.getElementById('country-name');

            heading.textContent = countryName;
            list.innerHTML = '';

            if (stations.length === 0) {
                list.innerHTML = '<li>No stations found</li>';
                panel.style.display = 'block';
                return;
            }
            
            stations.forEach(station => {
                const item = document.createElement('li');
                item.textContent = station.name;
                item.addEventListener('click', () => playStation(station));
                list.appendChild(item);
            });

            panel.style.display = 'block';
        });
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('assets/countries.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            style: {
                fillColor: '#3388ff',
                fillOpacity: 0.3,
                color: '#333',
                weight: 1
            },
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    showStationsForCountry(feature.properties.name, feature.properties.iso_a2);
                });
                layer.on('mouseover', () => {
                    layer.setStyle({ fillOpacity: 0.6 });
                });
                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.3 });
                });
            }
        }).addTo(map);
    });