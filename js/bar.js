
var width = 860;
var height = 400;

var x0 = d3.scaleBand().rangeRound([0, width])

var x1 = d3.scaleBand().rangeRound([0, width])

var y = d3.scaleLinear()
  .range([400, 0]);

var color = d3.scaleOrdinal()
  .range(["#98abc5", "#8a89a6"]);


var svgbar = d3.select("#svg-bar")

var sent = false
function nodes(){
  filename = "SentAvg.csv"
  if(!sent){
    sent = true
    filename = "SentStd.csv"
  }else{
    sent = false
  }
  d3.csv("../assets/"+filename, function(error, data) {
      /*svg.selectAll("circle")
      .transition()
      .duration(2000)     // change the line
        .attr("r", function(d) { return (12)})
*/
        var ageNames = d3.keys(data[0]).filter(function(key) {
        return key !== "name";
      });
      data.forEach(function(d) {
        d.ages = ageNames.map(function(name) {
          return {
            name: name,
            value: +d[name]
          };
        });
      });

      svgbar.selectAll(".state").data(data).selectAll("rect")
        .data(function(d) {
          return d.ages;
        })
        .transition()
        .duration(2000)
        .attr("y", function(d) {
          return y(d.value);
        })
        .attr("height", function(d) {
          var val = 400-y(d.value)
          if(val>0){
            return val
          }
          return 0
        })
        .style("fill", function(d) {
          return color(d.name);
        });
    });

  //var btn = document.getElementById("dropbtn")
  //btn.innerText = choice
}

d3.csv("assets/SentAvg.csv", function(error, data){

  var verticalGuideScale = d3.scaleLinear()
    .domain([-4, d3.max(data)])
    .range([400, 0])

  var yAxis = d3.axisLeft(y)
    .ticks(10)

  var xAxis = d3.axisBottom(x0)
    .ticks(data.size)



  var ageNames = d3.keys(data[0]).filter(function(key) {
    return key !== "name";
  });

  data.forEach(function(d) {
    d.ages = ageNames.map(function(name) {
      return {
        name: name,
        value: +d[name]
      };
    });
  });

  x0.domain(data.map(function(d) {
    return d.name;
  }));

  x1.domain(ageNames).range([5, x0.bandwidth()]);
  y.domain([-4, d3.max(data, function(c) {
    return d3.max(c.ages, function(d) {
      return d.value;
    });
  })]);

  svgbar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + 400 + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 10)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");

  svgbar.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Sentiment");

  var state = svgbar.selectAll(".state")
    .data(data)
    .enter().append("g")
    .attr("class", "state")
    .attr("transform", function(d) {
      return "translate(" + x0(d.name) + ",0)";
    });

  state.selectAll("rect")
    .data(function(d) {
      return d.ages;
    })
    .enter().append("rect")
    .attr("width", x1.bandwidth())
    .attr("x", function(d) {
      return x1(d.name);
    })
    .attr("y", function(d) {
      return y(d.value);
    })
    .attr("height", function(d) {
      var val = 400-y(d.value)
      if(val>0){
        return val
      }
      return 0;
    })
    .style("fill", function(d) {
      return color(d.name);
    });

  var legend = svgbar.selectAll(".legend")
    .data(ageNames.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
});
