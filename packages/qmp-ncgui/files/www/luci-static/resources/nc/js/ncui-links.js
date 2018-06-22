// A file with some functions to operate with the links on the NCui graph

//Translate the BMX6 links information of a node to the links array of the graph
function bmx6Links2Graph(nodeId) {

    debugVar = arguments;

    var nodeIndex = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
    if ( nodeIndex > -1 ) {

		if (DEBUGMODE)
            console.log("[DEBUG]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " is in the nodes list");

		//Check if the node has BMX6 information (if #2)
		if (nodes[nodeIndex].bmx6) {


			//Check if the node has BMX6 links information (if #3)
			if (typeof nodes[nodeIndex].bmx6.links != "undefined") {

				//Go one by one through the BMX6 links list and dump the information to the links list
				nodes[nodeIndex].bmx6.links.forEach ( function(element) {

					//Search for the remote node that owns the link-local IP
					var rNodeId = nodeBmx6LinkLocalIp(element.llocalIp);

					console.log(rNodeId);

					//Check if such node was found (if #4)
					if (rNodeId) {

						var linkIndex = indexLink(nodeId,rNodeId)

						//Check if the link between nodeId and rNodeId exists (if #5)
						if (linkIndex > -1) {
							if (element.bestTxLink)
								links[linkIndex].quality = (element.rxRate*element.rxRate/10000+(element.rxRate+element.rxRate)/200)/2;
								//links[linkIndex].strokeWidth = (calcThickness()*links[linkIndex].quality);
							force.start();
						}

						else { //(if #5)
							if (DEBUGMODE)
            					console.log("[DEBUG]. Function " + arguments.callee.name + ": Link between: " + nodeId + " and " + rNodeId + "is not in the links list");
						}
					}

					else //(if #4)
					{
					if (DEBUGMODE)
            			console.log("[DEBUG]. Function " + arguments.callee.name + ": Link-local IP: " + element.llocalIp + " is not in any BMX6 interfaces list");

					}

				});

			}

			//(if #3)
			else
        	if (ERRORMODE)
            	console.log("[ERROR]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " has no BMX6 links information");
		}

		//(if #2)
		else
        if (ERRORMODE)
            console.log("[DEBUG]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " has no BMX6 information");


    }

    //(if #1)
    else
        if (ERRORMODE)
            console.log("[ERROR]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " is not in the nodes list");
}


//Translate the BMX6 originators information of a node to the links array of the graph
function bmx6Originators2Graph(nodeId) {

    debugVar = arguments;

    var nodeIndex = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
    if ( nodeIndex > -1 ) {

		if (DEBUGMODE)
            console.log("[DEBUG]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " is in the nodes list");

		//Check if the node has BMX6 information (if #2)
		if (nodes[nodeIndex].bmx6) {

			//Check if the node has BMX6 links information (if #3)
			if (typeof nodes[nodeIndex].bmx6.links != "undefined") {

				//Check if the node has BMX6 links information (if #4)
				if (typeof nodes[nodeIndex].bmx6.originators != "undefined") {

					//Go one by one through the BMX6 links list and dump the information to the links list
					nodes[nodeIndex].bmx6.links.forEach ( function(element) {

						console.log("links.element:", element);

						//Search for the remote node that owns the link-local IP
						var rNodeId = nodeBmx6LinkLocalIp(element.llocalIp);

						console.log("rNodeId", rNodeId);

						//Check if such node was found (if #6)
						if (rNodeId) {

							var linkIndex = indexLink(nodeId,rNodeId);

							//Check if the link between nodeId and rNodeId exists (if #6)
							if (linkIndex > -1) {

								//Check if there is originators information for the remote node
								var rIndexInOriginators = indexOriginator(rNodeId, nodeId);

								console.log("index:", rIndexInOriginators);



								//If it is the element with the best tx link (the one that BMX6 will use)
								if (element.bestTxLink) {
									links[linkIndex].metric = metric2number(nodes[nodeIndex].bmx6.originators[rIndexInOriginators].metric);
									tick();
								}
							}

							else { //(if #6)
								if (DEBUGMODE)
	            					console.log("[DEBUG]. Function " + arguments.callee.name + ": Link between: " + nodeId + " and " + rNodeId + "is not in the links list");
							}
						}

						else //(if #5)
						{
						if (DEBUGMODE)
	            			console.log("[DEBUG]. Function " + arguments.callee.name + ": Link-local IP: " + element.llocalIp + " is not in any BMX6 interfaces list");

						}

					});

				}

				//if (#4)
				else
					if (ERRORMODE)
            	console.log("[ERROR]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " has no BMX6 originators information");


			}

			//(if #3)
			else
        	if (ERRORMODE)
            	console.log("[ERROR]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " has no BMX6 links information");
		}

		//(if #2)
		else
        if (ERRORMODE)
            console.log("[DEBUG]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " has no BMX6 information");


    }

    //(if #1)
    else
        if (ERRORMODE)
            console.log("[ERROR]. Function " + arguments.callee.name + ": nodeId: " + nodeId + " is not in the nodes list");
}



//Get the ID of the node linkLocalIP belongs to
function nodeBmx6LinkLocalIp(linkLocalIP) {
	var nodeLinkLocalIP=null;

	nodes.some(function (element){
		console.log("ELEMENT:" + element.id);
		if (element.bmx6 && element.bmx6.interfaces && element.bmx6.interfaces.length) {
			element.bmx6.interfaces.some(function (interf) {
				if (areSameIPAddress(linkLocalIP, interf.llocalIp)) {
					nodeLinkLocalIP=element.id;
					return true;
				}
			});
		}
		if (nodeLinkLocalIP)
			return true;
	});
	return nodeLinkLocalIP;
}

//Check if both IPv4/IPv6 addresses are the same, apart from the mask
function areSameIPAddress(ipv61, ipv62) {
	if (ipv61.split("/")[0] == ipv62.split("/")[0])
		return true;
	else
		return false;
}