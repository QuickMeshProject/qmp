function testingBMX6(nodeId, d3selection, nodeIdA, nodeIdB, showAll) {

	nodeIdA = typeof nodeIdA !== 'undefined' ? nodeIdA : nodeId;
	nodeIdB = typeof nodeIdB !== 'undefined' ? nodeIdB : nodeId;
	showAll = typeof showAll !== 'undefined' ? showAll : true;

	var arr_protocols = [{"name":"TCP", "value":""},{"name":"UDP", "value":"-u "}];
	//var arr_protocols = [{"name":"UDP", "value":"-u "},{"name":"TCP", "value":""}];
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
	sTitle.append("h2").text("BMX6 tests");

	var sText1 = sSpace.append("div").attr("id", "sText1").append("p");
	sText1.html("This tool lets you evaluate network performance when different BMX6 routing <br>metrics calculation algorithms. Select the origin and destination nodes, the <br>algorithms and exponents to evaluate, the tests to perform, the number of <br>iterations, and click on \"Perform tests\".");


	//Nodes
	var sNodes = sSpace.append("div").attr("id","sNodes");
	var sNodesTitle = sNodes.append("h3").text("Nodes selection");
	var ssNodes = sNodes.append("div").attr("id", "ssNodes");
	var ssNodesText1 = ssNodes.append("div")
		.attr("id", "ssNodesText1")
		.append("p")
		.text("");

	//Node A
	var ssNodesA = ssNodes.append("div").attr("id", "ssNodesA").attr("class", "dropdown-left");
	ssNodesA.append("div").attr("id", "ssNodeALabel").attr("class", "dropdown-desc").text("Origin node:");

	createSelectNodes(ssNodesA, "nodeA", sortedNodes());
	NodeASelect = d3.select("#nodeA");

	NodeASelect.selectAll("option[value="+nodeIdA+"]").attr("selected",true);
	if (showAll)
		NodeASelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeASelect.attr("onchange",'testingBMX6SelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	//Node B
	var ssNodesB = ssNodes.append("div").attr("id", "ssNodesB").attr("class", "dropdown-right");

	ssNodesB.append("div").attr("id", "ssNodesBLabel").attr("class", "dropdown-desc").text("Destination node:");

	createSelectNodes(ssNodesB, "nodeB", sortedNodes());
	NodeBSelect = d3.select("#nodeB");

	NodeBSelect.selectAll("option[value="+nodeIdB+"]").attr("selected",true);
	if (showAll)
		NodeBSelect.append("option").attr("value", "allnodes").text("Show all nodes...");
	NodeBSelect.attr("onchange",'testingBMX6SelectNode("'+nodeId+'", document.getElementById("nodeA").value, document.getElementById("nodeB").value, "'+d3selection+'")');

	//Nodes warning
	var ssNodesPD = ssNodes.append("div").attr("id", "ssNodesP").attr("style", "clear:left; color:red").text("");
	ssNodes.append("p");




	//Routing algorithm
	var sAlgo = sSpace.append("div").attr("id","sAlgo");
	var sAlgoTitle = sAlgo.append("h3").text("BMX6 routing algorithm");
	var sAlgoText1 = sAlgo.append("div").append("p").text("Use this section to select the different routing algorithms to test.");

	var bmx6Algo = generateBmx6Algo (nodeIdB, true);

	/*algoList = [
			{
				"value" : parseInt(bmx6Algo.value),
				"exponents" : [
					parseInt(bmx6Algo.exponents[0].value),
					parseInt(bmx6Algo.exponents[1].value),
					parseInt(bmx6Algo.exponents[2].value),
					parseInt(bmx6Algo.exponents[3].value)
				]}];*/
	if(typeof algoList === 'undefined')
		algoList = [{"value":"16","exponents":["3","1","3","1"]},{"value":"16","exponents":["2","1","2","1"]},{"value":"16","exponents":["1","1","1","1"]},{"value":"16","exponents":["0","1","0","1"]}];

	//All exponents for VB
	//algoList = [{"value":"16","exponents":["0","1","0","1"]},{"value":"16","exponents":["0","1","0","2"]},{"value":"16","exponents":["0","1","1","1"]},{"value":"16","exponents":["0","1","1","2"]},{"value":"16","exponents":["0","1","2","1"]},{"value":"16","exponents":["0","1","2","2"]},{"value":"16","exponents":["0","1","3","1"]},{"value":"16","exponents":["0","1","3","2"]},{"value":"16","exponents":["0","2","0","1"]},{"value":"16","exponents":["0","2","0","2"]},{"value":"16","exponents":["0","2","1","1"]},{"value":"16","exponents":["0","2","1","2"]},{"value":"16","exponents":["0","2","2","1"]},{"value":"16","exponents":["0","2","2","2"]},{"value":"16","exponents":["0","2","3","1"]},{"value":"16","exponents":["0","2","3","2"]},{"value":"16","exponents":["1","1","0","1"]},{"value":"16","exponents":["1","1","0","2"]},{"value":"16","exponents":["1","1","1","1"]},{"value":"16","exponents":["1","1","1","2"]},{"value":"16","exponents":["1","1","2","1"]},{"value":"16","exponents":["1","1","2","2"]},{"value":"16","exponents":["1","1","3","1"]},{"value":"16","exponents":["1","1","3","2"]},{"value":"16","exponents":["1","2","0","1"]},{"value":"16","exponents":["1","2","0","2"]},{"value":"16","exponents":["1","2","1","1"]},{"value":"16","exponents":["1","2","1","2"]},{"value":"16","exponents":["1","2","2","1"]},{"value":"16","exponents":["1","2","2","2"]},{"value":"16","exponents":["1","2","3","1"]},{"value":"16","exponents":["1","2","3","2"]},{"value":"16","exponents":["2","1","0","1"]},{"value":"16","exponents":["2","1","0","2"]},{"value":"16","exponents":["2","1","1","1"]},{"value":"16","exponents":["2","1","1","2"]},{"value":"16","exponents":["2","1","2","1"]},{"value":"16","exponents":["2","1","2","2"]},{"value":"16","exponents":["2","1","3","1"]},{"value":"16","exponents":["2","1","3","2"]},{"value":"16","exponents":["2","2","0","1"]},{"value":"16","exponents":["2","2","0","2"]},{"value":"16","exponents":["2","2","1","1"]},{"value":"16","exponents":["2","2","1","2"]},{"value":"16","exponents":["2","2","2","1"]},{"value":"16","exponents":["2","2","2","2"]},{"value":"16","exponents":["2","2","3","1"]},{"value":"16","exponents":["2","2","3","2"]},{"value":"16","exponents":["3","1","0","1"]},{"value":"16","exponents":["3","1","0","2"]},{"value":"16","exponents":["3","1","1","1"]},{"value":"16","exponents":["3","1","1","2"]},{"value":"16","exponents":["3","1","2","1"]},{"value":"16","exponents":["3","1","2","2"]},{"value":"16","exponents":["3","1","3","1"]},{"value":"16","exponents":["3","1","3","2"]},{"value":"16","exponents":["3","2","0","1"]},{"value":"16","exponents":["3","2","0","2"]},{"value":"16","exponents":["3","2","1","1"]},{"value":"16","exponents":["3","2","1","2"]},{"value":"16","exponents":["3","2","2","1"]},{"value":"16","exponents":["3","2","2","2"]},{"value":"16","exponents":["3","2","3","1"]},{"value":"16","exponents":["3","2","3","2"]}];


	//Add algorithms
	var sAlgoAdd = sAlgo.append("div").attr("id","sAlgoAdd");
	var sAlgoAddTitle = sAlgoAdd.append("h4").text("Add algorithm");
	var sAlgoAddText1 = sAlgoAdd.append("div").append("p").text("Add a routing algorithm to the test queue.");

	var sAlgoAddValue = sAlgoAdd.append("div").attr("id", "sAlgoAddValue").attr("class", "dropdown-left").attr("style", "clear:both");
	var sAlgoAddValueLabel = sAlgoAddValue.append("div").attr("id", "sAlgoAddValueLabel").attr("class", "dropdown-desc").text("Algorithm:");
	createSelectAlgorithm(sAlgoAddValue, "sAlgoAddValueSelect", bmx6Algo.texts);
	d3.select("#sAlgoAddValueSelect").selectAll('option[value="'+bmx6Algo.value+'"]').attr("selected",true);

	for (var i=0; i < bmx6Algo.exponents.length; i++) {
		if (i%2==0) {
		var ExpLab = sAlgoAdd.append("div").attr("id", "sAlgoAddExponentLabel"+i).attr("class", "dropdown-left").attr("style", "clear:both");
			ExpLab.append("div").attr("class", "dropdown-desc").text(bmx6Algo.exponents[i].name+":");
		} else {
		var ExpLab = sAlgoAdd.append("div").attr("id", "sAlgoAddExponentLabel"+i).attr("class", "dropdown-right");
			ExpLab.append("div").attr("class", "dropdown-desc").text(bmx6Algo.exponents[i].name+":");
		}

		createSelectNumber(ExpLab, bmx6Algo.exponents[i].name, createDropdownVector(bmx6Algo.exponents[i].min, bmx6Algo.exponents[i].max), bmx6Algo.exponents[i].def, "dropdown-small");
		d3.select("#"+bmx6Algo.exponents[i].name).selectAll('option[value="'+bmx6Algo.exponents[i].value+'"]').attr("selected",true);
	}

	var sAlgoAddButtons = sAlgoAdd.append("div").attr("id", "sAlgoAddButtons").attr("style", "clear:both");

	sAlgoAddButtons.append("button")
		.attr("style", "clear:both")
		.attr("id", "sAlgoAddButton")
		.attr("class", "btn")
		.attr("onclick",'testingBMX6AddAlgo ( \
			{value:document.getElementById("sAlgoAddValueSelect").value,\
			 exponents:[document.getElementById("rxExpNumerator").value, document.getElementById("rxExpDivisor").value,\
			  document.getElementById("txExpNumerator").value, document.getElementById("txExpDivisor").value]},\
			"sAlgoShow")')
		.append("text").text("Add algorithm");


	//Test algorithms
	var sAlgoTest = sAlgo.append("div").attr("id","sAlgoTest");
	var sAlgoTestTitle = sAlgoTest.append("h4").text("Algorithms to test");

	var sAlgoShow = sAlgo.append("div").attr("id","sAlgoShow");
	testingBMX6AlgoTable("sAlgoShow");


	sAlgoAdd.append("p").text(" ");

	//Tests blocks
	if(typeof testList === 'undefined')
		testList = [{"type":"path","parameters":""},{"type":"ping","parameters":" -c 3 -s 56"},{"type":"bandwidth","parameters":" -b 0M -t 3"},{"type":"bandwidth","parameters":" -b 0M -t 3"},{"type":"ping","parameters":" -c 3 -s 56"},{"type":"path","parameters":""}]

	//Path discovery tests
	var sPath = sSpace.append("div").attr("id","sPath");
	var sPathTitle = sPath.append("h4").text("Path discovery test");
	var sPathText = sPath.append("div").attr("id", "sPathText").append("p").text("Perform a path discovery test.");

	var sPathButtons = sPath.append("div").attr("id", "sPathButtons").attr("style", "clear:both");
	sPathButtons.append("button")
		.attr("id", "sPathAdd")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBMX6AddTest ( \
			{"type":"path",\
			"parameters":""},\
			"sTestShow")')
		.append("text").text("Add path discovery test");

	//Ping tests
	var sPing = sSpace.append("div").attr("id", "sPing").attr("style", "clear:both");
	var sPingTitle = sPing.append("h4").text("Ping test");
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

	var sPingButtons = sPing.append("div").attr("id", "sPingButtons").attr("style", "clear:both");
	sPing.append("button")
		.attr("id", "sPingAdd")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBMX6AddTest ( \
			{"type":"ping",\
			"parameters":" -c " + document.getElementById("sPingCountValue").value + " -s " + document.getElementById("sPingSizeValue").value},\
			"sTestShow")')
		.append("text").text("Add ping test");

	//Bandwidth test

	var sBandwidth = sSpace.append("div").attr("id", "sBandwidth").attr("style", "clear:both");
	var sBandwidthTitle = sBandwidth.append("h4").text("Bandwidth test");
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
		.attr("value", 2);

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

	//Add bandwidth test button
	var sBandwidthButtons = sBandwidth.append("div").attr("id", "sBandwidthButtons").attr("style", "clear:both");
	sBandwidth.append("button")
		.attr("id", "sBandwidthAdd")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBMX6AddTest ( \
			{"type":"bandwidth",\
			"parameters": document.getElementById("sBandwidthProtocolValue").value + " -b " + document.getElementById("sBandwidthBandwidthValue").value + "M" + " -t " + document.getElementById("sBandwidthDurationValue").value + document.getElementById("sBandwidthMSSValue").value},\
			"sTestShow")')
		.append("text").text("Add bandwidth test");

		sBandwidth.append("p").text(" ");

	//Tests table
	var sTestShow = sSpace.append("div").attr("id","sTestShow");
	var sTestShowTitle = sTestShow.append("h4").text("Tests to perform");
	var sTestShowTable = sTestShow.append("div").attr("id","sTestShowTable");
	testingBMX6TestTable("sTestShowTable");
	sTestShow.append("p").text(" ");


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
		.attr("value", 5);

	var sParametersPause = sParameters.append("div").attr("id", "sParametersPause").attr("class", "dropdown-right");
	sParametersPause.append("div").attr("id", "sParametersPauseLabel").attr("class", "dropdown-desc").text("Pause between iterations (s):");
	sParametersPause.append("input")
		.attr("id","sParametersPauseValue")
		.attr("type","number")
		.attr("max", 3600)
		.attr("min", 0)
		.attr("value", 5);

	sParameters.append("p").text(" ");

	var sParametersClear = sParameters.append("div").attr("id", "sParametersClear").attr("style", "clear:both");
	sParametersClear.append("div").attr("id", "sParametersClearLabel").attr("class", "dropdown-left").attr("style", "clear:both").text("Clear previous tests saved data");
	sParametersClear.append("input")
		.attr("id","sParametersClearValue")
		.attr("type","checkbox");

	sParameters.append("p").text(" ");



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
		.attr("onclick",'testingBMX6RunAll ( \
			"'+nodeId+'",\
			document.getElementById("nodeA").value,\
			document.getElementById("nodeB").value,\
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


function testingBMX6RunAll(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, d3selection, currentAlgo, currentIteration, currentTest) {

	currentAlgo = typeof currentAlgo !== 'undefined' ? currentAlgo : 0;
	currentTest = typeof currentTest !== 'undefined' ? currentTest : 0;
	currentIteration = typeof currentIteration !== 'undefined' ? currentIteration : 0;

	//Clear previous test results if needed
	if (clear && currentAlgo == 0 && currentIteration == 0 && currentTest == 0)
		tests = {"blocks":0};

	testingBMX6Run(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, d3selection, currentAlgo, currentIteration, currentTest);
}

function testingBMX6Run(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, d3selection, currentAlgo, currentIteration, currentTest) {

	var debug = arguments;
    console.log("Function " + debug.callee.name + " called.", nodeId, nodeIdA, nodeIdB, iterations, pause, clear, d3selection, currentAlgo, currentIteration, currentTest);

	//Clear space
	var sSpace = d3.select("#"+d3selection);
	sSpace.html("");

	//Header and subtile
	var sHeader = sSpace.append("div").attr("id", "sHeader");
	var sTitle = sHeader.append("h2").text("BMX6 tests");

	//Test progress
	var sProgress = sSpace.append("div").attr("id", "sProgress");
	sProgress.append("h3").text("Test progress");
	sProgress.append("p").text("Performing test " + (currentTest+1) + " of " + testList.length + " in iteration " + (currentIteration+1) + " of " + iterations + " for algorithm " + (currentAlgo+1) + " of " + algoList.length);

	//Modify algorithm
	if (currentTest == 0 && currentIteration == 0) {
		var sAlgorithm = sSpace.append("div").attr("id", "sAlgorithm");
		sAlgorithm.append("h3").text("Routing algorithm");
		sAlgorithm.append("p").text("Setting routing algorithm metric calculation parameters on destination node...");
		bmx6SetBmx6Algo(nodeIdB, algoList[currentAlgo].value, algoList[currentAlgo].exponents[0], algoList[currentAlgo].exponents[1], algoList[currentAlgo].exponents[2], algoList[currentAlgo].exponents[3], false);
		sAlgorithm.append("p").text("Done.");
	}

	switch(testList[currentTest].type) {
	    case "path":
	        //Path discovery
			var sPath = sSpace.append("div").attr("id", "sPath");
			sPath.append("h3").text("Path discovery");

			var sPathResult = sSpace.append("div").attr("id", "sPathResult");
			testingPathCalc(nodeId, nodeIdA, nodeIdB, "sPathResult", false);

			//Save data
			var sSave = sSpace.append("div").attr("id", "sSave");
			sSave.append("h3").text("Save data");
			savePath(nodeIdA, nodeIdB, Date.now());
			savePath(nodeIdB, nodeIdA, Date.now());
			sSave.append("p").text("Done.");


			break;

	    case "ping":
	        //Ping test
			var sPing = sSpace.append("div").attr("id", "sPing");
			sPing.append("h3").text("Ping test");

			sPing.append("p").text("Performing ping test between " + nodes[indexNode(nodeIdA)].name + " and " + nodes[indexNode(nodeIdB)].name + "...");

			var pingresult = ping6test(nodeIdA, id2ipv6(nodeIdB), testList[currentTest].parameters, false);
			var pingObject = {};
				pingObject.id = {};
				pingObject.id.timestamp = Date.now();
				pingObject.id.blockId = tests.blocks;
				pingObject.id.algoId = currentAlgo;
				pingObject.id.iterId = currentIteration;
				pingObject.id.testId = currentTest;
				pingObject.id.iterations = iterations;
				pingObject.id.pause = pause;
				pingObject.id.parameters = testList[currentTest].parameters;
				pingObject.raw = pingresult;
				pingObject.pings = [];
				if (typeof pingObject !== "undefined") {
					pingObject.raw.split("time=").forEach(function(d){ pingObject.pings.push(d.split(" ms")[0]);});
					pingObject.pings.shift();
				}

			sPing.append("pre").text(pingresult);
			sPing.append("p").text("Done.");

			//Save data
			var sSave = sSpace.append("div").attr("id", "sSave");
			sSave.append("h3").text("Save data");
			sSave.append("p").text("Saving data...");
			savePing(nodeIdA, nodeIdB, pingObject);
			sSave.append("p").text("Done.");


	        break;

		case "bandwidth":
			//Bandwidth test
			var sBandwidth = sSpace.append("div").attr("id", "sBandwidth");
			sBandwidth.append("h3").text("Bandwidth test");

			sBandwidth.append("p").text("Performing bandwidth test from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name + "...");

			var bandwidthresult = iperf3test(nodeIdA, tun4Address2ipAddress(nodes[indexNode(nodeIdB)].bmx6.status.tun4Address), false, testList[currentTest].parameters);

			if (bandwidthresult.end != undefined &&
				bandwidthresult.end.sum_received != undefined &&
				bandwidthresult.end.sum_received.bits_per_second != undefined ) {

				var bandwidthValue = (bandwidthresult.end.sum_received.bits_per_second/1000000).toString().split(".");
				if (bandwidthValue.length == 1)
					bandwidthValue.push(0);
				sBandwidth.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
			}
			else if (bandwidthresult.end != undefined &&
				bandwidthresult.end.sum != undefined &&
				bandwidthresult.end.sum.bits_per_second != undefined ) {

				var bandwidthValue = (bandwidthresult.end.sum.bits_per_second/1000000).toString().split(".");
				if (bandwidthValue.length == 1)
					bandwidthValue.push(0);
				sBandwidth.append("pre").text("Bandwidth: " + bandwidthValue[0] + "." + bandwidthValue[1].substring(0,Math.max(2,Math.min(0, bandwidthValue[0].split("").length-2))) + " Mbit/s");
			}
			else
				sBandwidth.append("pre").text(bandwidthresult.error);

			var bandwidthObject = {};
				bandwidthObject.id = {};
				bandwidthObject.id.timestamp = Date.now();
				bandwidthObject.id.blockId = tests.blocks;
				bandwidthObject.id.algoId = currentAlgo;
				bandwidthObject.id.iterId = currentIteration;
				bandwidthObject.id.testId = currentTest;
				bandwidthObject.id.iterations = iterations;
				bandwidthObject.id.pause = pause;
				bandwidthObject.id.parameters = testList[currentTest].parameters;

				bandwidthObject.raw = bandwidthresult;

			sBandwidth.append("p").text("Done.");

			//Save data
			var sSave = sSpace.append("div").attr("id", "sSave");
			sSave.append("h3").text("Save data");
			sSave.append("p").text("Saving data...");
			saveBandwidth(nodeIdA, nodeIdB, bandwidthObject);
			sSave.append("p").text("Done.");

			break;

	    default:
	        break;
	}


	//Buttons div
	var sButtons = sSpace.append("div").attr("id", "sButtons").attr("style", "clear:both");
	//TODO: add stop button

	//Prepare next call
	var nextAlgorithm = currentAlgo;
	var nextIteration = currentIteration;
	var nextTest = currentTest+1;
	var nextPause = 1000;

	if (nextTest == testList.length) {
		nextTest = 0;
		nextIteration = currentIteration+1;

		if (nextIteration == iterations) {
			nextIteration = 0;
			nextAlgorithm = currentAlgo+1;
			tests.blocks = tests.blocks+1;
			nextPause = pause*1000;
		}
	}


	if ( nextAlgorithm < algoList.length ) {
		setTimeout( function (){
			testingBMX6Run(nodeId, nodeIdA, nodeIdB, iterations, pause, clear, d3selection, nextAlgorithm, nextIteration, nextTest)
		}, nextPause);
	}
	else {

		//Back button
		sButtons.append("button")
		.attr("id", "sButtonsBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingBMX6("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Back");

		//View results
		sButtons.append("button")
		.attr("id", "sButtonsView")
		.attr("class", "btn btn-group")
		.attr("onclick",'visualizeResults("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("View results");
	}
}

function testingBMX6SelectNode(nodeId, nodeIdA, nodeIdB, d3selection) {
	if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
		showAllNodes();
		testingBMX6(nodeId, d3selection, nodeIdA, nodeId, false);
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


function testingBMX6AlgoTable(d3selectionName) {

	var d3selection = d3.select("#"+d3selectionName);
	d3selection.html("");

	if (algoList.length > 0) {

		var sAlgoTable = d3selection.append("table").attr("id", "sAlgoTable");
		var sAlgoTableRowTitle = sAlgoTable.append("tr").attr("id","sAlgoTableRowTitle");
		sAlgoTableRowTitle.append("td").append("b").text("Algorithm");
		sAlgoTableRowTitle.append("td").append("b").text("rxExpNum");
		sAlgoTableRowTitle.append("td").append("b").text("rxExpDiv");
		sAlgoTableRowTitle.append("td").append("b").text("txExpNum");
		sAlgoTableRowTitle.append("td").append("b").text("txExpDiv");
		sAlgoTableRowTitle.append("td").append("b").text(" ");

		for (var i=0; i<algoList.length; i++) {
			sAlgoTable.append("tr").attr("id","sAlgoTableRow"+i);

			d3.select("#sAlgoTableRow"+i).append("td").text(algoList[i].value);

			for (var j=0; j<algoList[i].exponents.length; j++) {

				d3.select("#sAlgoTableRow"+i).append("td").text(algoList[i].exponents[j]);
			}

			d3.select("#sAlgoTableRow"+i).append("td").append("button")
				.attr("id", "sAlgoTableRow"+i+"Delete")
				.attr("class", "btn")
				.attr("onclick",'testingBMX6RemoveAlgo("'+i+'","'+d3selectionName+'")' )
				.append("text").text("Remove");
		}

	}

	else {
		d3selection.append("p").attr("style", "clear:left; color:red").text("⚠ There are no algorithms to test");
	}

}

function testingBMX6TestTable(d3selectionName) {

	var d3selection = d3.select("#"+d3selectionName);
	d3selection.html("");

	if (testList.length > 0) {

		var sTestTable = d3selection.append("table").attr("id", "sTestTable");
		var sTestTableRowTitle = sTestTable.append("tr").attr("id","sTestTableRowTitle");
		sTestTableRowTitle.append("td").append("b").text("Type");
		sTestTableRowTitle.append("td").append("b").text("Parameters");
		sTestTableRowTitle.append("td").append("b").text(" ");

		for (var i=0; i<testList.length; i++) {
			sTestTable.append("tr").attr("id","sTestTableRow"+i);

			d3.select("#sTestTableRow"+i).append("td").text(testList[i].type);
			d3.select("#sTestTableRow"+i).append("td").text(testList[i].parameters);

			d3.select("#sTestTableRow"+i).append("td").append("button")
				.attr("id", "sTestTableRow"+i+"Delete")
				.attr("class", "btn")
				.attr("onclick",'testingBMX6RemoveTest("'+i+'","'+d3selectionName+'")' )
				.append("text").text("Remove");
		}

	}

	else {
		d3selection.append("p").attr("style", "clear:left; color:red").text("⚠ There are no tests to perform");
	}

}

function testingBMX6AddAlgo(addAlgorithm, d3selectionName) {
	algoList.push(addAlgorithm);
	testingBMX6AlgoTable(d3selectionName);
}

function testingBMX6RemoveAlgo(n, d3selectionName) {
	algoList.splice(n,1);
	testingBMX6AlgoTable(d3selectionName);
}

function testingBMX6AddTest(addTest, d3selectionName) {
	testList.push(addTest);
	testingBMX6TestTable(d3selectionName);
}

function testingBMX6RemoveTest(n, d3selectionName) {
	testList.splice(n,1);
	testingBMX6TestTable(d3selectionName);
}
