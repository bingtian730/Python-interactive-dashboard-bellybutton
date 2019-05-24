function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var sample=d3.select("#selDataset").property("value");
  console.log(sample);

  var queryUrl="http://127.0.0.1:5000/metadata/"+sample;

  d3.json(queryUrl).then(function(data){
  console.log(data);
  // Use d3 to select the panel with id of `#sample-metadata`
  d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  d3.select("#sample-metadata").html("");
  // Use `Object.entries` to add each key and value pair to the panel
  var table=d3.select(".panel-body");
  Object.entries(data).forEach(function([key,value]){
    console.log(key,value);
    var row=table.append("li").text(key+":"+value).attr("fill", "#000000");
    
  });  

  });
  };


//build pie and bubble charts 

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sample=d3.select("#selDataset").property("value");
  console.log(sample);
  // @TODO: Build a Bubble Chart using the sample data
  var queryUrl="http://127.0.0.1:5000/samples/"+sample;
  d3.json(queryUrl).then(function(data){
    console.log(data);
    var otu_ids=data.otu_ids;
    var sample_values=data.sample_values;
    var otu_labels=data.otu_labels;
    var trace1={
      x:otu_ids,
      y:sample_values,
      mode:"markers",
      marker:{
        color: otu_ids,
        size:sample_values
      }
    };

    var data=[trace1];

    var layout = {
      title: 'Bubble chart for sample'+' '+sample,
      showlegend: false,
      height: 600,
      width: 1000
    };

    Plotly.newPlot('bubble', data, layout);
  // @TODO: Build a Pie Chart
  var labels=otu_ids.slice(0,9);
  var values=sample_values.slice(0,9);
  var text=otu_labels.slice(0.9);
  var data2=[{
    values:values,
    labels:labels,
    type:'pie',
    hoverinfo:text, 
  }];

  var layout={
    height:400,
    width:500
  };

  Plotly.newPlot('pie', data2, layout);
    
  });
  
};

// Built Gauge chart 
function buildGauge(sample){

var sample=d3.select("#selDataset").property("value"); 
console.log(sample);
var queryUrl="http://127.0.0.1:5000/wfreq/"+sample;

d3.json(queryUrl).then(function(data){
var wfreq=data.WFREQ;
console.log(wfreq);
  // Enter a speed between 0 and 180
var level = wfreq;

// Trig to calc meter point
var degrees = 180-level*20,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6','4-5','3-4' ,'2-3', '1-2','0-1'],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 
  'rgba(110, 154, 22, .5)',
 'rgba(170, 202, 42, .5)',
    'rgba(202, 209, 95, .5)',
                   'rgba(210, 206, 145, .5)',
                   'rgba(232, 226, 202, .5)',
                   'rgba(14, 127, 0, .5)', 
                   'rgba(110, 154, 22, .5)',
                  'rgba(170, 202, 42, .5)',
                  

                  'rgba(255, 255, 255, 0)']},

  labels: ['8-9', '7-8', '6-7', '5-6','4-5','3-4' ,'2-3', '1-2','0-1'],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);


})
};





function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
  console.log(newSample);
}

// Initialize the dashboard
init();
