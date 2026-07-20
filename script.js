const map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('assets/countries.geojson')
    .then(res => res.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                layer.on('click', () => {
                    console.log(feature.properties.name, feature.properties.iso_a2);
                });
            }
        }).addTo(map);
    });