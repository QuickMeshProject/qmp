//Define properties of the document (size, etc.)
var docProperties = {};
    getDocumentSize();

// Define the properties of the graph
var graphProperties = {};
    calcGraphSize();
    graphProperties.r = calcR();
    graphProperties.breakpx = 900;

// Append the svg to the graphspace div
var svg = d3.select("#graphSVG").append("svg")
    .attr("width", graphProperties.width)
    .attr("height", graphProperties.height);


// Declare empty arrays to contain all the node and link objects
var nodes = [], links = [];
//, tests = {};

// Declare empty arrays to contain the node and link objects displayed in the graph
var graphNodes = [], graphLinks = [];

// Initialize force layout properties. The nodes and links variables are empty by now.
var force = d3.layout.force()
    .gravity(0.04)
    .distance(calcDistance())
    .charge(-500)
    .size([graphProperties.width, graphProperties.height])
    .nodes(nodes)
    .links(links)
    .on("tick", tick);

// Define the link variable as the selection of all the links in the SVG graph
// and create the SVG links layer
    var link = svg.append("g").selectAll(".link")
        .data(links)
        .enter().insert("line", ".node")
        .attr("class", "link")
        .attr("stroke-width", function(d) { return d.strokeWidth;})
        .attr("x1", function(d) { return d.source.x;})
        .attr("y1", function(d) { return d.source.y;})
        .attr("x2", function(d) { return d.target.x;})
        .attr("y2", function(d) { return d.target.y;});

// Define the node variable as the selection of all the nodes in the SVG graph,
// create the SVG nodes layer and plot the local node.
    var node = svg.append("g").selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .on("dblclick", function(d,i) { moveToNode(d.id); })
        .on("click", function(d,i) { selectNode(d.id); })
        .attr("r", calcR())
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("fill", function (d) { return nodeColour(d)} )
        .call(force.drag);

// Define the name variable as the selection of all the node names in the SVG graph,
// create the SVG names layer and plot the local node name.

    var label = svg.append("f").selectAll(".nodelabel")
        .data(nodes)
        .enter().append("text")
        .attr("class", ".nodelabel")
        .attr("x", function(d) { return d.x ; })
        .attr("y", function(d) { return d.y + 2.5*calcR(); })
        .attr("text-anchor", "middle")
        .attr("style", function(d){ return "text-shadow: 1px 1px 0px #FFF, 1px 0px 0px #FFF, 0px -1px 0px #FFF, -1px 0px 0px #FFF";})
        .text(function(d) { return d.id; });

//Add node2 to the list of node1's neighbours
function addNeighbour(node1, node2) {

    //Proceed if node1 is listed
    if ( inNodesList(node1) && inNodesList(node2) ) {

        var indexNode1 = indexNode(node1), indexNode2 = indexNode(node2);

        if (DEBUGMODE) {
            console.log("Function: addNeighbours. Node " + node1 + " index:", indexNode1);
            console.log("Function: addNeighbours. Node " + node2 + " index:", indexNode2);
        }

        //Create the neighbours arrays if not present
        if ( nodes[indexNode1].neighbours == null )
            nodes[indexNode1].neighbours = [];

        //Check if the nodes is in the array and, if not, add it
        if ( nodes[indexNode1].neighbours.indexOf(node2) == -1 )
            nodes[indexNode1].neighbours.push(node2);
    }

    else if (DEBUGMODE) {
        console.log("Function: addNeighbours. Node " + node1 + " not found.");
        console.log("Function: addNeighbours. Node " + node2 + " not found.");
    }

}



//Add node1 and node2, reciprocally, to their lists of neighbours
function addNeighbours(node1, node2) {

    var indexNode1 = nodes.map(function(element) {
  return element.id;
    }).indexOf(node1);

  var indexNode2 = nodes.map(function(element) {
  return element.id;
    }).indexOf(node2);

    //Proceed if both nodes exist
    if ( indexNode1 != -1 && indexNode2 != -1) {

        if (DEBUGMODE) {
            console.log("Function: addNeighbours. Node " + node1 + " index:", indexNode1);
            console.log("Function: addNeighbours. Node " + node2 + " index:", indexNode2);
        }

        //Create the neighbours arrays if not present
        if ( nodes[indexNode1].neighbours == null )
            nodes[indexNode1].neighbours = [];
        if ( nodes[indexNode2].neighbours == null )
            nodes[indexNode2].neighbours = [];

        //Add the nodes
        nodes[indexNode1].neighbours.push(node2);
        nodes[indexNode2].neighbours.push(node1);

    }

    else if (DEBUGMODE) {
        console.log("Function: addNeighbours. Node " + node1 + " not found.");
        console.log("Function: addNeighbours. Node " + node2 + " not found.");
    }

}


function moveToNode(nodeId) {

	var index1 = nodes.map(function(element) {
		return element.center;
	}).indexOf(true);
	//console.log(index1);

	var index2 = nodes.map(function(element) {
		return element.id;
	}).indexOf(nodeId);
	//console.log(index2);

	var index3 = nodes.map(function(element) {
		return element.selected;
	}).indexOf(true);
	//console.log(index3);

	if (index1 != -1 && index2 != -1) {
		nodes[index1].center = false;
		nodes[index2].center = true;
		nodes[index2].selected = true;
	}

	if (index2 != index3 && index3 > -1)
		nodes[index3].selected = false;

	refreshSidebar();
	addAllNeighbours(nodes[index2].id, true, true);
	tick();
}

function selectNode(nodeId) {

	var index1 = nodes.map(function(element) {
		return element.selected;
	}).indexOf(true);

	var index2 = nodes.map(function(element) {
		return element.id;
	}).indexOf(nodeId);

	if (index1 > -1 && index2 > -1) {
		nodes[index1].selected = false;
		nodes[index2].selected = true;
	}

	refreshSidebar(nodeId);
	tick();
}



function tick() {

	var debug = arguments;

    var index3 = nodes.map(function(element) {
		return element.center;
    }).indexOf(true);

	var metricColour = [[1000000, "dimgray"],
                        [6000000, "maroon"],
                        [12000000, "orangered"],
                        [24000000, "darkorange"],
                        [36000000, "greenyellow"],
                        [48000000, "limegreen"],
                        [56000000, "lime"],
                        [100000000, "limegreen"],
                        [1000000000, "dodgerblue"],
                        [10000000000, "lightskyblue"],
                        [128000000000, "lightcyan"]];

    var c = d3.scale.linear().domain(metricColour.map(function(d){return d[0];}))
                             .range(metricColour.map(function(d){return d[1];})).clamp(true);


    var despx = 0, despy = 0;

    if (index3 >= 0) {
        despx = nodes[index3].x - graphProperties.width/2;
        despy = nodes[index3].y - graphProperties.height/2;
    }

    node.attr("cx", function(d) { return d.x - despx; })
        .attr("cy", function(d) { return d.y - despy; })
        .attr("fill", function (d) { return nodeColour(d)} );

    label.attr("x", function(d) { return d.x - despx; })
         .attr("y", function(d) { return d.y - despy + labelDespY(); })
         .attr("style", function(d){ return "text-shadow: 1px 1px 0px #FFF, 1px 0px 0px #FFF, 0px -1px 0px #FFF, -1px 0px 0px #FFF";});

	label.style("font-size", (8+currentZoom)+"px");

    link.attr("stroke-width", function(d, i) {
			console.debug("In function " + debug.callee.name + ". Calling calcThickness for link " + i + ".");
			d.strokeWidth = calcThickness(d, i);
			return d.strokeWidth;})
    	.style("stroke", function(d) { return (c(d.metric));})
		.style("opacity", function(d, i) { return calcOpacity(d,i);})
        .attr("x1", function(d) { return d.source.x - despx;})
        .attr("y1", function(d) { return d.source.y - despy;})
        .attr("x2", function(d) { return d.target.x - despx;})
        .attr("y2", function(d) { return d.target.y - despy;});



}



function redrawGraph()
{
	svg.selectAll("g").selectAll(".node").remove();
	svg.selectAll("g").selectAll(".name").remove();

	svg.append("g").selectAll(".node")
		.data(nodes)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", calcR())
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.call(force.drag);

	svg.append("g").selectAll(".name")
		.data(nodes)
		.enter().append("text")
		.attr("class", "name")
		.attr("x", function(d) { return d.x ; })
		.attr("y", function(d) { return d.y + 2.5*r; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d.id; });

	node = svg.append("g").selectAll(".node")
		.data(nodes)
		.attr("class", "node")
		.on("dblclick", function(d,i) { moveToNode(d.id); })
		.on("click", function(d,i) { selectNode(d.id); })
		.attr("r", calcR())
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; })
		.call(force.drag);

	// Define the node variable as the selection of all the nodes in the svg graph
	// and plot the local node.
	name = svg.append("g").selectAll(".name")
		.data(nodes)
		.attr("class", "name")
		.attr("x", function(d) { return d.x ; })
		.attr("y", function(d) { return d.y + 2.5*r; })
		.attr("text-anchor", "middle")
		.text(function(d) { return d.id; });

	force.start();
}



function updateLabels() {

label.remove();

    var despx = 0, despy = 0;

    if (indexCenterNode() >= 0) {
        despx = nodes[indexCenterNode()].x - graphProperties.width/2;
        despy = nodes[indexCenterNode()].y - graphProperties.height/2 ;
    }

    label = svg.selectAll(".nodelabel")
      .data(nodes)
      .enter().append("text")
      .attr("class", ".nodelabel")
      .attr("x", function(d) { return d.x - despx; })
      .attr("y", function(d) { return d.y - despy + labelDespY(); })
      .attr("text-anchor", "middle")
      .attr("style", function(d){ return "text-shadow: 1px 1px 0px #FFF, 1px 0px 0px #FFF, 0px -1px 0px #FFF, -1px 0px 0px #FFF";})
      .text(function(d) {
           if (d.name != null)
               return d.name;
           else
               return d.id;
         });

     label.style("font-size", (8+currentZoom)+"px");
}


zoomOut = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_237_zoom_out.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
	.attr("x", borderSpace)
    .attr("y", borderSpace)
    .on("click", function() { graphZoom(-1); });

zoomIn = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_236_zoom_in.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
    .attr("x", iconWidth+iconSpace+borderSpace)
    .attr("y", borderSpace)
    .on("click", function() { graphZoom(1); });

zoomLevel =  svg.append("text")
                .attr("class", "zoomlevel")
                .attr("x", 2*iconWidth+2*iconSpace+borderSpace)
                .attr("y", iconHeight)
                .text("Zoom level: " + currentZoom);

lessDist = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_097_vector_path_line_short.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
    .attr("x", borderSpace)
    .attr("y", iconHeight+iconSpace+borderSpace)
    .on("click", function() { nodesDistance(-1); });

moreDist = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_097_vector_path_line_long.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
    .attr("x", iconWidth+iconSpace+borderSpace)
    .attr("y", iconHeight+iconSpace+borderSpace)
    .on("click", function() { nodesDistance(1); });

distLevel =  svg.append("text")
                .attr("class", "zoomlevel")
                .attr("x", 2*iconWidth+2*iconSpace+borderSpace)
                .attr("y", 2*iconHeight+iconSpace)
                .text("Links lenght: " + currentDistance);

thicker = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_097_vector_path_line_thick.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
    .attr("x", iconWidth+iconSpace+borderSpace)
    .attr("y", 2*iconHeight+2*iconSpace+borderSpace)
    .on("click", function() { linksThickness(1); });


thinner = svg.append("svg:image")
    .attr("xlink:href", '/luci-static/resources/nc/img/glyphicons_097_vector_path_line_thin.png')
    .attr("width", iconWidth)
    .attr("height", iconHeight)
    .attr("x", borderSpace)
    .attr("y", 2*iconHeight+2*iconSpace+borderSpace)
    .on("click", function() { linksThickness(-1); });

thickLevel =  svg.append("text")
                .attr("class", "zoomlevel")
                .attr("x", 2*iconWidth+2*iconSpace+borderSpace)
                .attr("y", 3*iconHeight+2*iconSpace)
                .text("Links thickness: " + currentDistance);

function graphZoom(zoomChange) {

console.log(zoomChange);
console.log(currentZoom);

    if ( (zoomChange == -1 && currentZoom > minZoom) || (zoomChange == 1 && currentZoom < maxZoom)) {

        currentZoom = currentZoom + zoomChange;
        node.attr("r", calcR);

        if (currentZoom == minZoom)
            zoomLevel.text("Current zoom: " + currentZoom + " (min)");
        else if (currentZoom == maxZoom)
            zoomLevel.text("Current zoom: " + currentZoom + " (max)");
        else
            zoomLevel.text("Current zoom: " + currentZoom);

        force.distance(calcDistance());
        updateLabels();
        force.start();
    }

console.log(currentZoom);

}


function nodesDistance(distChange) {

console.log(distChange);
console.log(currentDistance);

    if ( (distChange == -1 && currentDistance > minDistance) || (distChange == 1 && currentDistance < maxDistance)) {

        currentDistance = currentDistance + distChange;
        node.attr("r", calcR);

        if (currentDistance == minDistance)
            distLevel.text("Links lenght: " + currentDistance + " (min)");
        else if (currentDistance == maxDistance)
            distLevel.text("Links lenght: " + currentDistance + " (max)");
        else
            distLevel.text("Links lenght: " + currentDistance);

        force.distance(calcDistance());
        updateLabels();
        force.start();
    }

console.log(currentDistance);

}

function linksThickness(thickChange) {

	var debug = arguments;

	console.log("Function " + debug.callee.name + " called.", thickChange);

	if ( (thickChange == -1 && currentThickness > minThickness) || (thickChange == 1 && currentThickness < maxThickness)) {

		console.debug("In function " + debug.callee.name + " . Previous thickness: " + currentThickness);
		currentThickness = currentThickness + thickChange;
		console.debug("In function " + debug.callee.name + " . Current thickness: " + currentThickness);

		link.attr("stroke-width", function(d, i) {
			console.debug("In function " + debug.callee.name + ". Calling calcThickness for link " + i + ".");
			d.strokeWidth = calcThickness(d, i);
			return d.strokeWidth;
		});

		if (currentThickness == minThickness)
			thickLevel.text("Links thickness: " + currentThickness + " (min)");
		else if (currentThickness == maxThickness)
			thickLevel.text("Links thickness: " + currentThickness + " (max)");
		else
			thickLevel.text("Links thickness: " + currentThickness);
		tick();
	}
}

//Retrieve the document size from the browser
function getDocumentSize() {
    var debug = arguments;

    docProperties.width = document.body.clientWidth || document.documentElement.clientWidth || window.innerWidth || 1000;
    docProperties.height = document.documentElement.clientHeight || window.innerHeight || 720;

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Document size: "+ docProperties.width + "x" + docProperties.height);
}

//Calculate the size of the graph according to the window size
function calcGraphSize() {
    var debug = arguments;

    if (docProperties.width < graphProperties.breakpx) {
        graphProperties.width = docProperties.width - 36;
        graphProperties.height = docProperties.height * 0.6;
    }
    else {
        graphProperties.width = docProperties.width - 36 - parseInt(d3.select("#graphSidebar").style("width"),10);
        graphProperties.height = docProperties.height - 82;
    }
    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Graph size: "+ graphProperties.width + "x" + graphProperties.height);
}


//Set the NCui div absolute vertical position
function setNCuiDivPosition() {
    var debug = arguments;

    var headerHeight = document.getElementsByClassName("container")[0].offsetHeight + 18;

    d3.select("#ncui").attr("style", "top: "+ headerHeight + "px;")

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "NCui div absolute vertical position set to: "+ headerHeight);
}


//Set the graph size
function setGraphSize() {
    var debug = arguments;

    svg.attr("width", graphProperties.width)
       .attr("height", graphProperties.height);

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Graph size set to: "+ graphProperties.width + "x" + graphProperties.height);
}


//Set the force layout size
function setForceLayoutSize() {
    var debug = arguments;

    force.size([graphProperties.width, graphProperties.height]);

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Force layout size set to: "+ graphProperties.width + "x" + graphProperties.height);
}


//Resize the document on window resize
function onWindowResize() {
	var debug = arguments;

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Refreshing document size...");
    getDocumentSize()

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Positioning NCui div vertically...");
    setNCuiDivPosition()

     if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Updating graph size...");
    calcGraphSize();
    setGraphSize();

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Updating force layout...");
    setForceLayoutSize();

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name, "Tick...");
    tick();
}


function calcR() {
    return ((currentZoom +1) * rPerZoom);
}

function calcThickness(linkd, index) {
	var debug = arguments;
	var thickness;
	console.debug("Function " + debug.callee.name + " called.", linkd, index);
	thickness = currentThickness + currentZoom*tPerZoom;
	if (links[index].source.selected || links[index].target.selected)
		thickness = thickness*1.5;
    return thickness;
}

function calcDistance() {
    return (baseDist + currentZoom * currentDistance*distPerZoom);
}

function calcOpacity(d, i) {
	if (links[i].source.selected || links[i].target.selected)
		return linkOpacityCenter;
	return linkOpacityDefault;
}

function labelDespY() {
    return calcR() + (8+currentZoom) ;
}


$( document ).ready(function() {
	$('[data-toggle="table"]').bootstrapTable({});

	// Initialize the local node
	initializeLocalNode();

	//Start force layout graph
	force.start();

	//Update the sidebar
	refreshSidebar(nodes[0].id);

	//Add the local node's neighbours, asynchronously
	addAllNeighbours(nodes[0].id, true, true);

	//Disable console debug
	console.debug = function(){};

	//Resize the graph space
	window.onresize = onWindowResize;
	onWindowResize();

	testingMain(nodes[0].id, false);
//	testingAdvanced(nodes[0].id, "fcMainSpace");
});

