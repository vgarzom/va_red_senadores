var tooltip;
const yearFormat = d3.timeFormat("%Y");
const tooltip_size = { height: 80, width: 230 };
const text_color = "white";

function createTooltip(mysvg) {
    console.log("Appending tooltip");
    tooltip = mysvg.append("g")
        .attr("id", "tooltip")
        .attr("transform", "translate(-10000,0)")
        .style("font", "12px sans-serif");

    let tooltip_bg = tooltip.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("class", "tooltip-bg")
        .attr("width", tooltip_size.width)
        .attr("height", tooltip_size.height)
        .attr("fill", "#000000bb");

    let tool_text = tooltip.append("text")
        .attr("x", 10)
        .attr("y", 15)
        .attr("fill", text_color)
        .attr("id", "tooltip_1");

    tool_text.append("tspan")
        .attr("id", "tooltip-title")
        .attr("x", 10)
        .attr("y", 22)
        .style("font-weight", "bold")
        .style("font-size", 16)
        .text("prueba");

    tool_text.append("tspan")
        .attr("id", "tooltip-subtitle")
        .attr("x", 10)
        .attr("y", 40)
        .style("font-weight", "regular")
        .style("font-size", 12)
        .text("prueba");

    tool_text.append("tspan")
        .attr("id", "tooltip-magnitude")
        .attr("x", 10)
        .attr("y", 55);

    tool_text.append("tspan")
        .attr("id", "tooltip-depth")
        .attr("x", 10)
        .attr("y", 70);
}

function updateTooltip(d, senador) {
    


    var x = senador.node().getBoundingClientRect().x - width;
    
    var y = senador.node().getBoundingClientRect().y - height;
    tooltip.attr("transform", `translate(${x},${y})`);
    tooltip.select("#tooltip-title").text(d.id);
    tooltip.select("#tooltip-subtitle").text(d.group);
    //tooltip.select("#tooltip-magnitude").text(`magnitud: ${d.magnitude}`);
    //tooltip.select("#tooltip-depth").text(`profundidad: ${d.depth}`);
}

function resetTooltip(d) {
    var id = '#sen-' + d.id.replace(/ /g,"-");
    var sismo = d3.select(id);
    sismo
        .attr("stroke", "steelblue")
        .attr("stroke-width", 0);
    tooltip.attr("transform", `translate(-10000,-10000)`);
}