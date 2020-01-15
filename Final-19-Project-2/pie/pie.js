
d3.json('http://localhost:5000/ATLRating').then((ratingdata)=>{
 console.log(ratingdata)
 //console.log(ratingdata.values)
  //ATL PIE PLOT
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
    width: 600,
    title:'Atlanta Reviews'
  };

  Plotly.newPlot("ATLPie", data, pieLayout);
});
//SFO Pie Chart
d3.json('http://localhost:5000/SFORating').then((ratingdata)=>{
 console.log(ratingdata)
 
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
    width: 600,
    title: 'San Francisco Reviews'
  };

  Plotly.newPlot("SFOPie", data, pieLayout);
});