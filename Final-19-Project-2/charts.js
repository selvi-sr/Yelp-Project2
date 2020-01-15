function buildCharts(city) {
    var selectedCiti = city

//GET selected city ratings dataset
var pierequestURL = "http://localhost:5000/CITYRatingSummary?city="+selectedCiti
console.log(pierequestURL)
d3.json(pierequestURL).then((ratingdata)=>{
  console.log(ratingdata)
  
   //PIE PLOT
   var ratingplotdata = {};
   ratingplotdata.values = [];
   ratingplotdata.labels = [];
   
   for(var i =0; i < ratingdata.length; i++){
     ratingplotdata.values.push(ratingdata[i].count); 
     ratingplotdata.labels.push(ratingdata[i]._id); 
   }
   data = [
     {
       values: ratingplotdata.values,
       labels: ratingplotdata.labels,
       type: 'pie'
     }
   ];
   var pieLayout = {
     height: 450,
     width: 600
   };
   Plotly.newPlot("Pie", data, pieLayout,45);
 });

 //build bubble chart
    var bubblerequestURL = "http://localhost:5000/CITYReviews?city="+selectedCiti
    console.log(bubblerequestURL)
   d3.json(bubblerequestURL).then((review_data) => {
      console.log(review_data)
      
      var coffeeShop_l = []
      var rating_l = []
      var review_ct = []
  
      for(var i =0; i < review_data.length; i++){
        //coffeeShop_l.push(review_data[i].Name); 
        coffeeShop_l.push(review_data[i].name); 
        //rating_l.push(review_data[i].Rating); 
        rating_l.push(review_data[i].stars); 
        //review_ct.push(review_data[i].Review_Count)
        review_ct.push(review_data[i].review_count)
      }
  
      // Build a Bubble Chart
      var bubbleLayout = {
        title: selectedCiti + " Restaurant Ratings vs Reviews",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "Number of Reviews" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
          x: review_ct,
          y: rating_l,
          text: coffeeShop_l,
          mode: "markers",
          marker: {
            size: review_ct,
            sizeref: 10,
            color: rating_l,
            colorscale: "RdBu"
          }
        }
      ];
  
      Plotly.newPlot("Bubble", bubbleData, bubbleLayout);
  
    });
  }
  
    function init() {
      // Grab a reference to the dropdown select element
      var selector = d3.select("#selCity");
    
      // Use the list of sample names to populate the select options
      d3.json("http://localhost:5000/CityList").then((cities) => {
        var cities_l = cities;
        console.log(cities);
        cities_l.forEach((citi) => {
          selector
            .append("option")
            .text(citi)
            .property("value", citi);
        });
    
        // Use the first sample from the list to build the initial plots
        var firstCiti = "Pittsburgh";
        buildCharts(firstCiti);
      });
    }
    function optionChanged(newCiti) {
      // Fetch new data each time a new sample is selected
      buildCharts(newCiti);
    }
  
    init();