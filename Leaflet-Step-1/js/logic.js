// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// create initial map object
var myMap = L.map("mapid", {
  center: [37.7749, -97.4194],
  zoom: 4,
  layer: [streetmap, darkmap]
});

streetmap.addTo(myMap);
// darkmap.addTo(myMap);

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
d3.json(queryUrl, function(data) {
  
  function mapStyling(features) {
    return {
      opacity: 1,
      fillColor: mapColor(features.properties.mag),
      fillOpacity: 1,
      color: "white",
      radius: mapRadius(features.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  function mapColor(mag) {
    switch (true) {
      case mag > 5:
        return "#D10B0B";
      case mag > 4:
        return "#FF3002";
      case mag > 3:
        return "#FF510B";
      case mag > 2:
        return "#FA972D";
      case mag > 1:
        return "#F7FE1B";
      default:
        return "#00DF14";
    }
  }  
  function mapRadius(mag) {
    if (mag === 0) {
      return 1;
    }    
    else {
      return mag * 2;
    }
  }
  L.geoJson(data, {
    pointToLayer: function(features, latlng) {
      return L.circleMarker(latlng);
    },

    style: mapStyling,
    onEachFeature: function(features, layer) {
      layer.bindPopup("Magnitude: " + features.properties.mag + "<br>Location: " + features.properties.place);

    }
  }).addTo(myMap);

  // Create legend
  var legend = L.control({
    position: "bottomleft"
});

legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5];

// Create legend
for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + mapColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
return div;
};
legend.addTo(myMap);
  });
