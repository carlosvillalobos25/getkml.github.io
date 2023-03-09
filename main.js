document.getElementById("button-clear-data").addEventListener("click", function() { clearData() });
document.getElementById("button-get-kml").addEventListener("click", function() { getKml() });

const map = L.map('map').setView([28.18, -105.47], 11);

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var currentPoint = null

function onLocationFound(e) {
    currentPoint = L.marker(e.latlng).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

function onClickMap(e) {
    deleteMarker();
    currentPoint = L.marker(e.latlng).addTo(map);
}

function deleteMarker() {
    map.eachLayer(layer => {
        if (layer != tiles) {
            layer.remove();
        }
    });
    currentPoint = null
}

function clearData() {
    deleteMarker();
    map.locate({setView: true, maxZoom: 13});
}

function getKml() {
    let geojsonObject = currentPoint.toGeoJSON();
    let kml = tokml(geojsonObject);
    let name = new Date(Date.now()).toISOString().concat(".kml") ;
    var blob = new Blob([kml], {type: "text/plain;charset=uft-8",});
    saveAs(blob, name);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
map.on('click', onClickMap);
map.locate({setView: true, maxZoom: 13});