const vis_container = d3.select("#vis-container");
const vis_header = d3.select("#vis-header");

const
    margin = { top: 20, right: 50, bottom: 40, left: 70 },
    width = vis_container.node().getBoundingClientRect().width;
var
    height = 900,
    svg = vis_container.append('svg').attr("width", width).attr("height", height);

svg.style("font", "10px sans-serif")
    .style("width", "100%")
    .style("height", "auto");

var data = [];
var nodes = [];
var links = [];

function loadNodes() {
    d3.csv(
        "assets/data/senadores.csv",
        (d, i) => {
            var sen = {
                id: d.senador.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
                group: d.partido
            }
            nodes.push(sen)
        }
    ).then(() => {
        nodes.sort((x, y) => {
            return d3.ascending(x.id, y.id);
        })
        loadProjects();
    });
}

function getNode(id) {
    var exists = false;
    for (var k = 0; k < nodes.length; k++) {
        if (nodes[k].id === id) {
            return nodes[k]
        }
    }
    return null;
}

function getLink(source, target) {
    var link = null
    source = source.trim();
    target = target.trim();
    for (var i = 0; i < links.length; i++) {
        var l = links[i];
        if ((l.target === target && l.source === source) ||
            (l.target === source && l.source === target)) {
            link = l;
            break;
        }
    }
    if (link === null) {
        link = { target: target, source: source, value: 0 };
        links.push(link);
    }
    return link;
}




function loadProjects() {
    data = [];
    d3.csv(
        "assets/data/proyectos.csv",
        (d, i) => {
            var authors = d.autor.split("|");
            for (var i = 0; i < authors.length - 1; i++) {
                var authori = authors[i].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                var ni = getNode(authori);
                if (ni != null) {
                    for (var j = i + 1; j < authors.length; j++) {
                        var authorj = authors[j].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        var nj = getNode(authorj);
                        if (nj != null){
                            var link = getLink(authori, authorj);
                            link.value++;
                        }
                    }
                }
            }
        }
    ).then(() => {
        nodes.sort((x, y) => {
            return d3.ascending(x.id, y.id);
        })
        data = { nodes: nodes, links: links }
        console.log(nodes);
        drawNetworkChart(data);
        createTooltip(svg);
    });

    /*
        d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json")
            .then((data) => {
                console.log(data);
                drawNetworkChart(data);
            });
            */
}

function controlsChanged() {
    /*d3.selectAll("input[name='radio-distribution']").on("change", function () {
        if (this.value === 'principioactivo') {
            svg.selectAll('g').remove();
            distributeByPrincipioactivo()
        } else {
            svg.selectAll('g').remove();
            distributeByForma();
        }
    });*/
    loadNodes();
}

controlsChanged();