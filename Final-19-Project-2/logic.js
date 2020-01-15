//create Layers

var layers = {
  FiveStars: new L.LayerGroup(),
  FourStars: new L.LayerGroup(),
  ThreeStars: new L.LayerGroup()
};

// Creating map object
var myMap = L.map("map", {
  center: [33.7490, -84.3880],
  layers:[
    layers.FiveStars,
    layers.FourStars,
    layers.ThreeStars
  ],
  //center: [180,-180],
  zoom: 13
});

var LeafIcon = L.Icon.extend({
  options: {
      
      //iconSize:     [38, 95],
      iconSize:     [19, 47],
      iconAnchor:   [22, 94], 
      popupAnchor:  [-3, -76]
  }
});

var  greenIcon = new LeafIcon({iconUrl: 'greencup.png'}),
      redIcon = new LeafIcon({iconUrl: 'redcup.png'}),
      whiteIcon= new LeafIcon({iconUrl: 'white.png'});

  var overlays = {
    "FiveStars": layers.FiveStars,
    "FourStars": layers.FourStars,
    "ThreeStars": layers.ThreeStars
};

L.control.layers(null, overlays).addTo(myMap);

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Load in geojson data
var geoData = "yelp_ATLAllcoffee.geojson";

// Grab data with d3
d3.json(geoData, function(data) {
console.log(data.features);

//5 stars
fiveStar = data.features.filter(row => row.properties.Rating  == 5);
L.geoJSON(fiveStar, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {icon: color(feature.properties.Rating)});
  },
  style: style,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("stars: " + feature.properties.Rating + "<br>Location: " + feature.properties.Name + "<br>Review_Count: "+feature.properties.Review_Count);
  }
 }).addTo(layers["FiveStars"]);
//end 5 stars

//4 stars
fourStar = data.features.filter(row => row.properties.Rating  >=4 && 
  row.properties.Rating < 5);
L.geoJSON(fourStar, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {icon: color(feature.properties.Rating)});
  },
  style: style,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("stars: " + feature.properties.Rating + "<br>Location: " + feature.properties.Name + "<br>Review_Count: "+feature.properties.Review_Count);
  }
 }).addTo(layers["FourStars"]);
//end 4 stars

//less than equal to 3 stars
threeStar = data.features.filter(row => row.properties.Rating  <=3 );
L.geoJSON(threeStar, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {icon: color(feature.properties.Rating)});
  },
  style: style,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("stars: " + feature.properties.Rating + "<br>Location: " + feature.properties.Name);
  }
 }).addTo(layers["ThreeStars"]);
//end 3 stars
});


function style(feature){
  return{
    opacity: 0.5,
    fillOpacity: 0.9,
    fillColor: color(feature.properties.Rating),
    color: "#000000",
    radius: radius(feature.properties.Rating),
    stroke: true,
    weight: 0.5
  }
}
  function color(stars){
    switch (true) {
      case stars == 5:
        return redIcon;
      case stars >= 4:
        return greenIcon;
      case stars >= 3:
        return whiteIcon;
      case stars >= 2:
        return whiteIcon;
      case stars >= 1:
        return whiteIcon;
      default:
        return whiteIcon;
      }
    }
  function radius(stars){
    if (stars == 0){
      return 1;
    }
    return stars * 4;
  }

  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = ["5Stars", "4Stars", "3&Less"];
    var colors = [
      "redcup.png",
      "greencup.png",
      "white.png",
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      grades[i] + (" <img src="+ colors[i] +" height='25' width='10'>") +'<br>';
    }
    return div;
  };
legend.addTo(myMap);


  