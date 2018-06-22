function testingBasic(nodeId, d3selection) {

	var MainSpace = d3.select("#"+d3selection);

	MainSpace.html("");

	var sHeader = MainSpace.append("div").attr("id", "sHeader");

	var sTitle = sHeader.append("div").attr("id", "sTitle");
	sTitle.append("h2").text("Basic tests");

	var sSpace = MainSpace.append("div").attr("id","sSpace");

	var sDesc1 = sSpace.append("div").attr("id", "sDesc1");
	sDesc1.append("p").text("Select one of the following tests:");

	sSpace.append("button")
		.attr("id", "sBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingMain("'+nodeId+'", "sSpace")' )
		.append("text").text("Back");

	sSpace.append("button")
				.attr("id", "sPingButton")
				.attr("class", "btn btn-group")
				.attr("onclick", 'testingBasicPingSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Ping test");

	sSpace.append("button")
				.attr("id", "sBandwidthButton")
				.attr("class", "btn btn-group")
				.attr("onclick", 'testingBasicBandwidthSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Bandwidth test");

	sSpace.append("button")
				.attr("id", "sPathButton")
				.attr("class", "btn btn-group")
				.attr("onclick", 'testingBasicPathSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Path discovery");

}


function testingBasicBandwidthSelect(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

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

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");
	ssTitle.append("h3").text("Basic bandwidth test");

	var ssSpace = sSpace.append("div").attr("id","ssSpace");

	var ssText1 = ssSpace.append("div").attr("id", "ssText1");
	ssText1.append("p").text("Select the origin and destination nodes:");

	//Nodes
	var ssNodes = ssSpace.append("div").attr("id", "ssNodes");

	//Node A
	var ssNodeA = ssNodes.append("div").attr("id", "ssNodeA").attr("class", "dropdown-left");

	ssNodeA.append("div").attr("id", "ssNodeALabel").attr("class", "dropdown-desc").text("Origin node:");

	createSelectNodes(ssNodeA, "nodeA", sortedNodes());
	NodeASelect = d3.select("#nodeA");

	NodeASelect.selectAll("option[value="+nodeIdA+"]").attr("selected",true);
	if (showAll)
		NodeASelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeASelect.attr("onchange",'testingBasicBandwidthSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	ssNodeA.append("p");

	//Node B
	var ssNodeB = ssNodes.append("div").attr("id", "ssNodeB").attr("class", "dropdown-right");

	ssNodeB.append("div").attr("id", "ssNodeBLabel").attr("class", "dropdown-desc").text("Destination node:");

	createSelectNodes(ssNodeB, "nodeB", sortedNodes());
	NodeBSelect = d3.select("#nodeB");

	NodeBSelect.selectAll("option[value="+nodeIdB+"]").attr("selected",true);
	if (showAll)
		NodeBSelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeBSelect.attr("onchange",'testingBasicBandwidthSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	var ssNodesPD = ssNodes.append("div").attr("id", "ssNodesP").attr("style", "clear:left; color:red").text("");

	ssNodes.append("p");

	//Test parameters
	var ssParameters = ssSpace.append("div").attr("id", "ssParameters").attr("style", "clear:both");

	var ssParametersProtocol = ssParameters.append("div").attr("id", "ssParametersProtocol").attr("class", "dropdown-left").attr("style", "clear:both");
	ssParametersProtocol.append("div").attr("id", "ssProtocolLabel").attr("class", "dropdown-desc").text("Protocol:");
	ssParametersProtocol.append("select")
		.attr("id","ssProtocol")
		.attr("type","select")
		.selectAll("option")
		.data(arr_protocols)
		.enter()
		.append("option")
		.attr("value", function(d) {return d.value})
		.text(function (d) {return d.name});

	var ssParametersBandwidth = ssParameters.append("div").attr("id", "ssParametersBandwidth").attr("class", "dropdown-right");
	ssParametersBandwidth.append("div").attr("id", "ssParametersBandwidthLabel").attr("class", "dropdown-desc").text("Target bandwidth (Mbps):");
	ssParametersBandwidth.append("input")
		.attr("id","ssBandwidth")
		.attr("type","number")
		.attr("min", 0)
		.attr("value", 0);

	var ssParametersDuration = ssParameters.append("div").attr("id", "ssParametersDuration").attr("class", "dropdown-left").attr("style", "clear:both");
	ssParametersDuration.append("div").attr("id", "ssParametersDurationLabel").attr("class", "dropdown-desc").text("Bandwidth test duration (s):");
	ssParametersDuration.append("input")
		.attr("id","ssDuration")
		.attr("type","number")
		.attr("max", 20)
		.attr("min", 1)
		.attr("value", 2);

	var ssParametersMSS = ssParameters.append("div").attr("id", "ssParametersMSS").attr("class", "dropdown-right");
	ssParametersMSS.append("div").attr("id", "ssMSSLabel").attr("class", "dropdown-desc").text("Max. segment size (MTU - 40B):");
	ssParametersMSS.append("select")
		.attr("id","ssMSS")
		.attr("type","select")
		.selectAll("option")
		.data(arr_mss)
		.enter()
		.append("option")
		.attr("value", function(d) {return d.value})
		.text(function (d) {return d.name});

	var ssParametersIterations = ssParameters.append("div").attr("id", "ssParametersIterations").attr("class", "dropdown-left").attr("style", "clear:both");
	ssParametersIterations.append("div").attr("id", "ssParametersIterationsLabel").attr("class", "dropdown-desc").text("Iterations:");
	ssParametersIterations.append("input")
		.attr("id","ssIterations")
		.attr("type","number")
		.attr("max", 100)
		.attr("min", 1)
		.attr("value", 1);

	var ssParametersPause = ssParameters.append("div").attr("id", "ssParametersPause").attr("class", "dropdown-right");
	ssParametersPause.append("div").attr("id", "ssParametersPauseLabel").attr("class", "dropdown-desc").text("Pause between iterations (s):");
	ssParametersPause.append("input")
		.attr("id","ssPause")
		.attr("type","number")
		.attr("max", 3600)
		.attr("min", 0)
		.attr("value", 1);

	var ssParametersClear = ssParameters.append("div").attr("id", "ssParametersClear").attr("style", "clear:both");
	ssParametersClear.append("div").attr("id", "ssParametersClearLabel").attr("class", "dropdown-desc").text("Clear previous tests saved data");
	ssParametersClear.append("input")
		.attr("id","ssClear")
		.attr("type","checkbox");

	//Back button
	ssSpace.append("button")
		.attr("id", "ssBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBasic("'+nodeId+'", "sSpace")' )
           .append("text").text("Back");

	//Run button
	ssSpace.append("button")
		 .attr("id", "sRunBandwidthButton")
		 .attr("class", "btn btn-group")
		 .attr("onclick",'testingBasicBandwidthRun("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, document.getElementById("ssIterations").value, document.getElementById("ssPause").value, document.getElementById("ssClear").checked, document.getElementById("ssProtocol").value + " -b " + document.getElementById("ssBandwidth").value + " -t " + document.getElementById("ssDuration").value + document.getElementById("ssMSS").value, "sSpace")')
		 	.append("text").text("Perform bandwidth test");

	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	else
		d3.select("#ssNodesP").text("");
}

function testingBasicBandwidthRun(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, parameters, d3selection, currenti) {

	iterations = typeof iterations !== 'undefined' ? iterations : 1;
	pause = typeof pause !== 'undefined' ? pause : 0;
	currenti = typeof currenti !== 'undefined' ? currenti : 1;
	clear = typeof clear !== 'undefined' ? clear : false;

	if (clear && currenti == 1)
		tests = {};

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");

	var ssSpace = sSpace.append("div").attr("id","ssSpace");
	var ssTextIteration = ssSpace.append("div").attr("id", "ssTextIteration");
	var ssBandwidthSpace = ssSpace.append("div").attr("id", "ssBandwidthSpace");

	ssTextIteration.append("p").text("Performing iteration " + currenti + " of " + iterations);
	ssTextIteration.append("p").text("Calculating bandwidth");
	var bandwidthresult = iperf3test(nodeIdA, id2ipv6(nodeIdB), false, parameters);

	console.log(bandwidthresult);

	if (bandwidthresult.end != undefined &&
	bandwidthresult.end.sum_received != undefined &&
	bandwidthresult.end.sum_received.bits_per_second != undefined ) {

		var bandwidthValue = (bandwidthresult.end.sum_received.bits_per_second/1000000).toString().split(".");
		ssTextIteration.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
	}
	else if (bandwidthresult.end != undefined &&
	bandwidthresult.end.sum != undefined &&
	bandwidthresult.end.sum.bits_per_second != undefined ) {

		var bandwidthValue = (bandwidthresult.end.sum.bits_per_second/1000000).toString().split(".");
		ssTextIteration.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
	}
	else
		ssTextIteration.append("pre").text(bandwidthresult.error);

	ssTextIteration.append("p").text("Saving bandwidth");

	var bandwidthObject = {};
	bandwidthObject.timestamp = Date.now();
	bandwidthObject.raw = bandwidthresult;
	bandwidthObject.iterations = iterations;
	bandwidthObject.iteration = currenti;
	bandwidthObject.pause = pause;
	bandwidthObject.parameters = parameters;

	saveBandwidth(nodeIdA, nodeIdB, bandwidthObject);

	if (currenti < iterations) {

		ssTextIteration.append("p").text("Scheduling next iteration in " + pause + " seconds...");

		setTimeout( function (){
			testingBasicBandwidthRun(nodeId, nodeIdA, nodeIdB, iterations, pause, false,
			parameters, d3selection, currenti+1);
			}, pause*1000);

	}

	else {
		//ssTitle.append("h3").text("Ping calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);
		ssTextIteration.append("p").text(iterations + " out of " + iterations + " iterations performed");

		ssSpace.append("button")
			.attr("id", "ssModify")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicBandwidthSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Back to test parameters");

		ssSpace.append("button")
			.attr("id", "ssBandwidthRepeat")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicBandwidthRun("'+nodeId+'", "'+nodeIdA+'", "'+nodeIdB+'", "'+iterations+'", "'+pause+'", "'+clear+'", "'+parameters+'","ssSpace", 0)')
            .append("text").text("Repeat test");
	}

}

function testingBasicPathSelect(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");
	ssTitle.append("h3").text("Basic path");

	var ssSpace = sSpace.append("div").attr("id","ssSpace");

	var ssText1 = ssSpace.append("div").attr("id", "ssText1");
	ssText1.append("p").text("Select the origin and destination nodes:");

	//Nodes
	var ssNodes = ssSpace.append("div").attr("id", "ssNodes");

	//Node A
	var ssNodeA = ssNodes.append("div").attr("id", "ssNodeA").attr("class", "dropdown-left");

	ssNodeA.append("div").attr("id", "ssNodeALabel").attr("class", "dropdown-desc").text("Origin node:");

	createSelectNodes(ssNodeA, "nodeA", sortedNodes());
	NodeASelect = d3.select("#nodeA");

	NodeASelect.selectAll("option[value="+nodeIdA+"]").attr("selected",true);
	if (showAll)
		NodeASelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeASelect.attr("onchange",'testingBasicPathSelectNodeA("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	ssNodeA.append("p");

	//Node B
	var ssNodeB = ssNodes.append("div").attr("id", "ssNodeB").attr("class", "dropdown-right");

	ssNodeB.append("div").attr("id", "ssNodeBLabel").attr("class", "dropdown-desc").text("Destination node:");

	createSelectNodes(ssNodeB, "nodeB", sortedNodes());
	NodeBSelect = d3.select("#nodeB");

	NodeBSelect.selectAll("option[value="+nodeIdB+"]").attr("selected",true);
	if (showAll)
		NodeBSelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeBSelect.attr("onchange",'testingBasicPathSelectNodeB("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	ssNodeB.append("p");

	var ssNodesPD = ssNodes.append("div").attr("id", "ssNodesP").attr("style", "clear:left; color:red").text("");
	ssNodes.append("p");

	//Algorithm (for node B)
	var ssAlgorithm = ssSpace.append("div").attr("id", "ssAlgorithm");

	var ssAlgorithmValue = ssAlgorithm.append("div").attr("id", "ssAlgorithmValue");
	var bmx6Algo = generateBmx6Algo (nodeIdB, true);

    ssAlgorithmValue.append("div").attr("id", "ssAlgorithmValueLabel").attr("class", "dropdown-desc").append("p").text("Algorithm:");

    createSelectAlgorithm(ssAlgorithm, "Algorithm", bmx6Algo.texts);
    d3.select("#Algorithm").selectAll('option[value="'+bmx6Algo.value+'"]').attr("selected",true);

	for (var i=0; i < bmx6Algo.exponents.length; i++) {

		ssAlgorithm.append("p").text(bmx6Algo.exponents[i].name + ":");
  		createSelectNumber(ssAlgorithm, bmx6Algo.exponents[i].name, createDropdownVector(bmx6Algo.exponents[i].min, bmx6Algo.exponents[i].max), bmx6Algo.exponents[i].def);							    		d3.select("#"+bmx6Algo.exponents[i].name).selectAll('option[value="'+bmx6Algo.exponents[i].value+'"]').attr("selected",true);
	}

	//Test parameters
	var ssParameters = ssSpace.append("div").attr("id", "ssParameters");


	var ssParametersIterations = ssParameters.append("div").attr("id", "ssParametersIterations").attr("class", "dropdown-left");
	ssParametersIterations.append("div").attr("id", "ssParametersIterationsLabel").attr("class", "dropdown-desc").text("Iterations:");
	ssParametersIterations.append("input")
		.attr("id","ssIterations")
		.attr("type","number")
		.attr("max", 100)
		.attr("min", 1)
		.attr("value", 2);

	var ssParametersPause = ssParameters.append("div").attr("id", "ssParametersPause").attr("class", "dropdown-right");
	ssParametersPause.append("div").attr("id", "ssParametersPauseLabel").attr("class", "dropdown-desc").text("Pause between iterations (s):");
	ssParametersPause.append("input")
		.attr("id","ssPause")
		.attr("type","number")
		.attr("max", 3600)
		.attr("min", 0)
		.attr("value", 1);

	var ssParametersClear = ssParameters.append("div").attr("id", "ssParametersClear");
	ssParametersClear.append("div").attr("id", "ssParametersClearLabel").attr("class", "dropdown-desc").text("Clear previous tests saved data");
	ssParametersClear.append("input")
		.attr("id","ssClear")
		.attr("type","checkbox");

	//Back button
		ssSpace.append("button")
			.attr("id", "ssBack")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasic("'+nodeId+'", "sSpace")' )
            .append("text").text("Back");

	//Run button
	ssSpace.append("button")
			 .attr("id", "sRunPathButton")
			 .attr("class", "btn btn-group")
			 .attr("onclick",'testingBasicPathRun("'+nodeId+'", 		 	document.getElementById("nodeA").value, 			 	document.getElementById("nodeB").value, 			 	document.getElementById("ssIterations").value, 			 	document.getElementById("ssPause").value, 			 	document.getElementById("ssClear").checked, 			 	document.getElementById("Algorithm").value, 			 	document.getElementById("'+bmx6Algo.exponents[0].name+'").value, 			 	document.getElementById("'+bmx6Algo.exponents[1].name+'").value, 			 	document.getElementById("'+bmx6Algo.exponents[2].name+'").value, 			 	document.getElementById("'+bmx6Algo.exponents[3].name+'").value, 			 	"sSpace")')
			 	.append("text").text("Calculate path");

	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value) {
		d3.select("#sRunPathButton").attr("disabled", true);
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	}
}


function testingBasicPathRun(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, d3selection, currenti) {

	iterations = typeof iterations !== 'undefined' ? iterations : 1;
	pause = typeof pause !== 'undefined' ? pause : 0;
	currenti = typeof currenti !== 'undefined' ? currenti : 1;
	clear = typeof clear !== 'undefined' ? clear : false;
	var debug = arguments;

    console.log("Function " + debug.callee.name + " called.", nodeId, nodeIdA, nodeIdB, iterations, pause, clear, algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, d3selection);

	if (clear)
		tests = {};

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");
	//ssTitle.append("h3").text("Path calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);

	var ssSpace = sSpace.append("div").attr("id","ssSpace");
	var ssTextIteration = ssSpace.append("div").attr("id", "ssTextIteration");
	var ssPathSpace = ssSpace.append("div").attr("id", "ssPathSpace");

	if (currenti == 1)
		bmx6SetBmx6Algo(nodeIdB, algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, false);

	if (currenti <= iterations) {

		ssTextIteration.append("p").text("Performing iteration " + currenti + " of " + iterations);
		ssTextIteration.append("p").text("Calculating path");
		testingPathCalc(nodeId, nodeIdA, nodeIdB, "ssPathSpace", false);
		ssTextIteration.append("p").text("Saving path");
		savePath(nodeIdA, nodeIdB, Date.now())
		savePath(nodeIdB, nodeIdA, Date.now())
		ssTextIteration.append("p").text("Scheduling next iteration in " + pause + " seconds...");
		var nexti = currenti+1;

		if (currenti < iterations )
		setTimeout( function (){
			testingBasicPathRun(nodeId, nodeIdA, nodeIdB, iterations, pause, false,
			algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, d3selection, nexti);
			}, pause*1000);

		else
		setTimeout( function (){
			testingBasicPathRun(nodeId, nodeIdA, nodeIdB, iterations, pause, false,
			algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, d3selection, nexti);
			}, 1);

	}

	else {
		ssTitle.append("h3").text("Path calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);
		ssTextIteration.append("p").text(iterations + " out of " + iterations + " performed");

		ssSpace.append("button")
			.attr("id", "ssModify")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicPathSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Back to test parameters");

		ssSpace.append("button")
			.attr("id", "ssPathRepeat")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicPathRun("'+nodeId+'", "'+nodeIdA+'", "'+nodeIdB+'", "'+iterations+'", "'+pause+'", "'+clear+'", "'+algorithm+'", "'+rxExpNumerator+'", "'+rxExpDivisor+'", "'+txExpNumerator+'", "'+txExpDivisor+'", "ssSpace", 0)')
            .append("text").text("Repeat test");
	}
}


function testingPathCalc(nodeId, nodeIdA, nodeIdB, d3selection, showButtons) {

	showButtons = typeof showButtons !== 'undefined' ? showButtons : true;

	var ssSpace = d3.select("#"+d3selection);
	ssSpace.html("");
	var sssHeader = ssSpace.append("div").attr("id", "sssHeader");
	var sssTitle = sssHeader.append("div").attr("id", "sssTitle");
	sssTitle.append("h4").text("Path calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);
	var sssSpace = ssSpace.append("div").attr("id","sssSpace");
	var testStatus = sssSpace.append("div").attr("id", "testStatus");
	var timestamp = Date.now();
	testStatus.append("p").text("Calculating forward path (" + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name+")...")

	bmx6Path(nodeIdA, nodeIdB);

	testStatus.html("");
	testStatus.append("p").text("Calculating reverse path (" + nodes[indexNode(nodeIdB)].name + " to " + nodes[indexNode(nodeIdA)].name+")...")

	bmx6Path(nodeIdB, nodeIdA);

	testStatus.html("");
	var PathTable = createPathTable (nodeIdA, nodeIdB, testStatus, "pathTable");
	if (showButtons) {
		sssSpace.append("button")
			.attr("id", "ssPathRepeat")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingPathCalc("'+nodeId+'", "'+nodeIdA+'", "'+nodeIdB+'", "ssSpace")')
			.append("text").text("Repeat test");
		sssSpace.append("button")
			.attr("id", "ssPathSave")
			.attr("class", "btn btn-group")
			.attr("onclick",'savePath("'+nodeIdA+'", "'+nodeIdB+'", "'+timestamp+'", "ssPathSave")')
			.append("text").text("Save results");
	}
}



function testingBasicPingSelect(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");
	ssTitle.append("h3").text("Basic ping test");

	var ssSpace = sSpace.append("div").attr("id","ssSpace");

	var ssText1 = ssSpace.append("div").attr("id", "ssText1");
	ssText1.append("p").text("Select the origin and destination nodes:");

	//Nodes
	var ssNodes = ssSpace.append("div").attr("id", "ssNodes");

	//Node A
	var ssNodeA = ssNodes.append("div").attr("id", "ssNodeA").attr("class", "dropdown-left");

	ssNodeA.append("div").attr("id", "ssNodeALabel").attr("class", "dropdown-desc").text("Origin node:");

	createSelectNodes(ssNodeA, "nodeA", sortedNodes());
	NodeASelect = d3.select("#nodeA");

	NodeASelect.selectAll("option[value="+nodeIdA+"]").attr("selected",true);
	if (showAll)
		NodeASelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeASelect.attr("onchange",'testingBasicPingSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	ssNodeA.append("p");

	//Node B
	var ssNodeB = ssNodes.append("div").attr("id", "ssNodeB").attr("class", "dropdown-right");

	ssNodeB.append("div").attr("id", "ssNodeBLabel").attr("class", "dropdown-desc").text("Destination node:");

	createSelectNodes(ssNodeB, "nodeB", sortedNodes());
	NodeBSelect = d3.select("#nodeB");

	NodeBSelect.selectAll("option[value="+nodeIdB+"]").attr("selected",true);
	if (showAll)
		NodeBSelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeBSelect.attr("onchange",'testingBasicPingSelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	ssNodeB.append("p");

	var ssNodesPD = ssNodes.append("div").attr("id", "ssNodesP").attr("style", "clear:left; color:red").text("");
	ssNodes.append("p");

	//Test parameters
	var ssParameters = ssSpace.append("div").attr("id", "ssParameters").attr("style", "clear:both");

	var ssParametersCount = ssParameters.append("div").attr("id", "ssParametersCount").attr("class", "dropdown-left");
	ssParametersCount.append("div").attr("id", "ssParametersCountLabel").attr("class", "dropdown-desc").text("Ping count per iteration:");
	ssParametersCount.append("input")
		.attr("id","ssCount")
		.attr("type","number")
		.attr("max", 20)
		.attr("min", 1)
		.attr("value", 5);

	var ssParametersSize = ssParameters.append("div").attr("id", "ssParametersSize").attr("class", "dropdown-right");
	ssParametersSize.append("div").attr("id", "ssParametersIterationsLabel").attr("class", "dropdown-desc").text("Packet size (bytes):");
	ssParametersSize.append("input")
		.attr("id","ssSize")
		.attr("type","number")
		.attr("max", 65507)
		.attr("min", 0)
		.attr("value", 56);

	var ssParametersIterations = ssParameters.append("div").attr("id", "ssParametersIterations").attr("class", "dropdown-left").attr("style", "clear:both");
	ssParametersIterations.append("div").attr("id", "ssParametersIterationsLabel").attr("class", "dropdown-desc").text("Iterations:");
	ssParametersIterations.append("input")
		.attr("id","ssIterations")
		.attr("type","number")
		.attr("max", 100)
		.attr("min", 1)
		.attr("value", 2);

	var ssParametersPause = ssParameters.append("div").attr("id", "ssParametersPause").attr("class", "dropdown-right");
	ssParametersPause.append("div").attr("id", "ssParametersPauseLabel").attr("class", "dropdown-desc").text("Pause between iterations (s):");
	ssParametersPause.append("input")
		.attr("id","ssPause")
		.attr("type","number")
		.attr("max", 3600)
		.attr("min", 0)
		.attr("value", 1);

	var ssParametersClear = ssParameters.append("div").attr("id", "ssParametersClear").attr("style", "clear:both");
	ssParametersClear.append("div").attr("id", "ssParametersClearLabel").attr("class", "dropdown-desc").text("Clear previous tests saved data");
	ssParametersClear.append("input")
		.attr("id","ssClear")
		.attr("type","checkbox");

	//Back button
	ssSpace.append("button")
		.attr("id", "ssBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBasic("'+nodeId+'", "sSpace")' )
           .append("text").text("Back");

	//Run button
	ssSpace.append("button")
		 .attr("id", "sRunPingButton")
		 .attr("class", "btn btn-group")
		 .attr("onclick",'testingBasicPingRun("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, document.getElementById("ssIterations").value, document.getElementById("ssPause").value, document.getElementById("ssClear").checked, " -c " + document.getElementById("ssCount").value + " -s " + document.getElementById("ssSize").value,"sSpace")')
		 	.append("text").text("Perform ping");

	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	else
		d3.select("#ssNodesP").text("");
}


function testingBasicPingRun(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, parameters, d3selection, currenti) {

	iterations = typeof iterations !== 'undefined' ? iterations : 1;
	pause = typeof pause !== 'undefined' ? pause : 0;
	currenti = typeof currenti !== 'undefined' ? currenti : 1;
	clear = typeof clear !== 'undefined' ? clear : false;

	if (clear && currenti == 1)
		tests = {};

	var sSpace = d3.select("#"+d3selection);

	sSpace.html("");

	var ssHeader = sSpace.append("div").attr("id", "ssHeader");

	var ssTitle = ssHeader.append("div").attr("id", "ssTitle");
	//ssTitle.append("h3").text("Ping calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);

	var ssSpace = sSpace.append("div").attr("id","ssSpace");
	var ssTextIteration = ssSpace.append("div").attr("id", "ssTextIteration");
	var ssPingSpace = ssSpace.append("div").attr("id", "ssPingSpace");

	if (currenti <= iterations) {

		ssTextIteration.append("p").text("Performing iteration " + currenti + " of " + iterations);
		ssTextIteration.append("p").text("Calculating ping");
		var pingresult = ping6test(nodeIdA, id2ipv6(nodeIdB), parameters, false);
		ssSpace.append("p").text(pingresult);
		ssTextIteration.append("p").text("Saving ping");

		var pingObject = {};
		pingObject.timestamp = Date.now();
		pingObject.raw = pingresult;
		pingObject.pings = [];
		pingObject.raw.split("time=").forEach(function(d){ pingObject.pings.push(d.split(" ms")[0]);});
		pingObject.pings.shift();
		pingObject.iterations = iterations;
		pingObject.iteration = currenti;
		pingObject.pause = pause;
		pingObject.parameters = parameters;

		savePing(nodeIdA, nodeIdB, pingObject);
		ssTextIteration.append("p").text("Scheduling next iteration in " + pause + " seconds...");
		var nexti = currenti+1;

		if (currenti < iterations ) {
		setTimeout( function (){
			testingBasicPingRun(nodeId, nodeIdA, nodeIdB, iterations, pause, false,
			parameters, d3selection, nexti);
			}, pause*1000);

		} else {
		setTimeout( function (){
			testingBasicPingRun(nodeId, nodeIdA, nodeIdB, iterations, pause, false,
			parameters, d3selection, nexti);
			}, 1);
		}
	}

	else {
		//ssTitle.append("h3").text("Ping calculation from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);
		ssTextIteration.append("p").text(iterations + " out of " + iterations + " iterations performed");

		ssSpace.append("button")
			.attr("id", "ssModify")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicPingSelect("'+nodeId+'", "sSpace")' )
            .append("text").text("Back to test parameters");

		ssSpace.append("button")
			.attr("id", "ssPingRepeat")
			.attr("class", "btn btn-group")
			.attr("onclick",'testingBasicPingRun("'+nodeId+'", "'+nodeIdA+'", "'+nodeIdB+'", "'+iterations+'", "'+pause+'", "'+clear+'", "'+parameters+'", "ssSpace", 0)')
            .append("text").text("Repeat test");
	}

}


function testingBasicBandwidthSelectNode(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
		showAllNodes();
		testingBasicBandwidthSelect(nodeId, d3selection, nodeIdA, nodeId, false);
	}

	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	else
		d3.select("#ssNodesP").text("");
}

function testingBasicPathSelectNodeA(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes") {
		showAllNodes();
		testingBasicPathSelect(nodeId, d3selection, nodeId, nodeIdB, false);
	}
	else if (nodeIdA == nodeIdB) {
		d3.select("#sRunPathButton").attr("disabled", true);
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	}
	else if (nodeIdA != nodeIdB) {
		d3.select("#sRunPathButton").attr("disabled", null);
		d3.select("#ssNodesP").text("");
	}
}

function testingBasicPathSelectNodeB(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
		showAllNodes();
		testingBasicPathSelect(nodeId, d3selection, nodeIdA, nodeId, false);
	}
	else if (nodeIdA == nodeIdB) {
		d3.select("#sRunPathButton").attr("disabled", true);
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	}
	else if (nodeIdA != nodeIdB) {
		d3.select("#sRunPathButton").attr("disabled", null);
		d3.select("#ssNodesP").text("");
	}
}

function testingBasicPingSelectNode(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
		showAllNodes();
		testingBasicPingSelect(nodeId, d3selection, nodeIdA, nodeId, false);
	}
	if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
		d3.select("#ssNodesP").text("⚠ Origin and destination nodes are the same");
	else
		d3.select("#ssNodesP").text("");
}