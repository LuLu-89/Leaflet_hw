// Tile layer: 
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY,
});

// Satellite layer:
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY,
});

// Grayscale layer:
var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY,
});


// Create a map object with layers:
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    // layers: [outdoors, earthquakes]
});

// URL for earthquakes
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Get request for url:
d3.json(url, (err, data) => {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3> ${feature.properties.place} </h3> 
        <p>${new Date(feature.properties.time)}</p>
        <p>Magnitude: ${feature.properties.mag}</p>`);

    }

    // geoJSON layer 
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: (feature, latlng) => {

            var geojson = {
                radius: (magnitude) => {
                    if (magnitude == 0) {
                        return 1;
                    }
                    return magnitude * 5;
                },
                fillColor: (magnitude) => {
                    switch (true) {
                        case magnitude > 9:
                            return "#ff9b00";
                        case magnitude > 8:
                            return "#ffb800";
                        case magnitude > 7:
                            return "#ffcc00";
                        case magnitude > 6:
                            return "#ffe500";
                        case magnitude > 5:
                            return "#fff900";
                        case magnitude > 4:
                            return "#d7f900";
                        case magnitude > 3:
                            return "#beff00";
                        default:
                            return "#8dff00";
                    }
                },
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            };


            return L.circleMarker(latlng, geojson);
        }
    });

    // Define baseMap: 
    var baseMaps = {
        Outdoors: outdoors,
        Satellite: satellite,
        Grayscale: grayscale
    }

    // Overlay object:
    var overlayMap = {
        Earthquakes: earthquakes
    };

    // Layer control:
    L.control.layers(baseMaps, overlayMap).addTo(myMap);

    // Legend: 
    var legend = L.control({
        position: 'bottomright'
    });
    legend.onAdd = function () {
        var colorlist = geojson.options.colors.map(color => {
            return `<li style="background-color:${color}"></li>`;
        });

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML = `${legendInfo}
    <ul>
        ${colorlist.join('')}
    </ul>`
        return div;
    }
    legend.addTo(myMap);
};
// };
