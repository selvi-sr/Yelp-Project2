
var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});


// Creating map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  //center: [180,-180],
  zoom: 5
});

// Adding our 'graymap' tile layer to the map.
outdoors.addTo(myMap);

// We create the layers for our two different sets of data, restaurant and
// heat.
var grpHeat = new L.LayerGroup();
var restaurant = new L.LayerGroup();

// Defining an object that contains all of our different map choices. Only one
// of these maps will be visible at a time!
var baseMaps = {
  Satellite: satellitemap,
  Grayscale: graymap,
  Outdoors: outdoors
};

// We define an object that contains all of our overlays. Any combination of
// these overlays may be visible at the same time!
var overlays = {
  "Heat Map": grpHeat,
  Restaurants: restaurant
};

// Then we add a control to the map that will allow the user to change which
// layers are visible.
L.control
  .layers(baseMaps, overlays//, {collapsed: false}
    )
  .addTo(myMap);

// Load in geojson data
var geoData = "./Biz_Food_USA/Biz_Food_NA.geojson";

var geojson;

// Grab data with d3
d3.json(geoData, function (data) {
  console.log(data);
  function style(feature) {
    return {
      opacity: 0.5,
      fillOpacity: 0.9,
      fillColor: color(feature.properties.stars),
      color: "#000000",
      radius: radius(feature.properties.stars),
      stroke: true,
      weight: 0.5
    }
  }
  function color(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "pink";
      case magnitude > 3:
        return "purple";
      case magnitude > 2:
        return "navy";
      case magnitude > 1:
        return "blue";
      default:
        return "lightblue";
    }
  }
  function radius(magnitude) {
    if (magnitude == 0) {
      return 1;
    }
    return magnitude * 4;
  }


  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: style,
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Rating: " + feature.properties.stars + "<br>Location: " + feature.properties.name);
    }
  }).addTo(restaurant);
  // Then we add the earthquake layer to our map.
  // restaurant.addTo(myMap);

  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "lightblue",
      "blue",
      "navy",
      "purple",
      "pink",
      "red"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  // Here we make an AJAX call to get our Tectonic Plate geoJSON data.
  d3.json(geoData, function (response) {
    var heatArray = [];
    console.log(response);
    // var testing = response;
    respon = (response.features)
    for (var i = 0; i < respon.length; i++) {

      var property = respon[i].properties;
      console.log(property);
      //heatArray.push([property.longitude,property.latitude]);
      heatArray.push([property.latitude,property.longitude]);
    }
    console.log(heatArray)

    var heat = L.heatLayer(heatArray, {
      radius: 70,
      blur: 35
    }).addTo(grpHeat);

    // Then add the heat layer to the map.
    heat.addTo(myMap);
    
  });

});
grpHeat.addTo(myMap);
