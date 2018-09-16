function testingMain(nodeId, showReload) {

	showReload = typeof showReload !== 'undefined' ? showReload : false;

	var floatContent = d3.select('#floatContent');
	floatContent.html("");

	floatContent.append("p").attr("align","right").append("a").attr("id","hidelink").attr("href", "javascript:void(0);").html("x");
	 $('a#hidelink').click(function() {hideTestingMain(nodeId);});

	var Header = floatContent.append("div").attr("id", "fcHeader");
	var Title = Header.append("div").attr("id", "fcTitle");
	Title.append("h1").text("Network testing");

	var MainSpace = floatContent.append("div").attr("id", "fcMainSpace");
	var Desc1 = MainSpace.append("div").attr("id", "fcDesc1");
	Desc1.append("p").text("This page provides a series of tools to test and evaluate several network performance aspects.");

	MainSpace.append("button")
		.attr("id", "fcSimpleButton")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingBasic("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Basic tests");

	MainSpace.append("button")
		.attr("id", "fcAdvancedButton")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingAdvanced("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Advanced tests");

	MainSpace.append("button")
		.attr("id", "fcBMX6Button")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingBMX6("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("BMX6 testing");

	MainSpace.append("button")
		.attr("id", "fcVisualizeData")
		.attr("class", "btn btn-group")
		.attr("onclick", 'visualizeResults("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Visualize results");

	MainSpace.append("button")
		.attr("id", "fcDownloadButton")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingDownload("'+nodeId+'", "fcMainSpace")' )
		.append("text").text("Download results");

	floatContent.attr("style", "z-Index: 1");
   $("#floatContent").draggable().resizable();

}


function testingDownload(nodeId, d3selection) {

	var MainSpace = d3.select("#"+d3selection);

	MainSpace.html("");

	var sHeader = MainSpace.append("div").attr("id", "sHeader");

	var sTitle = sHeader.append("div").attr("id", "sTitle");
	sTitle.append("h2").text("Download results");

	var sSpace = MainSpace.append("div").attr("id","sSpace");

	var sDesc1 = sSpace.append("div").attr("id", "sDesc1");
	sDesc1.append("p").text("This page lets you download the results of the tests performed in a JSON format for further analysis.");

	var ssTitle = sSpace.append("div").attr("id", "ssTitle");
	ssTitle.append("h3").text("Results currently available");

	sSpace.append("h4").text("Ping test results");
	if (tests.pingtests == undefined || tests.pingtests.length == 0)
		sSpace.append("p").text("There are no ping test results available for download.");
	else
		sSpace.append("p").text("There are " + tests.pingtests.length + " ping test results available for download.");

	sSpace.append("h4").text("Bandwidth test results");
	if (tests.bandwidthtests == undefined || tests.bandwidthtests.length == 0)
		sSpace.append("p").text("There are no bandwidth test results available for download.");
	else
		sSpace.append("p").text("There are " + tests.bandwidthtests.length + " ping test results available for download.");

	sSpace.append("h4").text("Path discovery results");
	if (tests.pathtests == undefined || tests.pathtests.length == 0)
		sSpace.append("p").text("There are no path discovery results available for download.");
	else
		sSpace.append("p").text("There are " + tests.pathtests.length + " path discovery results available for download.");

	sSpace.append("button")
		.attr("id", "sBack")
		.attr("class", "btn btn-group")
		.attr("onclick",'testingMain("'+nodeId+'", "sSpace")' )
		.append("text").text("Back");

	sSpace.append("button")
		.attr("id", "sDownloadPing")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingDownloadPing()' )
        .append("text").text("Download ping results");

	sSpace.append("button")
		.attr("id", "sDownloadBandwidth")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingDownloadBandwidth()' )
        .append("text").text("Download bandwidth results");

	sSpace.append("button")
		.attr("id", "sDownloadPath")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingDownloadPath()' )
        .append("text").text("Download path results");

	sSpace.append("button")
		.attr("id", "sDownloadAll")
		.attr("class", "btn btn-group")
		.attr("onclick", 'testingDownloadAll()' )
        .append("text").text("Download all results");

    if (tests.pingtests == undefined || tests.pingtests.length == 0)
		d3.select("#sDownloadPing").attr("disabled", true);
	if (tests.bandwidthtests == undefined || tests.bandwidthtests.length == 0)
		d3.select("#sDownloadBandwidth").attr("disabled", true);
	if (tests.pathtests == undefined || tests.pathtests.length == 0)
		d3.select("#sDownloadPath").attr("disabled", true);
	if	( (tests.pingtests == undefined || tests.pingtests.length == 0) &&
		  (tests.bandwidthtests == undefined || tests.bandwidthtests.length == 0) &&
		  (tests.pathtests == undefined || tests.pathtests.length == 0) )
		d3.select("#sDownloadAll").attr("disabled", true);

}

function testingDownloadPing() {

	var d = new Date;
	var dd = d.getFullYear()+"-"+('0'+d.getMonth()).substr(-2)+"-"+('0'+d.getDay()).substr(-2)+"_"+('0'+d.getHours()).substr(-2)+'-'+('0'+d.getMinutes()).substr(-2)+"-"+('0'+d.getSeconds()).substr(-2);

	var data = JSON.stringify(tests.pingtests);

	var blob = new Blob([data], {type: 'text/json'}),
		e    = document.createEvent('MouseEvents'),
		a    = document.createElement('a')

		a.download = "NCD-ping-tests" + "_" + dd + ".json"
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
}

function testingDownloadBandwidth() {

	var d = new Date;
	var dd = d.getFullYear()+"-"+('0'+d.getMonth()).substr(-2)+"-"+('0'+d.getDay()).substr(-2)+"_"+('0'+d.getHours()).substr(-2)+'-'+('0'+d.getMinutes()).substr(-2)+"-"+('0'+d.getSeconds()).substr(-2);

	var data = JSON.stringify(tests.bandwidthtests);

	var blob = new Blob([data], {type: 'text/json'}),
		e    = document.createEvent('MouseEvents'),
		a    = document.createElement('a')

		a.download = "NCD-bandwidth-tests" + "_" + dd + ".json"
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
}


function testingDownloadPath() {

	var d = new Date;
	var dd = d.getFullYear()+"-"+('0'+d.getMonth()).substr(-2)+"-"+('0'+d.getDay()).substr(-2)+"_"+('0'+d.getHours()).substr(-2)+'-'+('0'+d.getMinutes()).substr(-2)+"-"+('0'+d.getSeconds()).substr(-2);

	pathdata = { "paths": tests.paths, "pathtests":tests.pathtests};

	var data = JSON.stringify(tests.pathdata);

	var blob = new Blob([data], {type: 'text/json'}),
		e    = document.createEvent('MouseEvents'),
		a    = document.createElement('a')

		a.download = "NCD-path-tests" + "_" + dd + ".json"
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
}

function testingDownloadAll() {

	var d = new Date;
	var dd = d.getFullYear()+"-"+('0'+d.getMonth()).substr(-2)+"-"+('0'+d.getDay()).substr(-2)+"_"+('0'+d.getHours()).substr(-2)+'-'+('0'+d.getMinutes()).substr(-2)+"-"+('0'+d.getSeconds()).substr(-2);

	var data = JSON.stringify(tests);

	var blob = new Blob([data], {type: 'text/json'}),
		e    = document.createEvent('MouseEvents'),
		a    = document.createElement('a')

		a.download = "NCD-all-tests" + "_" + dd + ".json"
		a.href = window.URL.createObjectURL(blob)
		a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
		e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
		a.dispatchEvent(e)
}


function hideTestingMain(nodeId) {
	var floatContent = d3.select('#floatContent');
	floatContent.attr("style", "z-Index: -1");
	floatContent.html("");
}


//Check if iperf3 is installed on the node
function iperf3_installed(nodeId, refresh, asynchronous) {

	refresh = typeof refresh !== 'undefined' ? refresh : false;
	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	var debug = arguments;

	console.log("Function: " + arguments.callee.name + " called", nodeId, refresh, asynchronous);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		console.log("Function: " + arguments.callee.name + ". NodeId: " + nodeId + " is in the nodes list.");

		if ( nodes[n].ncd.active ) {

			if ( minVersion(nodes[n].ncd.version, "0.4.6") ) {

				if ( nodes[n].iperf3 == undefined )
					nodes[n].iperf3 = {}

				if ( nodes[n].iperf3.installed == undefined || refresh ) {

					$.ajax({
						url: "../nc/nettest_iperf3/?nodeid=" + nodeId + "&action=installed",
						type: 'get',
						dataType: 'json',
						async: asynchronous,

						success: function(data) {
							if (data == null){
								console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
							}
							else {
								console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
								if (data.installed != undefined)
									nodes[n].iperf3.installed = data.installed;
							}
						},

						error: function(data) {
							console.error("In function " + debug.callee.name + ". Ubus nettest_iperf3 request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
							this.tryCount++;
							if (this.tryCount <= this.retryLimit) {
								this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
								$.ajax(this);
							}
						}
					});
				}
			}
		}
	}
	else {
		console.warn("Function: " + arguments.callee.name + ". NodeId: " + nodeId + " is not in the nodes list.");
	}
}

//Check if iperf3 is active on the node
function iperf3_action(nodeId, action, refresh, asynchronous) {

	action = typeof action !== 'undefined' ? action : "status";
	refresh = typeof refresh !== 'undefined' ? refresh : false;
	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	var debug = arguments;

	console.log("Function: " + arguments.callee.name + " called", nodeId, refresh, asynchronous);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		console.log("Function: " + arguments.callee.name + ". NodeId: " + nodeId + " is in the nodes list.");

		if ( nodes[n].ncd.active ) {

			if ( minVersion(nodes[n].ncd.version, "0.4.6") ) {

				if ( nodes[n].iperf3 == undefined )
					iperf3_installed(nodeId, true, false);

				if ( nodes[n].iperf3.installed ) {

					$.ajax({
						url: "../nc/nettest_iperf3/?nodeid=" + nodeId + "&action=" + action,
						type: 'get',
						dataType: 'json',
						async: asynchronous,

						success: function(data) {
							if (data == null){
								console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
							}
							else {
								console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
								if (data.pid >-1 )
									nodes[n].iperf3.active = true;
								else
									nodes[n].iperf3.active = false;
							}
						},

						error: function(data) {
							console.error("In function " + debug.callee.name + ". Ubus nettest_iperf3 request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
							this.tryCount++;
							if (this.tryCount <= this.retryLimit) {
								this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
								$.ajax(this);
							}
						}
					});
				}
			}
		}
	}
	else {
		console.warn("Function: " + arguments.callee.name + ". NodeId: " + nodeId + " is not in the nodes list.");
	}
}
