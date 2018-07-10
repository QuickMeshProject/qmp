function sidebarSystemBoard(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    var n = indexNode(nodeId);

    if ( nodes[n].system == undefined || nodes[n].system.board == undefined) {

		if (!nodes[n].ncd.active && nodes[n].bmx6.active && nodes[n].bmx6.status != undefined) {
			Sidebar = d3.select('#sidebarContent');

			Sidebar.append("p").append("b").text("Data not available");

			Sidebar.append("p").append("b").text("Node name")
               .append("p").text(nodes[n].name);

            Sidebar.append("p").append("b").text("NCD status")
               .append("p").text("inactive");

            Sidebar.append("p").append("b").text("BMX6 status")
               .append("p").text("active");

			Sidebar.append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to retry");
	        $('a#refreshlink').click(function() {refreshContentSystemBoard(nodeId)});

		}

		else {

	        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
	        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
	        $('a#refreshlink').click(function() {refreshContentSystemBoard(nodeId)});

	        if (autorefresh)
	            refreshContentSystemBoard(nodeId);
		}
    }

    else {
        Sidebar = d3.select('#sidebarContent');

        Sidebar.append("p").append("b").text("Node name")
               .append("p").text(nodes[indexNode(nodeId)].system.board.hostname);
        Sidebar.append("p").append("b").text("Device model")
               .append("p").text(nodes[indexNode(nodeId)].system.board.model);
        Sidebar.append("p").append("b").text("CPU model")
               .append("p").text(nodes[indexNode(nodeId)].system.board.system);

        Sidebar.append("p").append("b").text("Operating system")
               .append("p").text(nodes[indexNode(nodeId)].system.board.release.distribution + ' ' +
                            nodes[indexNode(nodeId)].system.board.release.version.toLowerCase()  + ' "' +
                            titleCase(nodes[indexNode(nodeId)].system.board.release.description.replace("_", " ")) + '" (' +
                            nodes[indexNode(nodeId)].system.board.release.revision + ')')
               .append("p").text("Kernel " + nodes[indexNode(nodeId)].system.board.kernel + ' (' +
                            nodes[indexNode(nodeId)].system.board.release.target.replace("\\", "") + ')');

        Sidebar.append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentSystemBoard(nodeId)});

        onWindowResize();
    }
}

function refreshContentSystemBoard(nodeId) {
    updateSystemBoard(nodeId, false);
    updateSidebarContent("system","board",nodeId,false);
}

function sidebarSystemInfo(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].system == null || nodes[indexNode(nodeId)].system.info == null) {
        d3.select('#sidebarContent').append("p").append("b").text("Loading data...");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentSystemInfo(nodeId)});

        if (autorefresh)
            refreshContentSystemInfo(nodeId);
    }

    else {

        d3.select('#sidebarContent').append("p").append("b").text("System uptime")
            .append("p").text(nodes[indexNode(nodeId)].system.info.uptime);
        d3.select('#sidebarContent').append("p").append("b").text("System local time")
            .append("p").text(nodes[indexNode(nodeId)].system.info.localtime);
        d3.select('#sidebarContent').append("p").append("b").text("CPU load")
            .append("p").text(nodes[indexNode(nodeId)].system.info.load[0]  + ' / ' +
                              nodes[indexNode(nodeId)].system.info.load[1]  + ' / ' +
                              nodes[indexNode(nodeId)].system.info.load[2]  + ' ' ) ;
        d3.select('#sidebarContent').append("p").append("b").text("Memory")
            .append("p").text("Total: " + nodes[indexNode(nodeId)].system.info.memory.total / 1024 + ' kB')
            .append("p").text("Free: " + nodes[indexNode(nodeId)].system.info.memory.free / 1024 + ' kB')
            .append("p").text("Shared: " + nodes[indexNode(nodeId)].system.info.memory.shared / 1024 + ' kB')
            .append("p").text("Buffered: " + nodes[indexNode(nodeId)].system.info.memory.buffered / 1024 + ' kB');

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentSystemInfo(nodeId)});

        onWindowResize();
    }
}

function refreshContentSystemInfo(nodeId) {
    updateSystemInfo(nodeId, false);
    updateSidebarContent("system","info",nodeId,false);
}

function sidebarSystemNetwork(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("WiP");
}


function sidebarMeshNeighbours(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("WiP");
}


function sidebarMeshGateways(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("WiP");
}

function sidebarMeshAllNodes(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("Loading all nodes...");
    showAllNodes();
}

function sidebarMeshAllBmx6(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("Loading BMX6 info from all nodes...");
    allBmx6All();
    onWindowResize();
}

function sidebarMeshPaintLinks(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("Painting links...");
    nodes.forEach(function(d){bmx6Links2Graph(d.id);});
    nodes.forEach(function(d){bmx6Originators2Graph(d.id);});
	onWindowResize();
}

function sidebarMeshPaintAllLinks(nodeId, autorefresh) {
    d3.select('#sidebarContent').append("p").append("b").text("Painting links...");
    allBmx6All();
    nodes.forEach(function(d){bmx6Links2Graph(d.id);});
    nodes.forEach(function(d){bmx6Originators2Graph(d.id);});
	onWindowResize();
}

function sidebarBmx6Algorithm(nodeId, autorefresh) {
    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.options == null || nodes[indexNode(nodeId)].bmx6.parameters == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Algorithm(nodeId)});

        if (autorefresh)
            refreshContentBmx6Algorithm(nodeId);
    }

    else {

		var bmx6Algo = generateBmx6Algo (nodeId);

		d3.select('#sidebarContent').append("p").append("b").text("Current BMX6 metrics algorithm");

		d3.select('#sidebarContent').append("p").text("Algorithm: " + bmx6Algo.value);

		for (var i=0; i < bmx6Algo.exponents.length; i++) {
			d3.select('#sidebarContent').append("p").text(bmx6Algo.exponents[i].name + ": " + bmx6Algo.exponents[i].value);
		}

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Algorithm(nodeId)});

		d3.select('#sidebarContent').append("br");
		d3.select('#sidebarContent').append("p").append("b").text("");
		d3.select('#sidebarContent').append("br");
		d3.select('#sidebarContent').append("p").append("b").text("Change BMX6 metrics algorithm");

		//Build the dropdown menu for algorithm value
		d3.select('#sidebarContent').append("p").text("Algorithm:");
    	createSelectAlgorithm(Sidebar, "Algorithm", bmx6Algo.texts);
    	d3.select("#Algorithm").selectAll('option[value="'+bmx6Algo.value+'"]').attr("selected",true);

		for (var i=0; i < bmx6Algo.exponents.length; i++) {
			d3.select('#sidebarContent').append("p").text(bmx6Algo.exponents[i].name + ":");
			//Build the dropdown menu for exponent value
    		createSelectNumber(Sidebar, bmx6Algo.exponents[i].name, createDropdownVector(bmx6Algo.exponents[i].min, bmx6Algo.exponents[i].max), bmx6Algo.exponents[i].def);
    		d3.select("#"+bmx6Algo.exponents[i].name).selectAll('option[value="'+bmx6Algo.exponents[i].value+'"]').attr("selected",true);

		}
		Sidebar.append("p")
		Sidebar.append("button").attr("id", "algoButton").attr("class", "btn")
                            .attr("onclick", 'bmx6SetBmx6Algo("'+nodeId+'", document.getElementById("Algorithm").value, document.getElementById("'+bmx6Algo.exponents[0].name+'").value, document.getElementById("'+bmx6Algo.exponents[1].name+'").value, document.getElementById("'+bmx6Algo.exponents[2].name+'").value, document.getElementById("'+bmx6Algo.exponents[3].name+'").value, true)' )
                            .append("text").text("Modify algorithm");

        onWindowResize();
    }
}

function hidecontentBmx6Algorithm(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Algorithm(nodeId);
}


function refreshContentBmx6Algorithm(nodeId) {
    bmx6Options(nodeId, false);
    bmx6Parameters(nodeId, false);
    updateSidebarContent("bmx6","algorithm",nodeId,false);
}


function sidebarBmx6Evaluation(nodeId, showReload) {

    showReload = typeof showReload !== 'undefined' ? showReload : false;

    var Sidebar = d3.select('#sidebarContent').html("");

	var Title = Sidebar.append("div").attr("id", "sbTitle");
	Title.append("p").append("b").text(" ");
	Title.append("p").append("b").text("BMX6 algorithms evaluation");

	var Text1 = Sidebar.append("div").attr("id", "sbText1").attr("class", "sidebarText");
	Text1.append("p").text("This tool evaluates network performance between two nodes for the different algorithms BMX6 uses to calculate routing metrics.");

	var Text2 = Sidebar.append("div").attr("id", "sbText2").attr("class", "dropdown-desc");
	Text2.text("Select the origin node:");

	//Build the dropdown menu for node A
	var Button1 = Sidebar.append("div").attr("id", "sbButton1");
    createSelectNodes(Button1, "nodeA", sortedNodes());
    d3.select("#nodeA").selectAll("option[value="+nodeId+"]").attr("selected",true);
    d3.select("#nodeA").attr("onchange",'sidebarBmx6EvaluationSelectNodeA(d3.select("#nodeA").selectAll("option[selected=true]").attr("value"), document.getElementById("nodeA").value)');

    //Add the option to populate the list of nodes
    if (showReload) {
        NodeASelect = d3.select("#nodeA");
        NodeASelect.append("option").attr("value", "allnodes").text("Load all the nodes in the mesh...");
    }

	Sidebar.append("p").text("");

	var Text3 = Sidebar.append("div").attr("id", "sbText3").attr("class", "dropdown-desc");
    Text3.text("Select the destination node:");

	//Build the dropdown menu for node B
	var Button2 = Sidebar.append("div").attr("id", "sbButton2");
    createSelectNodes(Button2, "nodeB", sortedNodes());
    d3.select("#nodeB").attr("onchange",'sidebarBmx6EvaluationSelectNodeB(document.getElementById("nodeA").value, document.getElementById("nodeB").value)');

    //Add the option to populate the list of nodes
    if (true) {
        NodeASelect = d3.select("#nodeB");
        NodeASelect.append("option").attr("value", "allnodes").text("Load all the nodes in the mesh...");
    }

    //Add the button to calculate the paths, inactive
    Sidebar.append("p");

    Sidebar.append("button").attr("id", "calcButton").attr("class", "btn")
                            .attr("onclick", 'fullcontentBmx6Evaluation(document.getElementById("nodeA").value, document.getElementById("nodeB").value)' )
                            .append("text").text("Evaluate algorithms");

    if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
        d3.select("#calcButton").attr("disabled", true);

    onWindowResize();
}


function sidebarBmx6EvaluationSelectNodeA(nodeId, nodeIdA) {
    if (nodeIdA == "allnodes") {
        showAllNodes();
        sidebarBmx6Evaluation(nodeId, false)
    }
}


function sidebarBmx6EvaluationSelectNodeB(nodeIdA, nodeIdB) {

    if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
        showAllNodes();
        sidebarBmx6Evaluation(nodeIdA, false);
    }
    else if (nodeIdA == nodeIdB)
        d3.select("#calcButton").attr("disabled", true);
    else if (nodeIdA != nodeIdB)
        d3.select("#calcButton").attr("disabled", null);
}


function fullcontentBmx6Evaluation(nodeA, nodeB) {

	//Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

	var Title = floatContent.append("div").attr("id", "fcTitle");
	Title.append("h2").text("BMX6 algorithms evaluation");

	var Subtitle = floatContent.append("div").attr("id", "fcSubtitle");
	Subtitle.append("h3").text("Network performance from " + nodes[indexNode(nodeA)].name + " to node " + nodes[indexNode(nodeB)].name);

	var Progress = floatContent.append("div").attr("id", "fcProgress");
	var progress = Progress.append("p");

	var currentBmx6Algo = generateBmx6Algo (nodeB);
	var testLength = currentBmx6Algo.texts.length;

	for (var i=0; i < currentBmx6Algo.exponents.length; i++) {
		testLength = testLength * createDropdownVector(currentBmx6Algo.exponents[i].min, currentBmx6Algo.exponents[i].max).length;
	}

	var currentTest = 0;
	var testAlgo = currentBmx6Algo.texts[0].value;
	var tests = [];

	console.log(currentBmx6Algo);


	floatContent.attr("style", "z-Index: 1");
    $("#floatContent").draggable().resizable();

	algo:
	for (var i=5; i < currentBmx6Algo.texts.length; i++) {

		//rxExpNumerator loop
		for (var j=currentBmx6Algo.exponents[0].min; j < currentBmx6Algo.exponents[0].max; j++) {

			//rxExpDivisor loop
			for (var k=currentBmx6Algo.exponents[1].min; k < currentBmx6Algo.exponents[1].max; k++) {

				//txExpNumerator loop
				for (var l=currentBmx6Algo.exponents[2].min; l < currentBmx6Algo.exponents[2].max; l++) {

					//txExpDivisor loop
					for (var m=currentBmx6Algo.exponents[3].min; m < currentBmx6Algo.exponents[3].max; m++) {
						//Start of this algo/R/r/T/t combination
						currentTest++;

						currentBmx6Algo.value = currentBmx6Algo.texts[i].value.toString();
						currentBmx6Algo.exponents[0].value = j.toString();
						currentBmx6Algo.exponents[1].value = k.toString();
						currentBmx6Algo.exponents[2].value = l.toString();
						currentBmx6Algo.exponents[3].value = m.toString();

						//progress.html("");
						progress.append("p").append("b").text("Performing test " + currentTest + " of " + testLength);
						progress.append("p").text("Algorithm: " + currentBmx6Algo.texts[i].value + ", rxExpNumerator: " + j + ", rxExpDivisor: " + k + ", txExpNumerator: " + l + ", txExpDivisor: " + m);

						var algoCheck = false;

						//Do, for up to MAX_SET_ALGO_RETRIES times
						for (var n=0; n < MAX_SET_ALGO_RETRIES; n++) {

							progress.append("p").text("Checking if metrics algorithm on node " + nodes[indexNode(nodeB)].name + " were saved... (try " + eval(n+1) + " of " + MAX_SET_ALGO_RETRIES + ")");
							var saved = true;

							//Change NodeB's BMX6 algorithm
							progress.append("p").text("Modifying metrics algorithm on node " + nodes[indexNode(nodeB)].name + "...");
							bmx6SetBmx6Algo(nodeB, currentBmx6Algo.texts[i].value, j, k, l, m, false);

							progress.append("p").text("Reading metrics algorithm on node " + nodes[indexNode(nodeB)].name + "...");
							//Get NodeB's BMX6 algorithm and check if the changes have been applied
							var newBmx6Algo = generateBmx6Algo (nodeB);

							//Compare BMX6 algorithm value (if #1)
							if (currentBmx6Algo.value.toString() == newBmx6Algo.value.toString()) {
								//Check all algorithm exponents
								for (var o=0; o < currentBmx6Algo.exponents.length; o++) {
									//Check oth exponent
									if ( currentBmx6Algo.exponents[o].value.toString() != newBmx6Algo.exponents[o].value.toString() )
										saved = false;
								}
							}
							//(if #1)
							else
								saved = false;

							//Break the for loop if both algorithms match
							if (saved) {
								algoCheck = true;
								break;
							}
						}

						//Algorithm changes were saved to nodeB (#if 2)
						if ( algoCheck ) {

							progress.append("p").text("Algorithm changes on node " + nodes[indexNode(nodeB)].name + " were saved.");

							var descCheck = false;

							//Do, for up to MAX_GET_DESC_RETRIES times
							for (var p=0; p < MAX_GET_DESC_RETRIES; p++) {

								progress.append("p").text("Checking if metrics algorithm on node " + nodes[indexNode(nodeB)].name + " were propagated to " + nodes[indexNode(nodeA)].name + "... (try " + eval(n+1) + " of " + MAX_SET_ALGO_RETRIES + ")");

								var propagated = true;

								//Get NodeA's descriptors synchronously
								progress.append("p").text("Reading metrics algorithm on node " + nodes[indexNode(nodeB)].name + "...");

								console.debug("STEP 1: Calling bmx6Descriptors for " +nodes[indexNode(nodeB)].name);
								console.debug("STEP 1: Current BMX6:", nodes[indexNode(nodeB)].bmx6);

								bmx6Descriptors(nodeA, false);

								console.debug("STEP 2: Received bmx6Descriptors for " +nodes[indexNode(nodeB)].name);
								console.debug("STEP 2: Current BMX6:", nodes[indexNode(nodeB)].bmx6);


								//Check if NodeB's algorithm change has propagated to NodeA

								//Get NodeB's index in NodeA's descriptors array
								console.log("STEP 3.0:", nodes[indexNode(nodeA)].bmx6.descriptors);
								var indexNodeBDesc = indexBmx6NodeIdDescriptors(nodeB, nodes[indexNode(nodeA)].bmx6.descriptors);

								//Get metrics' index in NodeB's descriptor in NodeA's descriptors array
								console.log("STEP 4.0:", nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV.extensions);
								var indexMetricDesc = indexBmx6MetricExtensions(nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV.extensions);
								console.log("STEP 4.1:",indexMetricDesc);

								console.log("STEP 5.0:", nodes[indexNode(nodeA)]);
								console.log("STEP 5.1:", nodes[indexNode(nodeA)].bmx6);
								console.log("STEP 5.2:", nodes[indexNode(nodeA)].bmx6.descriptors);
								console.log("STEP 5.3:", nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc]);
								console.log("STEP 5.4:", nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV);
								console.log("STEP 5.5:", nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV.extensions);
								console.log("STEP 5.6:", nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV.extensions[indexMetricDesc]);

								var newbmx6Algo = fillBmx6AlgoMetricExtension(generateBmx6Algo (nodeB, false), nodes[indexNode(nodeA)].bmx6.descriptors[indexNodeBDesc].DESC_ADV.extensions[indexMetricDesc].METRIC_EXTENSION[0]);

								//Compare BMX6 algorithm value (if #3)
								if (currentBmx6Algo.value == newBmx6Algo.value) {
									//Check all algorithm exponents
									for (var q=0; q < currentBmx6Algo.exponents.length; q++) {
									//Check oth exponent
									if ( currentBmx6Algo.exponents[q].value != newBmx6Algo.exponents[q].value )
										propagated = false;
									}
								}
								//(if #3)
								else
									propagated = false;

								//Break the for loop if both algorithms match
								if (propagated) {
									descCheck = true;
									break;
								}
							}

							//Algorithm changes were propagated to NodeA (if #4)
							if (descCheck) {
								//Evaluate network performance
								progress.append("p").text("Evaluating network performance...");
								progress.append("p").text(ping6test(nodeB, id2ipv6(nodeA), false));
								progress.append("p").text("Done!");
							}

							//Algorithm changes were not propagated to NodeB (if #4)
							else {
								//Do something
							}
						}


						//Algorithm changes were not saved to nodeB (#if 2)
						else {
							//Do something
							progress.append("p").text("Algorithm changes on node " + nodes[indexNode(nodeB)].name + " were not saved...");
						}

					//End of this algo/R/r/T/t combination
					if (!algoCheck)
						break algo;
					}
				}
			}
		}
	}


    //if ( nodes[indexNode1].bmx6 != null && nodes[indexNode1].bmx6.originators != null ) {
	/*
    links.forEach (function (d) { d.strokeWidth = defaultStrokeWidth;});
    tick();

    nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)].path.forEach (function(d) {
        links[indexLink(d.in, d.out)].strokeWidth = 5;
        });

    tick();

    var PathTable = createPathTable (nodeIdA, nodeIdB, floatContent, "contentTable");
    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Path(nodeIdA, nodeIdB, false); fullcontentBmx6Paths(nodeIdA, nodeIdB);});

*/

d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Evaluation(nodeA);});

}


function hidecontentBmx6Evaluation(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Evaluation(nodeId);
}

function refreshContentBmx6Evaluation(nodeIdA, nodeIdB) {
    bmx6Originators(nodeId, false);
    updateSidebarContent("bmx6","originators",nodeId,false);
}


function sidebarBmx6Status(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.status == null || nodes[indexNode(nodeId)].bmx6.status == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Status(nodeId)});

        if (autorefresh)
            refreshContentBmx6Status(nodeId);
    }

    else {
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Status(nodeId)});

        var columns = ["version", "nodes", "primaryIp"];
        createTable(columns, [nodes[indexNode(nodeId)].bmx6.status], d3.select('#sidebarContent'), "sidebarTable");

        onWindowResize();
    }
}

function refreshContentBmx6Status(nodeId) {
    bmx6Status(nodeId, false);
    updateSidebarContent("bmx6","status",nodeId,false);
}


function sidebarBmx6Interfaces(nodeId, autorefresh) {
    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.interfaces == null || nodes[indexNode(nodeId)].bmx6.interfaces == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Interfaces(nodeId)});

        if (autorefresh)
            refreshContentBmx6Interfaces(nodeId);
    }

    else {

        //var columns = ["devName", "type", "state", "llocalIp", "globalIp", "rateMin", "rateMax", "primary"];
        //contentCreateTable(columns,nodes[indexNode(nodeId)].bmx6.interfaces)
        var columns = ["devName", "type", "state"];
        createTable(columns, nodes[indexNode(nodeId)].bmx6.interfaces, d3.select('#sidebarContent'), "sidebarTable");

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Interfaces(nodeId)});

        d3.select('#sidebarContent').append("p").append("a").attr("id","showmorelink").attr("href", "javascript:void(0);").html("Show more details");
            $('a#showmorelink').click(function() {fullcontentBmx6Interfaces(nodeId)});

        onWindowResize();
    }
}

function fullcontentBmx6Interfaces(nodeId) {

    //Toggle sidebar links
    d3.select('#sidebarContent').select("#refreshlink").remove();
    d3.select('#sidebarContent').select("#showmorelink").html("Hide details");
        $('a#showmorelink').click(function() {hidecontentBmx6Interfaces(nodeId)});

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 interfaces");
    floatContent.append("h3").text(nodes[indexNode(nodeId)].name);

    var columns = ["devName", "type", "state", "llocalIp", "globalIp", "rateMin", "rateMax", "primary"];
    createTable(columns, nodes[indexNode(nodeId)].bmx6.interfaces, floatContent, "floatTable")

    d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Interfaces(nodeId);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Interfaces(nodeId, false); hidecontentBmx6Interfaces(nodeId); fullcontentBmx6Interfaces(nodeId);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Interfaces(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Interfaces(nodeId);
}


function refreshContentBmx6Interfaces(nodeId) {
    bmx6Interfaces(nodeId, false);
    updateSidebarContent("bmx6","interfaces",nodeId,false);
}


function sidebarBmx6Links(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.links == null || nodes[indexNode(nodeId)].bmx6.links == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Links(nodeId)});

        if (autorefresh)
            refreshContentBmx6Links(nodeId);
    }

    else {
        var columns = ["name", "txRate", "rxRate", "routes"];
        createTable(columns, nodes[indexNode(nodeId)].bmx6.links, d3.select('#sidebarContent'), "sidebarTable");

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Links(nodeId)});

        d3.select('#sidebarContent').append("p").append("a").attr("id","showmorelink").attr("href", "javascript:void(0);").html("Show more details");
            $('a#showmorelink').click(function() {fullcontentBmx6Links(nodeId)});

        onWindowResize();
    }
}

function fullcontentBmx6Links(nodeId) {

    //Toggle sidebar links
    d3.select('#sidebarContent').select("#refreshlink").remove();
    d3.select('#sidebarContent').select("#showmorelink").html("Hide details");
        $('a#showmorelink').click(function() {hidecontentBmx6Links(nodeId)});

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 links");
    floatContent.append("h3").text(nodes[indexNode(nodeId)].name);

    var columns = ["name", "llocalIp", "txRate", "rxRate", "routes", "bestTxLink", "wantsOgms"];
    createTable(columns, nodes[indexNode(nodeId)].bmx6.links, floatContent, "floatTable")

    d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Links(nodeId);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Links(nodeId, false); fullcontentBmx6Links(nodeId);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Links(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Links(nodeId);
}


function refreshContentBmx6Links(nodeId) {
    bmx6Links(nodeId, false);
    updateSidebarContent("bmx6","links",nodeId,false);
}


function sidebarBmx6Originators(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.originators == null || nodes[indexNode(nodeId)].bmx6.originators == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Originators(nodeId)});

        if (autorefresh)
            refreshContentBmx6Originators(nodeId);
    }

    else {
        var columns = ["name", "viaDev", "metric", "lastDesc"];
        createTable(columns, nodes[indexNode(nodeId)].bmx6.originators, d3.select('#sidebarContent'), "sidebarTable");

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Originators(nodeId)});
        d3.select('#sidebarContent').append("p").append("a").attr("id","showmorelink").attr("href", "javascript:void(0);").html("Show more details");
            $('a#showmorelink').click(function() {fullcontentBmx6Originators(nodeId)});

        onWindowResize();
    }
}

function fullcontentBmx6Originators(nodeId) {

    //Toggle sidebar links
    d3.select('#sidebarContent').select("#refreshlink").remove();
    d3.select('#sidebarContent').select("#showmorelink").html("Hide details");
        $('a#showmorelink').click(function() {hidecontentBmx6Originators(nodeId)});

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 originators");
    floatContent.append("h3").text(nodes[indexNode(nodeId)].name);

    var columns = ["name", "primaryIp", "viaDev", "viaIp", "routes", "metric", "lastDesc", "lastRef", "blocked"];
    createTable(columns, nodes[indexNode(nodeId)].bmx6.originators, floatContent, "floatTable");

    d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Originators(nodeId);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Originators(nodeId, false); fullcontentBmx6Originators(nodeId);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Originators(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Originators(nodeId);
}

function refreshContentBmx6Originators(nodeId) {
    bmx6Originators(nodeId, false);
    updateSidebarContent("bmx6","originators",nodeId,false);
}


function sidebarBmx6Paths(nodeId, showReload) {

    showReload = typeof showReload !== 'undefined' ? showReload : false;

    var Sidebar = d3.select('#sidebarContent').html("");

    Sidebar.append("p").append("b").text("Calculate BMX6 paths");
    Sidebar.append("p").text("Select one node from each list:");

    //Build the dropdown menu for node A and leave the current node selected
    createSelectNodes(Sidebar, "nodeA", sortedNodes());
    d3.select("#nodeA").selectAll("option[value="+nodeId+"]").attr("selected",true);
    d3.select("#nodeA").attr("onchange",'sidebarBmx6PathsSelectNodeA(d3.select("#nodeA").selectAll("option[selected=true]").attr("value"), document.getElementById("nodeA").value)');

    //Add the option to populate the list of nodes
    if (showReload) {
        NodeASelect = d3.select("#nodeA");
        NodeASelect.append("option").attr("value", "allnodes").text("Load all the nodes in the mesh...");
    }

    //Build the dropdown menu for node B
    createSelectNodes(Sidebar, "nodeB", sortedNodes());
    d3.select("#nodeB").attr("onchange",'sidebarBmx6PathsSelectNodeB(document.getElementById("nodeA").value, document.getElementById("nodeB").value)');

    //Add the option to populate the list of nodes
    if (true) {
        NodeASelect = d3.select("#nodeB");
        NodeASelect.append("option").attr("value", "allnodes").text("Load all the nodes in the mesh...");
    }

    //Add the button to calculate the paths, inactive
    Sidebar.append("p");

    Sidebar.append("button").attr("id", "calcButton").attr("class", "btn")
                            .attr("onclick", 'sidebarBmx6CalcPaths(document.getElementById("nodeA").value, document.getElementById("nodeB").value)' )
                            .append("text").text("Calculate path");

    if (document.getElementById("nodeA").value == document.getElementById("nodeB").value)
        d3.select("#calcButton").attr("disabled", true);

    onWindowResize();
}

function sidebarBmx6PathsSelectNodeA(nodeId, nodeIdA) {
    if (nodeIdA == "allnodes") {
        showAllNodes();
        sidebarBmx6Paths(nodeId, false)
    }
}

function sidebarBmx6PathsSelectNodeB(nodeIdA, nodeIdB) {

    if (nodeIdA == "allnodes" || nodeIdB == "allnodes") {
        showAllNodes();
        sidebarBmx6Paths(nodeIdA, false);
    }
    else if (nodeIdA == nodeIdB)
        d3.select("#calcButton").attr("disabled", true);
    else if (nodeIdA != nodeIdB)
        d3.select("#calcButton").attr("disabled", null);
}

function sidebarBmx6CalcPaths(nodeIdA, nodeIdB) {

    d3.select("#calcButton").attr("disabled", true);

    var Sidebar = d3.select('#sidebarContent');
    var PathDiv = Sidebar.append("div").attr("id", "pathDiv").attr("clear", "left").attr("clear", "top");
    var WaitDiv = PathDiv.append("div").attr("id", "waitDiv").attr("clear", "left").attr("clear", "top");

    var ImgLoading = WaitDiv.append("svg").attr("id", "imgLoading");

    ImgLoading.append("svg:image")
        .attr("xlink:href", '/luci-static/resources/icons/loading.gif')
        .attr("width", iconWidth)
        .attr("height", iconHeight)
        .attr("x", borderSpace)
        .attr("y", borderSpace);

    WaitDiv.append("p").append("text").text("Calculating path from " + nodes[indexNode(nodeIdA)].name + " to " + nodes[indexNode(nodeIdB)].name);
    bmx6Path(nodeIdA, nodeIdB);

    WaitDiv.append("p").append("text").text("Calculating path from " + nodes[indexNode(nodeIdB)].name + " to " + nodes[indexNode(nodeIdA)].name);
    bmx6Path(nodeIdB, nodeIdA);

    d3.select("#calcButton").attr("disabled", null);
    WaitDiv.remove();

    fullcontentBmx6Paths(nodeIdA, nodeIdB);
}




function fullcontentBmx6Paths(nodeIdA, nodeIdB) {

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 paths");
    floatContent.append("h3").text("Showing the paths between nodes " + nodes[indexNode(nodeIdA)].name + " and     " + nodes[indexNode(nodeIdB)].name);

    links.forEach (function (d) { d.strokeWidth = defaultStrokeWidth;});
    tick();

    nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)].path.forEach (function(d) {
        links[indexLink(d.in.id, d.out.id)].strokeWidth = 5;
        });

    tick();

    var PathTable = createPathTable (nodeIdA, nodeIdB, floatContent, "contentTable");

	d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Paths(nodeIdA);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Path(nodeIdA, nodeIdB, false); fullcontentBmx6Paths(nodeIdA, nodeIdB);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Paths(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Paths(nodeId);
}

function refreshContentBmx6Paths(nodeIdA, nodeIdB) {
    bmx6Originators(nodeId, false);
    updateSidebarContent("bmx6","originators",nodeId,false);
}

function sidebarBmx6Metrics(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.originators == null || nodes[indexNode(nodeId)].bmx6.originators == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Metrics(nodeId)});


        if (autorefresh)
            refreshContentBmx6Metrics(nodeId);
    }

    else {
        var columns = ["name", "metric"];
        createTable(columns, nodes[indexNode(nodeId)].bmx6.originators, d3.select('#sidebarContent'), "sidebarTable");

        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
            $('a#refreshlink').click(function() {refreshContentBmx6Metrics(nodeId)});
        d3.select('#sidebarContent').append("p").append("a").attr("id","showmorelink").attr("href", "javascript:void(0);").html("Show more details");
            $('a#showmorelink').click(function() {fullcontentBmx6Metrics(nodeId)});

        onWindowResize();
    }
}

function fullcontentBmx6Metrics(nodeId) {

    //Toggle sidebar links
    d3.select('#sidebarContent').select("#refreshlink").remove();
    d3.select('#sidebarContent').select("#showmorelink").html("Hide details");
        $('a#showmorelink').click(function() {hidecontentBmx6Metrics(nodeId)});

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 metrics");

    floatContent.append("h3").text("To "+nodes[indexNode(nodeId)].name);
    var columns = ["name", "metric"];
    createTable(columns, nodes[indexNode(nodeId)].bmx6.originators, floatContent, "floatTableL");

    showAllNodes();
    bmx6AllOriginators();
    var remoteMetrics = [];

    nodes.forEach( function(d) {
        var remoteMetric = {};
        remoteMetric.id = d.id;
        remoteMetric.name = d.name;
        remoteMetric.metric = d.bmx6.originators[indexOriginator(nodeId, d.id)].metric;
        remoteMetrics.push(remoteMetric);
    });

    floatContent.append("h3").text("From "+nodes[indexNode(nodeId)].name);
    var columns = ["name", "metric"];
    createTable(columns, remoteMetrics, floatContent, "floatTableR");

    floatContent.append("h3").text("From/to "+nodes[indexNode(nodeId)].name);
    var columns = ["name", "metric_from", "metric_to"];

    var combinedMetrics = [];

    nodes.forEach( function(item, index) {
        var combinedMetric = {};
        combinedMetric.id = item.id;
        combinedMetric.name = item.name;
        combinedMetric.metric_from = nodes[indexNode(nodeId)].bmx6.originators[indexOriginator(item.id,nodes[indexNode(nodeId)].id)].metric;
        combinedMetric.metric_to = item.bmx6.originators[indexOriginator(nodeId, item.id)].metric;
        combinedMetrics.push(combinedMetric);
    });
    createTable(columns, combinedMetrics, floatContent, "floatTableC");


    d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Metrics(nodeId);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Originators(nodeId, false); fullcontentBmx6Metrics(nodeId);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Metrics(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");

    d3.select('#sidebarContent').html("");
    sidebarBmx6Metrics(nodeId);
}

function refreshContentBmx6Metrics(nodeId) {
    bmx6Originators(nodeId, false);
    updateSidebarContent("bmx6","metrics",nodeId,false);
}

function sidebarBmx6Matrix(nodeId, autorefresh) {

    autorefresh = typeof autorefresh !== 'undefined' ? autorefresh : false;

    if ( nodes[indexNode(nodeId)].bmx6 == null || nodes[indexNode(nodeId)].bmx6.originators == null || nodes[indexNode(nodeId)].bmx6.originators == {}) {
        d3.select('#sidebarContent').append("p").append("b").text("Data not available");
        d3.select('#sidebarContent').append("p").append("a").attr("id","refreshlink").attr("href", "javascript:void(0);").html("Click here to refresh");
        $('a#refreshlink').click(function() {refreshContentBmx6Matrix(nodeId)});

      if (autorefresh)
        refreshContentBmx6Matrix(nodeId);
    }

    else {

        d3.select('#sidebarContent').append("p").append("a").attr("id","showmorelink").attr("href", "javascript:void(0);").html("Show more details");
            $('a#showmorelink').click(function() {fullcontentBmx6Matrix(nodeId)});

        fullcontentBmx6Matrix(nodeId);
    }
}

function fullcontentBmx6Matrix(nodeId) {

    //Toggle sidebar links
    d3.select('#sidebarContent').select("#refreshlink").remove();
    d3.select('#sidebarContent').select("#showmorelink").html("Hide details");
        $('a#showmorelink').click(function() {hidecontentBmx6Matrix(nodeId)});

    //Make the floatContent selection and empty the previous content
    floatContent = d3.select('#floatContent');
    floatContent.html("");

    floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");

    floatContent.append("h2").text("BMX6 metrics matrix");

    floatContent.append("h3").text("Matrices rock!");

    showAllNodes();
    bmx6AllOriginators();
    var metricsMatrix = [];

    nodes.forEach( function(d) {
        d.bmx6.originators.forEach( function(e) {
            var metric = {};
            metric.source = d.id;
            metric.target = ipv62id(e.primaryIp);
            metric.value = metric2number(e.metric);

            metricsMatrix.push(metric);
        });
    });

    mxSvg = createMatrix(metricsMatrix, floatContent, "floatMatrix")

    var columns = ["source", "target", "value"];
    createTable(columns, metricsMatrix, floatContent, "floatTable");

    d3.select('#floatContent').append("p").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("Hide");
    $('a#hidelink').click(function() {hidecontentBmx6Matrix(nodeId);});

    d3.select('#floatContent').append("p").append("a").attr("id","refreshcontent").attr("href", "javascript:void(0);").html("Refresh");
        $('a#refreshcontent').click(function() {bmx6Originators(nodeId, false); fullcontentBmx6Matrix(nodeId);});

    floatContent.attr("style", "z-Index: 1");

    $("#floatContent").draggable().resizable();
}


function hidecontentBmx6Matrix(nodeId) {

    var floatContent = d3.select('#floatContent');

    floatContent.attr("style", "z-Index: -1");
    floatContent.html("");

    d3.select('#sidebarContent').html("");
    //sidebarBmx6Matrix(nodeId);
}

function refreshContentBmx6Matrix(nodeId) {
    bmx6Originators(nodeId, false);
    updateSidebarContent("bmx6","matrix",nodeId,false);
}
