const scale = d3.scaleOrdinal(d3.schemeCategory10);

var color = d => scale(d.group);

var drag = simulation => {

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

function forceSimulation(nodes, links) {
    return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter());
}


function drawNetworkChart(data) {
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    const simulation = forceSimulation(nodes, links).on("tick", ticked);

    svg.attr("viewBox", [-width, -height, 2*width, 2*height]);

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("r", 5)
      .attr("fill", color)
      .attr("id", (d) => {return "sen-"+d.id.replace(/ /g,"-")})
      .call(drag(simulation))
      .on("mouseover", mouseover)
      .on("mouseleave", resetTooltip)

  node.append("title")
      .text(d => d.id);

  function ticked() {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    
    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  }
}

function mouseover(d) {
    var id = '#sen-' + d.id.replace(/ /g,"-");
    console.log(id);
    var sen = d3.select(id);
    sen
        .attr("stroke", "black")
        .attr("stroke-width", 1.2);
    updateTooltip(d, sen);
}

