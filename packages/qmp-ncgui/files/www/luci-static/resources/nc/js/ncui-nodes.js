// A file with functions for managing nodes in the graph

//Get the neighbours of a node and update the map with the new ones
//TODO: remove the nodes no longer there
function addAllNeighbours(nodeId, refresh, asynchronous)
{
    refresh = typeof refresh !== 'undefined' ? refresh : true;
    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
    var debug = arguments;

    console.log("Function " + debug.callee.name + " called.", nodeId, refresh, asynchronous);

    //Get the index of the node
	var n = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
	if ( n > -1 ) {

		console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

		//Check if NCD daemon is active and has a modern enough version (if #2, #3)
        if ( nodes[n].ncd.active ) {
        	if ( minVersion(nodes[n].ncd.version, "0.1") ) {

				console.debug("In function " + debug.callee.name + ". Node " + nodeId + " has a valid NCD version (" + nodes[n].ncd.version + " ).");

				if (refresh) {
					console.log("In function " + debug.callee.name + ". Calling updateNeighboursList for node " + nodeId + ".");
					updateNeighboursList(nodeId, false);
				}

				//For each of the neighbours list do
				nodes[n].neighbours.forEach(function(element,index) {

					//Add the neighbour to the nodes list
					if ( !inNodesList(element) ) {
						setTimeout( function () {
							//Add the node to the nodes array
							addNode(element);
							//Add the nodes as neighbours, reciprocally
							if ( !hasNeighbour(nodeId, element) )
								addNeighbour(nodeId,element);
							if ( !hasNeighbour(element, nodeId) )
								addNeighbour(element,nodeId);

							//Create the link between both nodes
							if ( !linkExists(nodeId,element) )
								addLink(nodeId,element);
						}, 1000*index);
					}
					//or, if the node is already in the list
					else {
						//Add the nodes as neighbours, reciprocally
						if ( !hasNeighbour(nodeId, element) )
							addNeighbour(nodeId,element);
						if ( !hasNeighbour(element, nodeId) )
							addNeighbour(element,nodeId);

						//Create the link between both nodes
						if ( !linkExists(nodeId,element) )
							addLink(nodeId,element);

					}
				});

				//For each of the neighbours list do
				nodes[n].neighbours.forEach( function(element,index) {
					 setTimeout( function () { initializeNewNode(element, true) }, 1000*(index+1));
				});
			}

			//if #3
			else {
				console.warn("In function " + debug.callee.name + ". Node " + nodeId + " NCD version " + nodes[n].ncd.version + " is too old (0.1 required).");
			}
		}

		//if #2
		else {
			//OK, no NCD but maybe BMX6
			if ( nodes[n].bmx6.active ) {
				updateNeighboursList(nodeId, false);

				nodes[n].neighbours.forEach(function(element,index) {

					//Add the neighbour to the nodes list
					if ( !inNodesList(element) )
					addNode(element);

					//Add the nodes as neighbours, reciprocally
					//TODO: Do it with one call
					if ( !hasNeighbour(nodeId, element) )
						addNeighbour(nodeId,element);
					if ( !hasNeighbour(element, nodeId) )
						addNeighbour(element,nodeId);

					//Create the link between both nodes
					if ( !linkExists(nodeId,element) )
						addLink(nodeId,element);
				});

				//For each of the neighbours list do
				nodes[n].neighbours.forEach( function(element,index) {
					 setTimeout( function () { initializeNewNode(element, true) }, 1000*(index+1));
				});

				force.start();
			}



		}
	}

	//if #1
	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list.");
	}
}


//Add a new node nodeId to the nodes list.
function addNode(nodeId) {

	var debug = arguments;

	console.log("Function " + debug.callee.name + " called.");

	//Check if the node is in the nodes list already
	if (!inNodesList(nodeId)) {

		//Create an empty node and push it to the nodes array
		var newNode = {};
			newNode.id = nodeId;
			newNode.center = false;
			newNode.selected = false;
			newNode.local = false;
			newNode.fixed = false;
			newNode.name = nodeId;
			newNode.x = graphProperties.width/2 + nodes.length;
			newNode.y = graphProperties.height/2 + nodes.length;
			newNode.ncd = {};
			newNode.ncd.active = true;
			newNode.bmx6 = {};
			newNode.bmx6.active = true;

		console.debug("In function " + debug.callee.name + ". Adding node " + nodeId + ".");
		var n = nodes.push(newNode);

		//Add the node to the graph
		node = node.data(nodes);

		node.enter().append("circle")
			.attr("class", "node")
			.on("dblclick", function(d,i) { moveToNode(d.id); })
			.on("click", function(d,i) { selectNode(d.id); })
			.attr("r", calcR())
			.attr("fill", function (d) { return nodeColour(d)} )
			.call(force.drag);

/*		label = label.data(nodes);

		label.enter().append("text")
			.attr("class", "label")
			.attr("text-anchor", "middle")
			.text(function(d) { return d.id; });
*/


		updateLabels();
		//Refresh the graph
		//force.start();

		//Get the basic information about the node asynchronously to check if NCD is running and update the label
		console.debug("In function " + debug.callee.name + ". Calling updateSystemBoard for node " + nodeId + ".");
		//initializeNewNode(nodeId, true);
	}

	else {
		console.log("In function " + debug.callee.name + ". Node " + nodeId + " is already in the nodes list.");
	}
}


//Get the index of nodeId in the nodes array, -1 if not found
function indexNode(nodeId) {

	if (nodeId == "local")
		return 0;

	else
		return nodes.map(function(element) {
			return element.id;
		}).indexOf(nodeId);
}

//Initialize the local node
function initializeLocalNode()
{
	var debug = arguments;
	var localNode = {};

	console.log("Function " + debug.callee.name + " called.");

	$.ajax({
		type: 'GET',
		async: false,
		url:  '../nc/local_id/',
		timeout: localTimeout,

		success: function(data) {
			if (data == null) {
				console.error("In function " + debug.callee.name + ". Ubus reply for local_id returned null.");
				localNode.id = ("Unable to get local node information.");
			} else {
				console.log("In function " + debug.callee.name + ". Ubus reply for local_id returned local id " + data.id + "." , data);
				localNode.id = data.id;
				localNode.name = data.name;
				localNode.local = true;
				localNode.center = true;
				localNode.selected = true;
				localNode.x = graphProperties.width/2;
				localNode.y = graphProperties.height/2;
				localNode.ncd = {active: true};
				localNode.bmx6 = {active: true};
			}
		},
		error: function(data) {
			console.error("In function " + debug.callee.name + ". Ubus reply for local_id returned an error.", data);
			localNode.id = "Unable to get local node information";
		},
		complete: function() {
			console.debug("In function " + debug.callee.name + ". Pushing local node to nodes list:", localNode);
			nodes.push(localNode);

			//Add the node to the graph
		node = node.data(nodes);

		node.enter().append("circle")
			.attr("class", "node")
			.on("dblclick", function(d,i) { moveToNode(d.id); })
			.on("click", function(d,i) { selectNode(d.id); })
			.attr("r", calcR())
			.attr("fill", function (d) { return nodeColour(d)} )
			.call(force.drag);

			getNCDVersion(localNode.id, true, false, false);
		}
	});
}




//Check a node's capabilities [DEPRECATED]
function nodeCapabilities(nodeId, asyncrhonous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	var debug = arguments;

	console.log("Function " + debug.callee.name + " called for node " + nodeId);

	//Check if the node is in the nodes list
	if (inNodesList(nodeId)) {

		//Check NCD capability
		var scriptUrl = "../nc/ncd_version/?nodeid=" + nodeId;

		$.ajax({
			url: scriptUrl,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				console.debug("In function " + debug.callee.name + ". Ubus ncd_version request for " + nodeId + " successful.");

				if (data == null) {
						console.warn("In function " + debug.callee.name + ". Ubus reply for ncd_version from " + nodeId + " returned null.");
						nodes[indexNode(nodeId)].ncd.active = false;
				}
				else if ( data.version == 'undefined' || data.version == null ) {
					nodes[indexNode(nodeId)].ncd.active = false;

					if (data.error != 'undefined' && data.msg != 'undefined') {
						nodes[indexNode(nodeId)].ncd.error = data.error;
						nodes[indexNode(nodeId)].ncd.errormessage = data.msg;
						console.warn("In function " + debug.callee.name + ". Ubus reply for ncd_version from " + nodeId + " returned error " + data.error + ": " + data.msg);
					}
					else
						console.warn("In function " + debug.callee.name + ". Ubus reply for ncd_version from " + nodeId + " returned no NCD version.");
				}
				else {
					console.debug("In function " + debug.callee.name + ". Ubus reply for ncd_version from " + nodeId + " returned NCD version " + data.version + ":", data);
					nodes[indexNode(nodeId)].ncd.version = data.version;
				}
			},

			error: function(data) {
				nodes[indexNode(nodeId)].ncd.active = false;
				nodes[indexNode(nodeId)].ncd.error = UBUSERROR_NCDVERSION;
				console.error("In function " + debug.callee.name + ". Ubus ncd_version request for " + nodeId + " returned an error:", data);
			},
		});
	}

	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list.");
	}
}





//Add a new node nodeId to the nodes list.
function initializeNewNode(nodeId, asynchronous) {

	//Check NCD version to ensure NCD capability
	if( nodes[indexNode(nodeId)].ncd == undefined || nodes[indexNode(nodeId)].ncd.version == undefined ) {
		getNCDVersion(nodeId, false, true, true);
	}

	//Get system board info to update the node's name
	//updateSystemBoard(nodeId, false);

	//Get BMX6 status to ensure BMX6 capability
	//bmx6Status(nodeId, true);

}


//Update the list of neighbours of the node specified in nodeId (without adding them to the graph)
function updateNeighboursList(nodeId, asynchronous)
{
	var debug = arguments;
	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;

	console.log("Function " + debug.callee.name + " called.", nodeId, asynchronous);

	//Get the index of the node
	var n = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
	if ( n > -1 ) {

		console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

		//Check if the node has the NCD daemon
        if ( nodes[n].ncd.active ) {

			console.debug("In function " + debug.callee.name + ". Node " + nodeId + " has the NCD daemon active.");

			console.debug("In function " + debug.callee.name + ". Calling Ubus neighbours for node " + nodeId + ".");

			var scriptUrl = "../nc/neighbours/?nodeid=" + nodeId;
			$.ajax({
				url: scriptUrl,
				type: 'get',
				dataType: 'json',
				async: asynchronous,

				success: function(data) {
					console.debug("In function " + debug.callee.name + ". Ubus neighbours request for " + nodeId + " successful.");

					if (data == null) {
						console.warn("In function " + debug.callee.name + ". Ubus reply for neighbours from " + nodeId + " returned null.");
						//TODO: addUbusError(nodeId);
					}
					else if (data.nodes == null) {
						console.debug("In function " + debug.callee.name + ". Ubus reply for neighbours from " + nodeId + " returned no neighbours.");
						//TODO: decide whether to take actions or not
					}
					else {
						console.debug("In function " + debug.callee.name + ". Ubus reply for neighbours from " + nodeId + " returned " + data.nodes.length + " neighbours:", data);

						nodes[n].neighbours = [];

						data.nodes.forEach( function(element,index) {
							//Check that BMX6 is not sending fake node names (i.e. outdated node ids)
							if (element != "__" ) {
								console.debug("In function " + debug.callee.name + ". Adding to " + nodeId + " neighbours' list node " + element);
								nodes[n].neighbours.push(element);
							} else
								console.warn("In function " + debug.callee.name + ". BMX6 provided an invalid neighbour for " + nodeId + ": " + element);
						});

					}
				},

				error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus neighbours request for " + nodeId + " returned an error:", data);
				}
			});
		}

		//else (if #2)
		else {

			if ( nodes[n].bmx6.active ) {
				bmx6Links(nodeId, false);
				bmx6infoOriginators(nodeId, false);

				if (nodes[n].bmx6.links != undefined && nodes[n].bmx6.links != null && nodes[n].bmx6.links != "") {
					if (nodes[n].bmx6.links != undefined && nodes[n].bmx6.links != null && nodes[n].bmx6.links != "") {

						nodes[n].neighbours = [];

						for (var i=0; i<nodes[n].bmx6.links.length; i++) {
							for (var j=0; j<nodes[n].bmx6.originators.length; j++) {
								if ( nodes[n].bmx6.links[i].bestTxLink == 1 && nodes[n].bmx6.links[i].name != undefined && nodes[n].bmx6.links[i].name == nodes[n].bmx6.originators[j].name ||
									 nodes[n].bmx6.links[i].bestTxLink == 1 && nodes[n].bmx6.links[i].globalId != undefined && nodes[n].bmx6.links[i].globalId == nodes[n].bmx6.originators[j].globalId ) {
										nodes[n].neighbours.push(ipv62id(nodes[n].bmx6.originators[j].primaryIp));
								}
							}
						}
					}
				}
			}
			else {
				//
			}
		}
	}
	//else (if #1)
	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list");
	}
}



//Update the name of nodeId
function updateName(nodeId, refresh) {

	refresh = typeof refresh !== 'undefined' ? refresh : false;
	var debug = arguments;

	var n = indexNode(nodeId);

	//Check if nodeId is in the nodes list (if #1)
	if ( n > -1 ) {
		console.debug("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//TODO (if refresh) update SystemBoard (then BMX6status true)

		//Check if nodeId has the systemBoard info with the hostname
		if (nodes[n].system != undefined && nodes[n].system.board != undefined && nodes[n].system.board.hostname != undefined) {
			nodes[n].name = nodes[n].system.board.hostname;
			updateLabels();
		}
		//or the BMX6 status info with the name
		else if ( nodes[n].bmx6 != undefined && nodes[n].bmx6.status != undefined && nodes[n].bmx6.status.name != undefined ) {
			nodes[n].name = nodes[n].bmx6.status.name;
			updateLabels();
		}
		//or the very old BMX6 status info with the globalId
		else if ( nodes[n].bmx6 != undefined && nodes[n].bmx6.status != undefined && nodes[n].bmx6.status.globalId != undefined ) {
			nodes[n].name = nodes[n].bmx6.status.globalId.split(".")[0];
			updateLabels();
		}
		//Otherwise warn on the console
		else {
			console.warn("In function: " + arguments.callee.name + ". nodeId: " + nodeId + " does not have any source for the hostname");
		}
	}
	//(if #1) nodeId is no longer in the nodes list
	else {
		console.warn("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}
