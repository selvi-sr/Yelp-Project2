  d3.json("http://localhost:5000/ATLReviewCount").then((atl_data) => {
    console.log(atl_data)
    
    var coffeeShop_l = []
    var rating_l = []
    var review_ct = []

    for(var i =0; i < atl_data.length; i++){
      coffeeShop_l.push(atl_data[i].Name); 
      rating_l.push(atl_data[i].Rating); 
      review_ct.push(atl_data[i].Review_Count)
    }

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "Atlanta coffee shops",
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
          sizeref: 50,
          color: rating_l,
          colorscale: "RdBu"
        }
      }
    ];

    Plotly.newPlot("ATLbubble", bubbleData, bubbleLayout);

  });
  
  d3.json("http://localhost:5000/SFOReviewCount").then((sfo_data) => {
    console.log(sfo_data)
    
    var coffeeShop_l = []
    var rating_l = []
    var review_ct = []

    for(var i =0; i < sfo_data.length; i++){
      coffeeShop_l.push(sfo_data[i].Name); 
      rating_l.push(sfo_data[i].Rating); 
      review_ct.push(sfo_data[i].Review_Count)
    }

    // Build a Bubble Chart
    var bubbleLayout = {
      title: "San Francisco coffee shops",
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
          sizeref: 50,
          color: rating_l,
          colorscale: "RdBu"
        }
      }
    ];

    Plotly.newPlot("SFObubble", bubbleData, bubbleLayout);

  });