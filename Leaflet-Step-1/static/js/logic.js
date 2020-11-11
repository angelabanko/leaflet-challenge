var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var equake;

// Perform a GET request to the query URL
d3.json(earthquakeURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + "Magnitude  " + feature.properties.mag +
        "</h3><hr><p>" + "Earthquake Location:  " + feature.properties.place + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    
    var earthquakes = L.geoJSON(earthquakeData, {
  
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: colorRange(feature.properties.mag),
          color: "pink",
          weight: 0.5,
          opacity: 0.5,
          fillOpacity: 0.8
        });
      },
  
      // Run the onEachFeature function once for each piece of data in the array
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
    console.log(earthquakes)
  }

console.log(earthquakes)

// Define function to run "onEach" feature 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .5,
              color: "black",
              stroke: true,
              weight: .8
          })
        }
        
        });

    equake = createMap(earthquakes);
}

var myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 5
});

// Define the map layers
var airmap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + 
     "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA").addTo(myMap);
    


var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA").addTo(myMap);

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA").addTo(myMap);
        
// Define base maps
var baseMaps = {
    "LightMap": lightMap,
    "AirMap": airmap,
    "Satellite": satellite
};

// Create tectonic layer
var tectonicPlates = new L.LayerGroup();

//Create overlay object to hold overlay layer
var overlayMaps = {
    "Earthquakes": equake,
    "Tectonic Plates": tectonicPlates
};

// Add tectonic plates data
d3.json(tectonicPlatesURL, function(tectonicData) {
    L.geoJson(tectonicData, {
        color: "blue",
        weight: 2
    })
    .addTo(tectonicPlates);
});

//Add layer control to map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// Create legend
var legend = L.control({
    position: "bottomleft"
});
  
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

// Create legend
for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
  
// Create color function
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'lightgreen'
    } else if (magnitude > 1) {
        return 'green'
    } else {
        return 'magenta'
    }
};

//Create radius function
function getRadius(magnitude) {
    return magnitude * 20000;
};

        