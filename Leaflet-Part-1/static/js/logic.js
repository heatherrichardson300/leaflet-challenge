// Create the 'basemap' tile layer that will be the background of our map.

let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [39.9293, -98.5795],
  zoom: 5
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap);

// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth > 90) return '#FF0000';         // red
    else if (depth > 70) 
      return '#FF4500';                       // orange-red
    else if (depth > 50) 
      return '#FFA500';                       // orange
    else if (depth > 30) 
      return '#FFAE42';                       // yellow-orange
    else if (depth > 10) 
      return '#9ACD32';                       // yellow-green
    else return '#90EE90';                    // light-green
}
  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude === 0 ? 1 :
    magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
    }
  }).addTo(myMap);


  // Create a legend control object.
  let legend = L.control({position: "bottomright"});

    // Then add all the details for the legend
  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      
      // Initialize depth intervals and colors for the legend
      let depth = [-10, 10, 30, 50, 70, 90]

      // Loop through our depth intervals to generate a label with a colored square for each interval.
      for (let i = 0; i < depth.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + 
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
      }     
      return div;
    };
    // Finally, add the legend to the map.
    legend.addTo(myMap)

});

