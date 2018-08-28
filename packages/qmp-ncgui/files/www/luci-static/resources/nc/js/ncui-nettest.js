// A file with some network test functions for the NCui

//Ping an IPv6 address from a node
function ping6test(nodeId, address, parameters, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	address = typeof address !== 'undefined' ? address : "localhost";
	parameters = typeof parameters !== 'undefined' ? parameters : "-c 5 -s 56";
	var debug = arguments;

	console.log("Function " + debug.callee.name + " called.", nodeId, address, asynchronous, parameters);

	var n = indexNode(nodeId);
	var pingresult = "";

	if ( n > -1 ) {

		if ( minVersion(nodes[n].ncd.version, "0.4.3") ) {

			console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

			$.ajax({
				url: "../nc/nettest_ping/?nodeid=" + nodeId + "&address=" + address + "&parameters=" + parameters,
				type: 'get',
				dataType: 'json',
				async: asynchronous,
				timeout: testTimeout,

				success: function(data) {
					if (data == null)
						console.error("In function " + debug.callee.name + ". Ubus reply for nettest_ping returned null.");

					else {
						console.debug("In function " + debug.callee.name + ". Ubus reply for nettest_ping returned:", data);
						pingresult = data.ping;
					}
				},

				error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus reply for nettest_ping returned an error:", data);
				}
			});

			return pingresult;
		}

		else {
			console.warn("In function " + debug.callee.name + ". Node " + nodeId + " NCD version " + nodes[n].ncd.version + " is too old (0.4.3 required).");
		}
	}
	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list.");
		return -1;
	}
}


function iperf3test(nodeId, address, asynchronous, parameters) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	address = typeof address !== 'undefined' ? address : "localhost";
	parameters = typeof parameters !== 'undefined' ? parameters : "";
	var debug = arguments;

	console.log("Function " + debug.callee.name + " called.", nodeId, address, asynchronous, parameters);

	var n = indexNode(nodeId);
	var bandwidthresult = "";

	if ( n > -1 ) {

		if ( minVersion(nodes[n].ncd.version, "0.4.6.1") ) {

			console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

			$.ajax({
				url: "../nc/nettest_bandwidth/?nodeid=" + nodeId + "&address=" + address + "&parameters=" + parameters,
				type: 'get',
				dataType: 'json',
				async: asynchronous,
				timeout: testTimeout,

				success: function(data) {
					if (data == null)
						console.error("In function " + debug.callee.name + ". Ubus reply for nettest_bandwidth returned null.");

					else {
						console.debug("In function " + debug.callee.name + ". Ubus reply for nettest_bandwidth returned:", data);
						bandwidthresult = data;
					}
				},

				error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus reply for nettest_bandwidth returned an error:", data);
				}
			});

			return bandwidthresult;
		}

		else {
			console.warn("In function " + debug.callee.name + ". Node " + nodeId + " NCD version " + nodes[n].ncd.version + " is too old (0.4.6.1 required).");
		}
	}
	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list.");
		return -1;
	}
}
