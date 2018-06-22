function testingAdvanced(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

	//var arr_protocols = [{"name":"TCP", "value":""},{"name":"UDP", "value":"-u "}];
	var arr_protocols = [{"name":"UDP", "value":"-u "},{"name":"TCP", "value":""}];
	var arr_mss = [	{"name":"Default", "value":""},
					{"name":"100 bytes", "value":" -M 100 "},
					{"name":"200 bytes", "value":" -M 200 "},
					{"name":"500 bytes", "value":" -M 500 "},
					{"name":"1000 bytes", "value":" -M 1000 "},
					{"name":"2000 bytes", "value":" -M 2000 "},
					{"name":"5000 bytes", "value":" -M 5000 "}];

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var sHeader = sSpace.append("div").attr("id", "sHeader");

	var sTitle = sHeader.append("div").attr("id", "sTitle");
	sTitle.append("h2").text("Advanced tests");

	var sText1 = sSpace.append("div").attr("id", "sText1").append("p");
	sText1.text("A description of what can be done here.");


	//Nodes
	var sNodes = sSpace.append("div").attr("id","sNodes");
	var sNodesTitle = sNodes.append("h3").text("Nodes selection");
	var ssNodes = sNodes.append("div").attr("id", "ssNodes");
	var ssNodesText1 = ssNodes.append("div").attr("id", "ssNodesText1").append("p").text("A description on how to select the nodes.");

	//Node A
	var ssNodesA = ssNodes.append("div").attr("id", "ssNodesA").attr("class", "dropdown-left");
	ssNodesA.append("div").attr("id", "ssNodeALabel").attr("class", "dropdown-desc").text("Origin node:");

	createSelectNodes(ssNodesA, "nodeA", sortedNodes());
	NodeASelect = d3.select("#nodeA");

	NodeASelect.selectAll("option[value="+nodeIdA+"]").attr("selected",true);
	if (showAll)
		NodeASelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeASelect.attr("onchange",'testingAdvancedSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	//Node B
	var ssNodesB = ssNodes.append("div").attr("id", "ssNodesB").attr("class", "dropdown-right");

	ssNodesB.append("div").attr("id", "ssNodesBLabel").attr("class", "dropdown-desc").text("Destination node:");

	createSelectNodes(ssNodesB, "nodeB", sortedNodes());
	NodeBSelect = d3.select("#nodeB");

	NodeBSelect.selectAll("option[value="+nodeIdB+"]").attr("selected",true);
	if (showAll)
		NodeBSelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeBSelect.attr("onchange",'testingAdvancedSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	//Nodes warning
	var ssNodesPD = ssNodes.append("div").attr("id", "ssNodesP").attr("style", "clear:left; color:red").text("");
	ssNodes.append("p");


	//Current Destination node algorithm
	var sAlgoCurrent = sSpace.append("div").attr("id","sAlgo");
	var sAlgoCurrentTitle = sAlgoCurrent.append("h3").text("Current routing algorithm");
	var sAlgoCurrentText1 = sAlgoCurrent.append("div").attr("id", "sAlgoCurrentText1").append("p").text("Current algorithm text.");

	var bmx6Algo = generateBmx6Algo (nodeIdB, true);
	console.log("AAAAAAAAAA", bmx6Algo, JSON.stringify(bmx6Algo));

	sAlgoCurrent.append("div").attr("id", "sAlgoCurrentValueLabel").attr("class", "dropdown-desc").append("p").text("Algorithm: " + bmx6Algo.value + " (" + bmx6Algo.texts[bmx6Algo.texts.map(function(d){return d.value; }).indexOf(parseInt(bmx6Algo.value))].name + ")" );
	sAlgoCurrent.append("div").attr("id", "sAlgoCurrentExpoLabel").attr("class", "dropdown-desc").append("p");

	for (var i=0; i<bmx6Algo.exponents.length; i++) {
		d3.select("#sAlgoCurrentExpoLabel").text(d3.select("#sAlgoCurrentExpoLabel").text() + bmx6Algo.exponents[i].name + ": " + bmx6Algo.exponents[i].value);
		if (i<bmx6Algo.exponents.length-1)
			d3.select("#sAlgoCurrentExpoLabel").text(d3.select("#sAlgoCurrentExpoLabel").text() + " // ");
	}

	sAlgoCurrent.append("p");


	//New Destination node algorithm
	var sAlgoNew = sSpace.append("div").attr("id","sAlgo");
	var sAlgoNewTitle = sAlgoNew.append("h3").text("Modify routing algorithm");
	var sAlgoNewText1 = sAlgoNew.append("div").attr("id", "sAlgoNewText1").append("p").text("Change the routing algorithm before performing the tests.");

	var sAlgoNewValue = sAlgoNew.append("div").attr("id", "sAlgoNewValue");
	sAlgoNewValue.append("div").attr("id", "sAlgoNewValueLabel").attr("class", "dropdown-desc").text("Algorithm:");
	createSelectAlgorithm(sAlgoNewValue, "sAlgoNewValueSelect", bmx6Algo.texts);
	d3.select("#sAlgoNewValueSelect").selectAll('option[value="'+bmx6Algo.value+'"]').attr("selected",true);

	for (var i=0; i < bmx6Algo.exponents.length; i++) {
		sAlgoNewValue.append("div").attr("id", "sAlgoNewExponentLabel"+i).attr("class", "dropdown-desc").text(bmx6Algo.exponents[i].name+":");
		createSelectNumber(sAlgoNewValue, bmx6Algo.exponents[i].name, createDropdownVector(bmx6Algo.exponents[i].min, bmx6Algo.exponents[i].max), bmx6Algo.exponents[i].def);
		d3.select("#"+bmx6Algo.exponents[i].name).selectAll('option[value="'+bmx6Algo.exponents[i].value+'"]').attr("selected",true);
	}


	//Ping test

	var sPing = sSpace.append("div").attr("id", "sPing").attr("style", "clear:both");
	var sPingTitle = sPing.append("h3").text("Ping test");
	var sPingText1 = sPing.append("div").attr("id", "sPingText1").append("p").text("Perform a ping test.");

	var sPingCount = sPing.append("div").attr("id", "sPingCount").attr("class", "dropdown-left");
	sPingCount.append("div").attr("id", "sPingCountLabel").attr("class", "dropdown-desc").text("Ping count per iteration:");
	sPingCount.append("input")
		.attr("id","sPingCountValue")
		.attr("type","number")
		.attr("max", 20)
		.attr("min", 1)
		.attr("value", 2);

	var sPingSize = sPing.append("div").attr("id", "sPingSize").attr("class", "dropdown-right");
	sPingSize.append("div").attr("id", "sPingSizeLabel").attr("class", "dropdown-desc").text("Packet size (bytes):");
	sPingSize.append("input")
		.attr("id","sPingSizeValue")
		.attr("type","number")
		.attr("max", 65507)
		.attr("min", 0)
		.attr("value", 56);


	//Bandwidth test

	var sBandwidth = sSpace.append("div").attr("id", "sBandwidth").attr("style", "clear:both");
	var sBandwidthTitle = sBandwidth.append("h3").text("Bandwidth test");
	var sBandwidthText1 = sBandwidth.append("div").attr("id", "sBandwidthText1").append("p").text("Perform a bandwidth test.");

	var sBandwidthProtocol = sBandwidth.append("div").attr("id", "sBandwidthProtocol").attr("class", "dropdown-left").attr("style", "clear:both");
	sBandwidthProtocol.append("div").attr("id", "sBandwidthProtocolLabel").attr("class", "dropdown-desc").text("Protocol:");
	sBandwidthProtocol.append("select")
		.attr("id","sBandwidthProtocolValue")
		.attr("type","select")
		.selectAll("option")
		.data(arr_protocols)
		.enter()
		.append("option")
		.attr("value", function(d) {return d.value})
		.text(function (d) {return d.name});

	var sBandwidthBandwidth = sBandwidth.append("div").attr("id", "sBandwidthBandwidth").attr("class", "dropdown-right");
	sBandwidthBandwidth.append("div").attr("id", "sBandwidthBandwidthLabel").attr("class", "dropdown-desc").text("Target bandwidth (Mbps):");
	sBandwidthBandwidth.append("input")
		.attr("id","sBandwidthBandwidthValue")
		.attr("type","number")
		.attr("min", 0)
		.attr("value", 0);

	var sBandwidthDuration = sBandwidth.append("div").attr("id", "sBandwidthDuration").attr("class", "dropdown-left").attr("style", "clear:both");
	sBandwidthDuration.append("div").attr("id", "sBandwidthDurationLabel").attr("class", "dropdown-desc").text("Bandwidth test duration (s):");
	sBandwidthDuration.append("input")
		.attr("id","sBandwidthDurationValue")
		.attr("type","number")
		.attr("max", 20)
		.attr("min", 1)
		.attr("value", 10);

	var sBandwidthMSS = sBandwidth.append("div").attr("id", "sBandwidthMSS").attr("class", "dropdown-right");
	sBandwidthMSS.append("div").attr("id", "sBandwidthMSSLabel").attr("class", "dropdown-desc").text("Max. segment size (MTU - 40B):");
	sBandwidthMSS.append("select")
		.attr("id","sBandwidthMSSValue")
		.attr("type","select")
		.selectAll("option")
		.data(arr_mss)
		.enter()
		.append("option")
		.attr("value", function(d) {return d.value})
		.text(function (d) {return d.name});


	//Test parameters
	var sParameters = sSpace.append("div").attr("id", "sParameters").attr("style", "clear:both");
	var sParametersTitle = sParameters.append("h3").text("Test parameters");
	var sParametersText1 = sParameters.append("div").attr("id", "sBandwidthText1").append("p").text("Define here the number of tests to perform and the spacing between them.");

	var sParametersIterations = sParameters.append("div").attr("id", "sParametersIterations").attr("class", "dropdown-left");
	sParametersIterations.append("div").attr("id", "sParametersIterationsLabel").attr("class", "dropdown-desc").text("Iterations:");
	sParametersIterations.append("input")
		.attr("id","sParametersIterationsValue")
		.attr("type","number")
		.attr("max", 100)
		.attr("min", 1)
		.attr("value", 1);

	var sParametersPause = sParameters.append("div").attr("id", "sParametersPause").attr("class", "dropdown-right");
	sParametersPause.append("div").attr("id", "sParametersPauseLabel").attr("class", "dropdown-desc").text("Pause between iterations (s):");
	sParametersPause.append("input")
		.attr("id","sParametersPauseValue")
		.attr("type","number")
		.attr("max", 3600)
		.attr("min", 0)
		.attr("value", 5);

	sParameters.append("p");

	var sParametersClear = sParameters.append("div").attr("id", "sParametersClear").attr("style", "clear:both");
	sParametersClear.append("div").attr("id", "sParametersClearLabel").attr("class", "dropdown-left").attr("style", "clear:both").text("Clear previous tests saved data");
	sParametersClear.append("input")
		.attr("id","sParametersClearValue")
		.attr("type","checkbox");

	sParameters.append("p");

	var sButtons = sSpace.append("div").attr("id", "sButtons").attr("style", "clear:both");

	//Back button
	sButtons.append("button")
		.attr("id", "sButtonsBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingMain("'+nodeId+'")' )
		.append("text").text("Back");

	//Run button
	sButtons.append("button")
		.attr("id", "sButtonsRun")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingAdvancedRun ( \
			"'+nodeId+'",\
			document.getElementById("nodeA").value,\
			document.getElementById("nodeB").value,\
			{value:document.getElementById("sAlgoNewValueSelect").value,\
			 exponents:[document.getElementById("rxExpNumerator").value, document.getElementById("rxExpDivisor").value,\
			  document.getElementById("txExpNumerator").value, document.getElementById("txExpDivisor").value]},\
			" -c " + document.getElementById("sPingCountValue").value + " -s " + document.getElementById("sPingSizeValue").value,\
			document.getElementById("sBandwidthProtocolValue").value + " -b " + document.getElementById("sBandwidthBandwidthValue").value + "M" + " -t " + document.getElementById("sBandwidthDurationValue").value + document.getElementById("sBandwidthMSSValue").value,\
			document.getElementById("sParametersIterationsValue").value,\
			document.getElementById("sParametersPauseValue").value,\
			document.getElementById("sParametersClearValue").checked,\
			"'+d3selection+'")')
		.append("text").text("Perform tests");

	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value) {
		d3.select("#sButtonsRun").attr("disabled", true);
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	}
}



function testingAdvancedRun(nodeId, nodeIdA, nodeIdB, algorithm, pingParameters, bandwidthParameters, iterations, pause, clear, d3selection, currenti) {

	var debug = arguments;
    console.log("Function " + debug.callee.name + " called.", nodeId, nodeIdA, nodeIdB, algorithm, pingParameters, bandwidthParameters, iterations, pause, clear, d3selection, currenti);

	iterations = typeof iterations !== 'undefined' ? iterations : 1;
	pause = typeof pause !== 'undefined' ? pause : 0;
	clear = typeof clear !== 'undefined' ? clear : false;
	currenti = typeof currenti !== 'undefined' ? currenti : 1;

	//Clear previous test results if needed
	if (clear && currenti == 1)
		tests = {};

	//Clear space
	var sSpace = d3.select("#"+d3selection);
	sSpace.html("");

	//Header and subtile
	var sHeader = sSpace.append("div").attr("id", "sHeader");
	var sTitle = sHeader.append("h2").text("Advanced tests");


	//Test progress
	var sProgress = sSpace.append("div").attr("id", "sProgress");
	sProgress.append("h3").text("Test progress");
	sProgress.append("p").text("Performing iteration " + currenti + " of " + iterations);

	//Modify algorithm
	if (currenti==1) {
		var sAlgorithm = sSpace.append("div").attr("id", "sAlgorithm");
		sAlgorithm.append("h3").text("Routing algorithm");

		sAlgorithm.append("p").text("Setting routing algorithm metric calculation parameters on destination node...");

		bmx6SetBmx6Algo(nodeIdB, algorithm.value, algorithm.exponents[0], algorithm.exponents[1], algorithm.exponents[2], algorithm.exponents[3], false);

		sAlgorithm.append("p").text("Done.");

	}

	//Path discovery
	var sPath = sSpace.append("div").attr("id", "sPath");
	sPath.append("h3").text("Path discovery");

	var sPathResult = sSpace.append("div").attr("id", "sPathResult");
	testingPathCalc(nodeId, nodeIdA, nodeIdB, "sPathResult", false);

	//Ping test
	var sPing = sSpace.append("div").attr("id", "sPing");
	sPing.append("h3").text("Ping test");

	sPing.append("p").text("Performing ping test...");

	var pingresult = ping6test(nodeIdA, id2ipv6(nodeIdB), pingParameters, false);
	var pingObject = {};
		pingObject.timestamp = Date.now();
		pingObject.raw = pingresult;
		pingObject.pings = [];
		pingObject.raw.split("time=").forEach(function(d){ pingObject.pings.push(d.split(" ms")[0]);});
		pingObject.pings.shift();
		pingObject.iterations = iterations;
		pingObject.iteration = currenti;
		pingObject.pause = pause;
		pingObject.parameters = pingParameters;

	sPing.append("pre").text(pingresult);
	sPing.append("p").text("Done.");

	//Bandwidth test
	var sBandwidth = sSpace.append("div").attr("id", "sBandwidth");
	sBandwidth.append("h3").text("Bandwidth test");

	sBandwidth.append("p").text("Performing bandwidth test...");

	var bandwidthresult = iperf3test(nodeIdA, id2ipv6(nodeIdB), false, bandwidthParameters);

	if (bandwidthresult.end != undefined &&
		bandwidthresult.end.sum_received != undefined &&
		bandwidthresult.end.sum_received.bits_per_second != undefined ) {

		var bandwidthValue = (bandwidthresult.end.sum_received.bits_per_second/1000000).toString().split(".");
		sBandwidth.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
	}
	else if (bandwidthresult.end != undefined &&
		bandwidthresult.end.sum != undefined &&
		bandwidthresult.end.sum.bits_per_second != undefined ) {

		var bandwidthValue = (bandwidthresult.end.sum.bits_per_second/1000000).toString().split(".");
		sBandwidth.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
	}
	else
		sBandwidth.append("pre").text(bandwidthresult.error);

	var bandwidthObject = {};
		bandwidthObject.timestamp = Date.now();
		bandwidthObject.raw = bandwidthresult;
		bandwidthObject.iterations = iterations;
		bandwidthObject.iteration = currenti;
		bandwidthObject.pause = pause;
		bandwidthObject.parameters = bandwidthParameters;

	sBandwidth.append("p").text("Done.");

	//Save data
	var sSave = sSpace.append("div").attr("id", "sSave");
	sSave.append("h3").text("Save data");

	sSave.append("p").text("Saving data...");
	savePath(nodeIdA, nodeIdB, Date.now());
	savePath(nodeIdB, nodeIdA, Date.now());
	savePing(nodeIdA, nodeIdB, pingObject);
	saveBandwidth(nodeIdA, nodeIdB, bandwidthObject);
	sSave.append("p").text("Done.");


	//Buttons div
	var sButtons = sSpace.append("div").attr("id", "sButtons").attr("style", "clear:both");

	//Schedule next iteration or show buttons
	if (currenti < iterations) {
	setTimeout( function (){
			testingAdvancedRun(nodeId, nodeIdA, nodeIdB, algorithm, pingParameters, bandwidthParameters, iterations, pause, clear, d3selection, currenti+1);
			}, pause*1000);

	//TODO: add stop button
	}

	else {

		//Back button
		sButtons.append("button")
		.attr("id", "sButtonsBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingAdvanced("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Back");
	}
}

function testingAdvancedSelectNode(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
		showAllNodes();
		testingAdvanced(nodeId, d3selection, nodeIdA, nodeId, false);
	}
	else if (nodeIdA == nodeIdB) {
		d3.select("#sButtonsRun").attr("disabled", true);
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	}
	else if (nodeIdA != nodeIdB) {
		d3.select("#ssNodesP").text("");
		d3.select("#sButtonsRun").attr("disabled", null);
	}
}









