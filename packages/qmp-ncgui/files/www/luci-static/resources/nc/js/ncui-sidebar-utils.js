//Append a table to the selection with the columns and data info
function createTable(columns, data, selection, id) {

    table = selection.append("table")
                     .attr("id", id)
                     .attr("data-toggle", "table")
                     .attr("data-sort-name", columns[0])
                     .attr("data-sort-order", "desc")
                     .attr("data-search", true)
                     .attr("data-pagination",true)
                     //.attr("data-show-refresh", true);

    thead = table.append("thead"),
    tbody = table.append("tbody");

    //Append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .attr("data-sortable", true)
        .text(function(column) { return column; });

    //Create a row for each object in the data
    rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    //Create a cell in each row for each column
    cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });

    console.log("TABLE!");
    $("#"+id).bootstrapTable({});
    d3.selectAll(".dropup").attr("class", "btn-group dropdown")
    return table;
}

//Append a path table to the selection with the columns and data info
function createPathTable(nodeIdA, nodeIdB, selection) {

    console.log(nodeIdA, nodeIdB);

    table = selection.append("table").attr("id", "pathTable");
    thead = table.append("thead"),
    tbody = table.append("tbody");

    var columns = ["nodeA","nodeB"];

    //Append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    var CombiPath = [];

    var fPath = nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)];
    var rPath = nodes[indexNode(nodeIdB)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdB)].bmx6.paths, nodeIdA)];

    for (i = 0; i < Math.max(fPath.path.length, rPath.path.length); i++) {
        var cPath = {};

        if (i < nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)].path.length)
            cPath.nodeA = nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)].path[i];
        else
            cPath.nodeA = {};

        if (i < nodes[indexNode(nodeIdB)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdB)].bmx6.paths, nodeIdA)].path.length)
            cPath.nodeB = nodes[indexNode(nodeIdB)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdB)].bmx6.paths, nodeIdA)].path[nodes[indexNode(nodeIdB)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdB)].bmx6.paths, nodeIdA)].path.length-1-i];
        else
            cPath.nodeB = {};

        CombiPath.push(cPath);
    }


    //Create a row for each object in the data
    rows = tbody.selectAll("tr")
        .data(CombiPath)
        .enter()
        .append("tr");

    //Create a cell in each row for each column
    cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                 return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .html( function(d) {

            return generatePathCell (d.value);

            //return JSON.stringify(d.value);

        });


    //Update the headers
    columns = ["Forward path (" + fPath.path.length + " hops)", "Reverse path (" + rPath.path.length + " hops)"];
    thead.selectAll("th").remove();
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });




    return table;
}

function generatePathCell (hop) {

	console.log(hop);

	var result = "";

    if (hop != {}) {
		if (hop.in != undefined )
        	result = "<p><b>From: </b>" + nodes[indexNode(hop.in.id)].name + " (via " + hop.in.interface + ")</p>";
        else
        	result = "<p><b>From: </b> -";

        if (hop.out != undefined )
        	result = result + "<p><b>To: </b>" + nodes[indexNode(hop.out.id)].name + " (via " + hop.out.interface + ")</p>";
        else
        	result = result + "<p><b>From: </b> -";

	}

        return result;
}

//Fill (overwrite) a bmx6Algo object with the information from the metric_extension object
function fillBmx6AlgoMetricExtension (bmx6Algo, metric_extension) {

	console.log("FILLBMX6ALGOMETRICEXTENSION", metric_extension);
	bmx6Algo.value = metric_extension.metricAlgo;

	for (var i=0; i < bmx6Algo.exponents.length; i++) {
		bmx6Algo.exponents[i].value = metric_extension[bmx6Algo.exponents[i].name];
	}

	return bmx6Algo;
}

function generateBmx6Algo (nodeId, refresh) {

	refresh = typeof refresh !== 'undefined' ? refresh : true;

	if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.options == null || nodes[indexNode(nodeId)].bmx6.parameters == {}) {
		bmx6All(nodeId, false);
	}

	if (refresh) {
		bmx6Options(nodeId, false);
		bmx6Parameters(nodeId, false);
	}

	var bmx6Algo = {};

	//Fill the bmx6Algo object with hard-coded default values
	bmx6Algo.value = 16;
	bmx6Algo.def = 16;
	bmx6Algo.texts = [{"value":0,"name":"Hop count"},{"value":1,"name":"MP"},{"value":2,"name":"EP"},{"value":4,"name":"MB"},{"value":8,"name":"EB"},{"value":16,"name":"Vector bandwidth"}];
	bmx6Algo.exponents = [{"name":"rxExpNumerator", "value":1, "min":0, "max":3, "def": 1},
						  {"name": "rxExpDivisor", "value":2, "min":1, "max":2, "def": 2},
						  {"name": "txExpNumerator", "value":1, "min":0, "max":3, "def": 1},
						  {"name": "txExpDivisor", "value":1, "min":1, "max":2, "def": 1}];

	//Fill the bmx6Algo object with the default values obtained from BMX6, if any
	if (indexBmx6OptionsAlgorithm(nodeId) > -1) {
		if (typeof nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].def != "undefined" )
			bmx6Algo.value = nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].def;

		if (typeof nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].CHILD_OPTIONS != "undefined" ) {
			for (var i=0; i < bmx6Algo.exponents.length; i++) {
				if (indexBmx6OptionsAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name) > -1)
					bmx6Algo.exponents[i].value = nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].CHILD_OPTIONS[indexBmx6OptionsAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name)].def;
				}
			}
	}

	//Fill the bmx6Algo object with the current values obtained from BMX6, if any
	if (indexBmx6ParametersAlgorithm(nodeId) > -1) {
		if (typeof nodes[indexNode(nodeId)].bmx6.parameters[indexBmx6ParametersAlgorithm(nodeId)].INSTANCES[0].value != "undefined" )
			bmx6Algo.value = nodes[indexNode(nodeId)].bmx6.parameters[indexBmx6ParametersAlgorithm(nodeId)].INSTANCES[0].value;

		if (typeof nodes[indexNode(nodeId)].bmx6.parameters[indexBmx6ParametersAlgorithm(nodeId)].INSTANCES[0].CHILD_INSTANCES != "undefined" ) {
			for (var i=0; i < bmx6Algo.exponents.length; i++) {
				if (indexBmx6ParametersAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name) > -1)
					bmx6Algo.exponents[i].value = nodes[indexNode(nodeId)].bmx6.parameters[indexBmx6ParametersAlgorithm(nodeId)].INSTANCES[0].CHILD_INSTANCES[indexBmx6ParametersAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name)].value;
			}
		}
		else if (typeof nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].CHILD_OPTIONS != "undefined" ) {
			for (var i=0; i < bmx6Algo.exponents.length; i++) {
				if (indexBmx6OptionsAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name) > -1)
					bmx6Algo.exponents[i].value = nodes[indexNode(nodeId)].bmx6.options[indexBmx6OptionsAlgorithm(nodeId)].CHILD_OPTIONS[indexBmx6OptionsAlgorithmExponents(nodeId, bmx6Algo.exponents[i].name)].def;
			}
		}
	}

	return bmx6Algo;
}


function createMatrix (metricsMatrix, selection, id) {

    var mxMargin = {top: 150, right: 0, bottom: 10, left: 150},
        mxWidth = 500,
        mxHeight = 500;

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

    var x = d3.scale.ordinal().rangeBands([0, mxWidth]);

    var c = d3.scale.linear().domain(metricColour.map(function(d){return d[0];}))
                             .range(metricColour.map(function(d){return d[1];})).clamp(true);

    var mxSvg = selection.append("svg")
        .attr("width", mxWidth + mxMargin.left + mxMargin.right)
        .attr("height", mxHeight + mxMargin.top + mxMargin.bottom)
        //.style("margin-left", -mxMargin.left + "px")
        .append("g")
        .attr("transform", "translate(" + mxMargin.left + "," + mxMargin.top + ")");

    var matrix = [],
        n = nodes.length;

    // Compute index per node.
    nodes.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        matrix[i] = d3.range(n).map(function(j) { return {x: j, y: i, z: 0}; });
    });

    console.log("Matrix (empty)", matrix);

    // Convert links to matrix; count character occurrences.
    metricsMatrix.forEach(function(metric, index) {
        console.log("metric",index , metric);
        matrix[indexNode(metric.source)][indexNode(metric.target)].z += metric.value;
        //matrix[indexNode(metric.target)][indexNode(metric.source)].z += metric.value;
        //matrix[indexNode(metric.source)][indexNode(metric.source)].z += metric.value;
        //matrix[indexNode(metric.target)][indexNode(metric.target)].z += metric.value;
        nodes[indexNode(metric.source)].count += metric.value;
        nodes[indexNode(metric.target)].count += metric.value;
    });

        console.log("Matrix (full)",matrix);

    // Precompute the orders.
    var orders = {
        name: d3.range(n).sort(function(a, b) { return d3.ascending(nodes[a].name, nodes[b].name); }),
        count: d3.range(n).sort(function(a, b) { return nodes[b].count - nodes[a].count; }),
        group: d3.range(n).sort(function(a, b) { return nodes[b].group - nodes[a].group; })
    };

    // The default sort order.
    x.domain(orders.name);

    mxSvg.append("rect")
      .attr("class", "background")
      .attr("width", mxWidth)
      .attr("height", mxHeight);

    var row = mxSvg.selectAll(".row")
        .data(matrix)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
        .each(row);

  row.append("line")
      .attr("x2", mxWidth);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d, i) { return nodes[i].name; });

  var column = mxSvg.selectAll(".column")
      .data(matrix)
    .enter().append("g")
      .attr("class", "column")
      .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  column.append("line")
      .attr("x1", -mxWidth);

  column.append("text")
      .attr("x", 6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "start")
      .text(function(d, i) { return nodes[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
        .data(row.filter(function(d) { return d.z; }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", 1)
        .style("fill", function(d) { console.log(d); return c(d.z); })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  }

  function mouseover(p) {
    d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
    d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
  }

  function mouseout() {
    d3.selectAll("text").classed("active", false);
  }

  d3.select("#order").on("change", function() {
    clearTimeout(timeout);
    order(this.value);
  });

  function order(value) {
    x.domain(orders[value]);

    var t = mxSvg.transition().duration(2500);

    t.selectAll(".row")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .selectAll(".cell")
        .delay(function(d) { return x(d.x) * 4; })
        .attr("x", function(d) { return x(d.x); });

    t.selectAll(".column")
        .delay(function(d, i) { return x(i) * 4; })
        .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  }

 /*var timeout = setTimeout(function() {
    order("group");
    d3.select("#order").property("selectedIndex", 2).node().focus();
  }, 5000);*/


return mxSvg;


}