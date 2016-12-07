var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(75))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

function toggleCheckbox(element){
  d3.json("../assets/nodes.json", function(error, nodes) {
    d3.json("../assets/edges.json", function(error, edges) {

      if(element.checked){
        party_color()
      }else{
        community_color()
      }
  });
});
}

function toggleInDegree(element){

  d3.json("../assets/nodes.json", function(error, nodes) {
    d3.json("../assets/edges.json", function(error, edges) {

        if(element.checked){
          svg.selectAll("circle")   // change the line
            .attr("r", function(d) { return (d.inDegree+d.outDegree)/5})
        }else{
          svg.selectAll("circle")   // change the line
            .attr("r", function(d) { return 12})
        }
    });
  });
}
function community_color()
{
      // Get the data again
      d3.json("assets/nodes.json", function(error, nodes) {
        d3.json("assets/edges.json", function(error, edges) {

        // Make the changes
            svg.selectAll("circle")   // change the line
              .attr("fill", function(d) { return color(d.community); })
            });
      });
}

function party_color()
{
      // Get the data again
      d3.json("assets/nodes.json", function(error, nodes) {
        d3.json("assets/edges.json", function(error, edges) {

        // Make the changes
            svg.selectAll("circle")   // change the line
              .attr("fill", function(d) { return get_party_color(d.party); })
            });
      });
}


function nodeSize(choice)
{
  d3.json("../assets/nodes.json", function(error, nodes) {
    d3.json("../assets/edges.json", function(error, edges) {

      var size = 8

      if(choice=='In degree')
      {
        svg.selectAll("circle")
        .transition()
        .duration(2000)   // change the line
          .attr("r", function(d) { return (d.inDegree)/(2.5)})
      }else if(choice=='Out degree')
      {
        svg.selectAll("circle")
        .transition()
        .duration(2000)  // change the line
          .attr("r", function(d) { return (d.outDegree)/(2.5)})
      }else if(choice=='Betweenes centrality')
      {
        svg.selectAll("circle")
        .transition()
        .duration(2000)     // change the line
          .attr("r", function(d) { return (d.betweenC)*(500)})
      }else if(choice=='In degree eigenvector centrality')
      {
        svg.selectAll("circle")
        .transition()
        .duration(2000)     // change the line
          .attr("r", function(d) { return (d.evcIn)*100})
      }else if(choice=='Out degree eignevector centrality')
      {
        svg.selectAll("circle")
        .transition()
        .duration(2000)     // change the line
          .attr("r", function(d) { return (d.evcOut)*100})
      }else{
        svg.selectAll("circle")
        .transition()
        .duration(2000)     // change the line
          .attr("r", function(d) { return (12)})
      }
    });
  });

  var btn = document.getElementById("dropbtn")
  btn.innerText = choice
}

function get_party_color(party){
  if(party == "Siumut" || party=="SIU"){
    return "#6347C0"
  }else if(party == "Konservative" || party == "KF"){
    return "#0E3D02"
  }else  if(party == "Enhedslisten" || party == "EL"){
      return "#5E001D"//"#9B002F"
  }else  if(party == "Alternativet" || party == "ALT"){
      return "#42FF1A"
  }else  if(party == "Venstre" || party == "V"){
      return "#0780FF"
  }else  if(party == "Radikale" || party == "RV"){
      return "#FF00AC"
  }else  if(party == "Inuit Ataqatigiit" || party == "IA"){
      return "#FF0000"
  }else  if(party == "Socialdemokraterne" || party == "S"){
      return "#840000"
  }else  if(party == "Republikanerne" || party == "T"){
      return "black"
  }else  if(party == "Liberal Alliance" || party == "LA"){
      return "#94B4FF"
  }else  if(party == "Dansk Folkeparti" || party == "DF"){
      return "#08276E"
  }else if(party == "SF"){
    return "#FF8686"
  }else{
    return "black"
  }
}

d3.json("assets/nodes.json", function(error, nodes) {
  d3.json("assets/edges.json", function(error, edges) {

    if (error) throw error;
    var link = svg.append("g")
        .attr("class", "line")
      .selectAll("line")
      .data(edges)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
        .attr("stroke","#FFFFFF")
        .attr("opacity","0.3")


    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("circle")
      .data(nodes)
      .enter().append("circle")
        .attr("r", function(d) { return 15 })
        .attr("fill", function(d) { return color(d.community); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(edges);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }
  });
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.9).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
