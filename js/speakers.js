window.onload = function(){
  d3.csv("assets/speaker_count.csv", function(data) {

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset(function(d){ return [0, 0]})
      .html(function(d) {
        return "<strong>Speaker:</strong> <span style='color:black; background=blue'>" + d.Speaker + "</span>";
      })

    var vis = d3.select("#svgVisualizeSpeachs");
    vis.call(tip)
    var xRange = d3.scaleLinear()
                    .range([40, 3500])
                    .domain([d3.min(data, function(d) {
                      return (d.Count/100);
                    }), d3.max(data, function(d) {
                      return d.Count/100;
                    })]);
    var yRange = d3.scaleLinear()
                    .range([1000, 10])
                    .domain([d3.min(data, function(d) {
                      return d.Count/100;
                    }), d3.max(data, function(d) {
                      return d.Count/100;
                    })]);
    var xAxis = d3.axisBottom().scale(xRange);
    var yAxis = d3.axisLeft().scale(yRange);
    vis.append("svg:g").call(xAxis).attr("transform", "translate(0,1000)");
    vis.append("svg:g").call(yAxis).attr("transform", "translate(30,10)");

    console.log(data)
    var circles = vis.selectAll("circle").data(data);
    var circlesEnter = circles
        .enter()
        .append("g")
        .attr("transform", function(d){return "translate("+(d.Count/10.4)+","+(Math.random()*400+500)+")"})
        .attr("cx", function(d) { return (d.Count/100); })
        .attr("cy", function(d) { return Math.random()*400; })
    var circle = circlesEnter
        .insert("circle")
        .attr("r",  function(d) { return (d.Count/50)})
        .on('mouseover',  function(d) {
          d3.select(this).style("opacity", 1)
          tip.show(d)
        })
        .on('mouseout',  function(d) {
          d3.select(this).style("opacity", 0.4)
          tip.hide(d)
        })
        .style("opacity", .4)      // set the element opacity
        .style("stroke", "black")
        .style("fill", function(d){return getColor(d.Count)});
  });
}

var getColor = function(value){
  var maxV = 	31891
  var minV = 	503
  //var diff = max(values)-min(values)
  //debugger
  var diff = maxV-minV
  var stepSize = 510/diff
  var val = value*stepSize
  if(val < 255){
    console.log("UNDER")
    return d3.rgb(255,val,0)
  }
  else if(val==255){
    return d3.rgb(255,255,0)
  }else{
    console.log(value)
    console.log("OVER")
    if(val>255){
      val = 255
    }
    console.log(val)
    return d3.rgb(0,255, 0)
  }
}

4 -0.8
