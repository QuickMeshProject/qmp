function visualizeResults(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var sHeader = sSpace.append("div").attr("id", "sHeader");

	var sTitle = sHeader.append("div").attr("id", "sTitle");
	sTitle.append("h2").text("Results visualisation");

	var sText1 = sSpace.append("div").attr("id", "sText1").append("p");
	sText1.text("This section lets you visualise the results of the performed tests.");

	//Tests lists
	var sTests = sSpace.append("div").attr("id","sTests");
	var sTestsTitle = sTests.append("h3").text("List of tests");
	var ssTests = sTests.append("div").attr("id", "ssTests");
	var ssTestsText1 = ssTests.append("div").attr("id", "ssTestsText1");
	ssTestsText1.append("p").text("This is the list of the currently saved tests.");
	ssTestsText1.append("p").text("Check the ones you want to add to the comparison.");

	var pingBlocks = [];
	var sPing = sTests.append("div").attr("id", "sPing");
	var sPingTitle = sPing.append("h3").text("Ping tests");
	if ( tests.bandwidthtests == undefined || tests.bandwidthtests.length==0) {
		sPing.append("p").text("No ping tests available");
	}
	else {
		var sPingTable = sPing.append("table").attr("id", "sPingTable");
		var sPingTableRowHeader = sPingTable.append("tr").attr("id","sPingTableRowHeader");
		sPingTableRowHeader.append("td").append("b").text("Test block");
		sPingTableRowHeader.append("td").append("b").text("BMX6 algorithm");
		sPingTableRowHeader.append("td").append("b").text("Iterations");
		sPingTableRowHeader.append("td").append("b").text("Pings/iteration");
		sPingTableRowHeader.append("td").append("b").text("Select");

		for (var i=0; i<tests.pingtests.length; i++) {

			if (i==0 || tests.pingtests[i].block != tests.pingtests[i-1].block)  {
				sPingTable.append("tr").attr("id","sPingTableRow"+tests.pingtests[i].block);
				d3.select("#sPingTableRow"+tests.pingtests[i].block).append("td")
					.text(tests.pingtests[i].block);
				d3.select("#sPingTableRow"+tests.pingtests[i].block).append("td").append("p")
					.text( "Algorithm: " + tests.pingtests[i].algorithm.value)
					.append("p").text("Exponents: " + tests.pingtests[i].algorithm.rxExpNumerator + " / "
							+ tests.pingtests[i].algorithm.rxExpDivisor + " / "
							+ tests.pingtests[i].algorithm.txExpNumerator + " / "
							+ tests.pingtests[i].algorithm.txExpDivisor);
				d3.select("#sPingTableRow"+tests.pingtests[i].block).append("td")
					.text(pingIterationsPerBlock(tests.pingtests[i].block));
				d3.select("#sPingTableRow"+tests.pingtests[i].block).append("td")
					.text(tests.pingtests[i].pings.length);
				d3.select("#sPingTableRow"+tests.pingtests[i].block).append("td")
					.append("input").attr("type","checkbox").attr("checked",null).attr("id","pingTestSelect").attr("value",tests.pingtests[i].block)
					.attr("onclick",'visualizePings ("'+nodeId+'","sPingGraph",d3.selectAll("#pingTestSelect")[0].filter( function (element){ if (element.checked) return true; else return false;}).map( function(element){return (element.value);}))');
			}

		}

		var sPingButtons = sTests.append("div").attr("id", "sPingButtons").attr("style", "clear:both");
		var sPingGraph = sTests.append("div").attr("id", "sPingGraph");



		sPingButtons.append("button")
			.attr("style", "clear:both")
			.attr("id", "sPingButton")
			.attr("class", "btn")
			.attr("onclick",'visualizePings ("'+nodeId+'","sPingGraph",d3.selectAll("#pingTestSelect")[0].filter( function (element){ if (element.checked) return true; else return false;}).map( function(element){return (element.value);}))')
			.append("text").text("Visualize the selected ping results");



	}

	var bwBlocks = [];
	var sBw = sTests.append("div").attr("id", "sBw");
	var sBwTitle = sBw.append("h3").text("Bandwidth tests");
	if ( tests.bandwidthtests == undefined || tests.bandwidthtests.length==0) {
		sBw.append("p").text("No bandwidth tests available");
	}
	else {
		var sBwTable = sBw.append("table").attr("id", "sBwTable");
		var sBwTableRowHeader = sBwTable.append("tr").attr("id","sBwTableRowHeader");
		sBwTableRowHeader.append("td").append("b").text("Test block");
		sBwTableRowHeader.append("td").append("b").text("BMX6 algorithm");
		sBwTableRowHeader.append("td").append("b").text("Iterations");
		sBwTableRowHeader.append("td").append("b").text("Duration");
		sBwTableRowHeader.append("td").append("b").text("Select");

		for (var i=0; i<tests.bandwidthtests.length; i++) {

			if (i==0 || tests.bandwidthtests[i].block != tests.bandwidthtests[i-1].block)  {
				sBwTable.append("tr").attr("id","sBwTableRow"+tests.bandwidthtests[i].block);
				d3.select("#sBwTableRow"+tests.bandwidthtests[i].block).append("td")
					.text(tests.bandwidthtests[i].block);
				d3.select("#sBwTableRow"+tests.bandwidthtests[i].block).append("td").append("p")
					.text( "Algorithm: " + tests.bandwidthtests[i].algorithm.value)
					.append("p").text("Exponents: " + tests.bandwidthtests[i].algorithm.rxExpNumerator + " / "
							+ tests.bandwidthtests[i].algorithm.rxExpDivisor + " / "
							+ tests.bandwidthtests[i].algorithm.txExpNumerator + " / "
							+ tests.bandwidthtests[i].algorithm.txExpDivisor);
				d3.select("#sBwTableRow"+tests.bandwidthtests[i].block).append("td")
					.text(parseInt(tests.bandwidthtests[i].iterations));
				d3.select("#sBwTableRow"+tests.bandwidthtests[i].block).append("td")
					.text(bwDurationBlock(tests.bandwidthtests[i].block));
				d3.select("#sBwTableRow"+tests.bandwidthtests[i].block).append("td")
					.append("input").attr("type","checkbox").attr("checked",null).attr("id","bwTestSelect").attr("value",tests.bandwidthtests[i].block)
					.attr("onclick",'visualizeBws ("'+nodeId+'","sBwGraph",d3.selectAll("#bwTestSelect")[0].filter( function (element){ if (element.checked) return true; else return false;}).map( function(element){return (element.value);}))');
			}

		}

		var sBwButtons = sTests.append("div").attr("id", "sBwButtons").attr("style", "clear:both");
		var sBwGraph = sTests.append("div").attr("id", "sBwGraph");



		sBwButtons.append("button")
			.attr("style", "clear:both")
			.attr("id", "sBwButton")
			.attr("class", "btn")
			.attr("onclick",'visualizeBws ("'+nodeId+'","sBwGraph",d3.selectAll("#bwTestSelect")[0].filter( function (element){ if (element.checked) return true; else return false;}).map( function(element){return (element.value);}))')
			.append("text").text("Visualize the selected bandwidth results");



	}

	var sButtons = sTests.append("div").attr("id", "sButtons").attr("style", "clear:both");

	//Back button
	sButtons.append("button")
		.attr("id", "sButtonsBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingMain("'+nodeId+'")' )
		.append("text").text("Back");
}

function visualizePings(nodeId, d3selection, pingBlocks) {

	var sSpace = d3.select("#"+d3selection);
	sSpace.html("");
	console.log ("AAAAAAA",pingBlocks);
	var data = [];

	for (var i=0; i<pingBlocks.length; i++) {

		var graphObject = {};
		graphObject.algorithm = pingAlgorithmBlock(i);
		graphObject.label = "Test block "+ parseInt(pingBlocks[i]);
		graphObject.algorithmLabel = "Alg. " + graphObject.algorithm.value +
			". Exp. " + graphObject.algorithm.rxExpNumerator +
			" / " + graphObject.algorithm.rxExpDivisor +
			" / " + graphObject.algorithm.txExpNumerator +
			" / " + graphObject.algorithm.txExpDivisor;
		graphObject.block = parseInt(pingBlocks[i]);
		graphObject.iterations = pingIterationsBlock(pingBlocks[i]);
		graphObject.pings = pingAllBlockPings(pingBlocks[i]);
		graphObject.max = Math.max.apply(null, graphObject.pings);
		graphObject.min = Math.min.apply(null, graphObject.pings);
		graphObject.sum = sumatoryArray(graphObject.pings);
		graphObject.avg = averageArray(graphObject.pings);
		graphObject.stdev = stdevArray(graphObject.pings);
		graphObject.measures = [
			{"name":"stdev","value":graphObject.stdev},
			{"name":"avg","value":graphObject.avg},
			{"name":"max","value":graphObject.max},
			{"name":"min","value":graphObject.min}
		];

		data.push(graphObject);
	}
	console.log(data);

	var gMargin = {top: 20, right: 20, bottom: 30, left: 40},
    gWidth = 960 - gMargin.left - gMargin.right,
    gHeight = 500 - gMargin.top - gMargin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, gWidth], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([gHeight, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var gSvg = sSpace.append("svg")
		.attr("width", gWidth + gMargin.left + gMargin.right)
		.attr("height", gHeight + gMargin.top + gMargin.bottom)
  		.append("g")
		.attr("transform", "translate(" + gMargin.left + "," + gMargin.top + ")");

		var ageNames = ["avg", "min", "max", "stdev"];
		console.log(ageNames);
	data.forEach(function(d) {
		d.measures = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	});

  	x0.domain(data.map(function(d) { return d.label; }));
  	x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  	y.domain([0, d3.max(data, function(d) { return d3.max(d.measures, function(d) { return d.value; }); })]);

  gSvg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + gHeight + ")")
	  .call(xAxis);

  gSvg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Time [ms]");

	var state = gSvg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) {return "translate(" + x0(d.label) + ",0)"; });

  state.selectAll("rect")
	  .data(function(d) { return d.measures; })
	.enter().append("rect")
	  .attr("width", x1.rangeBand())
	  .attr("x", function(d) { return x1(d.name); })
	  .attr("y", function(d) { return y(d.value); })
	  .attr("height", function(d) { return gHeight - y(d.value); })
	  .style("fill", function(d) { return color(d.name); });

	var legend = gSvg.selectAll(".legend")
		.data(ageNames.slice())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
	  .attr("x", gWidth - 18)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", color);

  legend.append("text")
	  .attr("x", gWidth - 24)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "end")
	  .text(function(d) { return d; });

}

function visualizeBws(nodeId, d3selection, bwBlocks) {

	var sSpace = d3.select("#"+d3selection);
	sSpace.html("");
	console.log ("AAAAAAA",bwBlocks);
	var data = [];

	for (var i=0; i<bwBlocks.length; i++) {

		var graphObject = {};
		graphObject.algorithm = bwAlgorithmBlock(i);
		graphObject.label = "Test block "+ parseInt(bwBlocks[i]);
		graphObject.algorithmLabel = "Alg. " + graphObject.algorithm.value +
			". Exp. " + graphObject.algorithm.rxExpNumerator +
			" / " + graphObject.algorithm.rxExpDivisor +
			" / " + graphObject.algorithm.txExpNumerator +
			" / " + graphObject.algorithm.txExpDivisor;
		graphObject.block = parseInt(bwBlocks[i]);
		graphObject.iterations = bwIterationsPerBlock(bwBlocks[i]);
		graphObject.bws = bwAllBlockBws(bwBlocks[i]);
		graphObject.max = Math.max.apply(null, graphObject.bws);
		graphObject.min = Math.min.apply(null, graphObject.bws);
		graphObject.sum = sumatoryArray(graphObject.bws);
		graphObject.avg = averageArray(graphObject.bws);
		graphObject.stdev = stdevArray(graphObject.bws);
		graphObject.measures = [
			{"name":"stdev","value":graphObject.stdev},
			{"name":"avg","value":graphObject.avg},
			{"name":"max","value":graphObject.max},
			{"name":"min","value":graphObject.min}
		];

		data.push(graphObject);
	}
	console.log(data);

	var gMargin = {top: 20, right: 20, bottom: 30, left: 40},
    gWidth = 960 - gMargin.left - gMargin.right,
    gHeight = 500 - gMargin.top - gMargin.bottom;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([0, gWidth], .1);

	var x1 = d3.scale.ordinal();

	var y = d3.scale.linear()
		.range([gHeight, 0]);

	var color = d3.scale.ordinal()
		.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var gSvg = sSpace.append("svg")
		.attr("width", gWidth + gMargin.left + gMargin.right)
		.attr("height", gHeight + gMargin.top + gMargin.bottom)
  		.append("g")
		.attr("transform", "translate(" + gMargin.left + "," + gMargin.top + ")");

		var ageNames = ["avg", "min", "max", "stdev"];
		console.log(ageNames);
	data.forEach(function(d) {
		d.measures = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
	});

  	x0.domain(data.map(function(d) { return d.label; }));
  	x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  	y.domain([0, d3.max(data, function(d) { return d3.max(d.measures, function(d) { return d.value; }); })]);

  gSvg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + gHeight + ")")
	  .call(xAxis);

  gSvg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Bandwidth [b/s]");

	var state = gSvg.selectAll(".state")
		.data(data)
		.enter().append("g")
		.attr("class", "g")
		.attr("transform", function(d) {return "translate(" + x0(d.label) + ",0)"; });

  state.selectAll("rect")
	  .data(function(d) { return d.measures; })
	.enter().append("rect")
	  .attr("width", x1.rangeBand())
	  .attr("x", function(d) { return x1(d.name); })
	  .attr("y", function(d) { return y(d.value); })
	  .attr("height", function(d) { return gHeight - y(d.value); })
	  .style("fill", function(d) { return color(d.name); });

	var legend = gSvg.selectAll(".legend")
		.data(ageNames.slice())
		.enter().append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
	  .attr("x", gWidth - 18)
	  .attr("width", 18)
	  .attr("height", 18)
	  .style("fill", color);

  legend.append("text")
	  .attr("x", gWidth - 24)
	  .attr("y", 9)
	  .attr("dy", ".35em")
	  .style("text-anchor", "end")
	  .text(function(d) { return d; });

}

function bwDurationBlock(block) {
	if ( tests.bandwidthtests != undefined && tests.bandwidthtests.length>0 ) {
		var result = -1;
		//Get the bandwidth tests that belong to the block
		getBwTestsInBlock(block).map(function(element) {
			return element.raw;
		}).some(function (element){
			if (element != "" && element.intervals != undefined) {
				result = element.intervals.length;
				return true;
			}

		});
	}
	else
		return -1;
}

function getBwTestsInBlock(block) {
	var result = [];
	tests.bandwidthtests.map(function(element) {
		if (element.block == block) {
			result.push(element);
		}
	});
	return result;
}

function bwAlgorithmBlock(block) {
	if ( tests.bandwidthtests != undefined && tests.bandwidthtests.length>0 ) {
		return tests.bandwidthtests[tests.bandwidthtests.map(function(element) { return parseInt(element.block); }).indexOf(parseInt(block))].algorithm;
	}
	else
		return -1;
}

function bwIterationsPerBlock(block) {
	if ( tests.bandwidthtests != undefined && tests.bandwidthtests.length>0 ) {
		var i = 0;
		tests.bandwidthtests.forEach(function(element) {
			if ( parseInt(element.block) == parseInt(block) )
				i++;
		});
		return i;
	}
	else
		return 0;
}

function bwAllBlockBws(block) {
	if ( tests.bandwidthtests != undefined && tests.bandwidthtests.length>0 ) {
		var allBws = [];
		tests.bandwidthtests.forEach(function(element) {
			if (parseInt(element.block) == parseInt(block))
				if (element.raw != "" && element.raw.end != undefined && element.raw.end.sum_sent != undefined && element.raw.end.sum_sent.bits_per_second != undefined) {
					allBws.push(element.raw.end.sum_sent.bits_per_second);
				}
				else {
					allBws.push(0);
				}
		});
		return allBws;
	}
	else
		return -1;
}

function pingIterationsPerBlock(block) {
	if ( tests.pingtests != undefined && tests.pingtests.length>0 ) {
		var i = 0;
		tests.pingtests.forEach(function(element) {
			if ( parseInt(element.block) == parseInt(block) )
				i++;
		});
		return i;
	}
	else
		return 0;
}

function pingAlgorithmBlock(block) {
	if ( tests.pingtests != undefined && tests.pingtests.length>0 ) {
		return tests.pingtests[tests.pingtests.map(function(element) { return parseInt(element.block); }).indexOf(parseInt(block))].algorithm;
	}
	else
		return -1;
}

function pingIterationsBlock(block) {
	if ( tests.pingtests != undefined && tests.pingtests.length>0 ) {
		return parseInt(tests.pingtests[tests.pingtests.map(function(element) { return parseInt(element.block); }).indexOf(parseInt(block))].iterations);
	}
	else
		return -1;
}

function pingAllBlockPings(block) {
	if ( tests.pingtests != undefined && tests.pingtests.length>0 ) {
		var allPings = [];
		tests.pingtests.forEach(function(element) {
			if (parseInt(element.block) == parseInt(block))
				allPings = allPings.concat(element.pings);
		});
		return allPings;
	}
	else
		return -1;
}

function averageArray(data){
	var sum = data.reduce(function(sum, value){
		return sum + Number(value);
	}, 0);

	var avg = sum / data.length;
	return avg;
}

function sumatoryArray(data){
	return data.reduce(function(sum, value){
		return sum + parseFloat(value);
	}, 0);
}

function stdevArray( data ){
	var avg = averageArray(data);

	return Math.sqrt(data.reduce(function(stdev, value){
		return stdev + Math.pow(Number(value)-avg,2);
	}, 0)/data.length);
};