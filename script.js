const map = L.map('map').setView([0, 0], 3);

let currentAudio = null;

function playStationForCountry(countryCode) {
    fetch(`https://de1.api.radio-browser.info/json/stations/bycountrycodeexact/${countryCode}`)
        .then(res => res.json())
        .then(stations => {
            if (stations.length === 0) {
                console.log('No stations found for', countryCode);
                return;
            }

            if (currentAudio) {
                currentAudio.pause();
            }

            const station = stations[0];
            currentAudio = new Audio(station.url_resolved);
            currentAudio.play();
            console.log('Playing', station.name, 'from', countryCode);
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
                    console.log(feature.properties.name, feature.properties.iso_a2);
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