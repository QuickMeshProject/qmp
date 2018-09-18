// A file with some BMX7-specific functions for the NCui

//Get all the BMX7 information for all nodes
function allBmx7All() {
	nodes.forEach(function(d){bmx7All(d.id,true);});
	nodes.forEach(function(d){bmx7Options(d.id,true);});
	nodes.forEach(function(d){bmx7Parameters(d.id,true);});
}

//Get all the BMX7 information (interfaces, links, originators, originators) from nodeId
function bmx7All(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debug = arguments;

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //Get BMX7 interfaces from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_all/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
            	console.warn("In function " + debug.callee.name + ". Ubus returned null (nodeId: " + nodeId +")");            }
            else {
                if (DEBUGMODE)
					console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                    	nodes[nodeIndex].bmx7.interfaces = data.interfaces.interfaces;
						nodes[nodeIndex].bmx7.links = data.links.links;
						nodes[nodeIndex].bmx7.originators = data.originators.originators;
						nodes[nodeIndex].bmx7.status = data.status.status;
                     }
                },
				error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_all request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
              }
          });
    }
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}


//Get the BMX7 paths from node1 to all the other nodes
function bmx7AllPaths(node1)
{

    var bmx7error = false;
    var debug = arguments;

    //Get the index for node1 and check that it is in the nodes list (if #1)
    var indexNode1 = indexNode(node1);

    if (indexNode1 > -1 ) {

        //Get, synchronously, the BMX7 originators list
        bmx7Originators(node1, false);

        //Request the path for all the originators
        nodes[indexNode1].bmx7.originators.forEach( function(element) {
            if ( ipv62id(element.primaryIp) != node1 )
                bmx7Path(node1,ipv62id(element.primaryIp));
             });
    }

    //(if #1) node1 is not in the nodes list
    else {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") is not in the nodes list");
    }
}


//Get the BMX7 originators of all nodes
function bmx7AllOriginators()
{
    var bmx7error = false;
    var debug = arguments;

    nodes.forEach(function (d) {
        bmx7Originators(d.id, false);
        });
}


//Get the BMX7 descriptors from nodeId
function bmx7Descriptors(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debug = arguments;

	console.debug("Function: " + arguments.callee.name + ". Getting descriptors for node " + nodeId + " " + asynchronously(asynchronous));

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //If not present, create an empty object to store BMX7 descriptors
        if (nodes[nodeIndex].bmx7.descriptors == null)
            nodes[nodeIndex].bmx7.descriptors = {};

        //Get BMX7 descriptors from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_descriptors/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
            }
            else {
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                         nodes[nodeIndex].bmx7.descriptors = data.descriptors;
                     }
                },
				error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_descriptors request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
              }
          });
    }
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}

//Get the BMX7 interfaces list from nodeId
function bmx7Interfaces(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debug = arguments;

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //If not present, create an empty object to store BMX7 interfaces object
        if (nodes[nodeIndex].bmx7.interfaces == null)
            nodes[nodeIndex].bmx7.interfaces = {};

        //Get BMX7 interfaces from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_interfaces/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
            }
            else {
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                         nodes[nodeIndex].bmx7.interfaces = data.interfaces;
                     }
                },
                error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_interfaces request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
              }
          });
    }
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}
/* WHAT'S THIS PIECE OF CODE HERE? :S
{

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debugVar = arguments;

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //If not present, create an empty object to store BMX7 interfaces object
        if (nodes[nodeIndex].bmx7.interfaces == null)
            nodes[nodeIndex].bmx7.interfaces = {};

        //Get BMX7 interfaces from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_links/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
            }
            else {
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                         nodes[nodeIndex].bmx7.links = data.links;
                     }
                },
                error: function(data) {
                    console.log("Function: " + arguments.callee.name + ". Error in Ubus call. Returned data: ", data);
              }
          });
    }
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}*/




//Get the BMX7 originators list from nodeId
function bmx7Originators(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;

    var debug = arguments;

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //If not present, create an empty object to store BMX7 originators object
        if (nodes[nodeIndex].bmx7.originators == null)
            nodes[nodeIndex].bmx7.originators = {};

        //Get BMX7 originators from NCD via ubus
        $.ajax({
        	url: "../nc/bmx7_originators/?nodeid=" + nodeId,
        	type: 'get',
        	dataType: 'json',
        	async: asynchronous,
        	success: function(data) {
        		if (data == null){
        			console.warn("In function " + debug.callee.name + ". Ubus returned null (nodeId: " + nodeId +")");
            	}
            	else {
            		console.log("In function " + debug.callee.name + ". Ubus response: ", data);
                	nodes[nodeIndex].bmx7.originators = data.originators;
				}
			},
			error: function(data) {
				console.error("In function " + debug.callee.name + ". Ubus bmx7_originators request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
				this.tryCount++;
				if (this.tryCount <= this.retryLimit) {
					this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
					$.ajax(this);
				}
			}
		});
    }
    else {
		console.warn("In function " + debug.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
    }

}

//Get the BMX7 parameters list from nodeId
function bmx7Parameters(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;

    var debug = arguments;

    var nodeIndex = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
    if ( nodeIndex > -1 ) {
        log(DEBUG, arguments.callee.name, "Node " + nodeId + " is in the nodes list.");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //Get BMX7 parameters from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_parameters/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
            }
            else {
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                         nodes[nodeIndex].bmx7.parameters = data.OPTIONS;
                     }
                },
                error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_parameters request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
              }
          });
    }

    else //(if #1)
		log(WARNING, arguments.callee.name, "Node " + nodeId + " is not in the nodes list.");
}


//Get the BMX7 path from node1 to node2 and save it to node1
function bmx7Path(node1, node2)
{

    var bmx7error = false;
    var debug = arguments;

    //(if #1) Check that both nodes are different
    if (node1 != node2) {

        //Get the index for node1 and check that it is in the nodes list (if #2)
        var indexNode1 = indexNode(node1);

        if (indexNode1 > -1 ) {

            //Check if node1 has the BMX7 object or create it (if #3)
            if ( nodes[indexNode1].bmx7 == null )
                 nodes[indexNode1].bmx7 = {};

            //Check if node1 has the BMX7 paths array or create it (if #4)
            if ( nodes[indexNode1].bmx7.paths == null )
                 nodes[indexNode1].bmx7.paths = [];

            //Calculate the path from node1 to node2 and save it to path
            var path = bmx7Traceroute(node1,node2);

            //Check if the calculated path has one or more hops (if #5)
            if (path.length > 0) {

                //TODO: also check if the path is complete

                var pathObject = {};
                pathObject.path = path.reverse();
                pathObject.id = node2;

                var indexPath = nodes[indexNode1].bmx7.paths.map(function(element) {
                    return element.id;
                }).indexOf(node2);

                //Check if node1 already contains this path, to overwrite it (if #6)
                if (indexPath > -1) {
                    //Overwrite the path
                    nodes[indexNode1].bmx7.paths[indexPath] = pathObject;
                }
                //(if #6) node1 does not contain the path
                else {
                    //Save the path
                    nodes[indexNode1].bmx7.paths.push(pathObject);
                }
            }

            //(if #5) the calculated path has 0 length
            else {
                //TODO: add debug message
                console.log("blip");
            }
        }

        //(if #2) node1 is not in the nodes list
        else {
            if (DEBUGMODE)
                console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") is not in the nodes list");
        }

    }

    //(if #2) node1 is not in the nodes list
    else {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". Path origin and destination are the same node (" + node1 + ")");
    }
}


//Get the BMX7 metrics from all nodes to
function bmx7RemoteMetricsStatus(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debug = arguments;

    var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 ) {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

        //If not present, create an empty object to store BMX7 objects
        if (nodes[nodeIndex].bmx7 == null)
            nodes[nodeIndex].bmx7 = {};

        //If not present, create an empty object to store BMX7 interfaces object
        if (nodes[nodeIndex].bmx7.remoteMetrics == null)
            nodes[nodeIndex].bmx7.remoteMetrics = {};

        nodes.forEach(function(d) {
            bmx7Originators(d.id, false);
        });
        //Get BMX7 interfaces from NCD via ubus
        $.ajax({
                url: "../nc/bmx7_status/?nodeid=" + nodeId,
        type: 'get',
        dataType: 'json',
        async: asynchronous,
        success: function(data) {
            if (data == null){
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
            }
            else {
                if (DEBUGMODE)
                             console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                         nodes[nodeIndex].bmx7.status = data.status;
                     }
                },
                error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_status request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
              }
          });
    }
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}


//Set the BMX7 metric algorithm value and exponents to nodeId
function bmx7SetBmx7Algo(nodeId, algorithm, rxExpNumerator, rxExpDivisor, txExpNumerator, txExpDivisor, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	var debug = arguments;

	var nodeIndex = indexNode(nodeId);

    if ( nodeIndex > -1 || nodeId=="local" ) {
		console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Set BMX7 metric algorithm via ubus
		$.ajax({
			url: "../nc/set_bmx7_metricalgo/?nodeid=" + nodeId + "&algorithm=" + algorithm + "&rxExpNumerator=" + rxExpNumerator + "&rxExpDivisor=" + rxExpDivisor + "&txExpNumerator=" + txExpNumerator + "&txExpDivisor=" + txExpDivisor,

			type: 'get',
			dataType: 'json',
			async: asynchronous,
			success: function(data) {
				if (data == null) {
					console.warn("Function: " + arguments.callee.name + ". Ubus returned null.", nodeId);
				}
				else {
					console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
				}
			},
			error: function(data) {
				console.error("In function " + debug.callee.name + ". Ubus set_bmx7_metricalgo request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
    else
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
}





//Get the BMX7 links information from nodeId
function bmx7Links(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active )
			bmx7luncedLinks(nodeId, asynchronous);
		else
			bmx7infoLinks(nodeId, asynchronous);
	}
}


//Get the BMX7 options information from nodeId
function bmx7Options(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active )
			bmx7luncedOptions(nodeId, asynchronous);
		else
			bmx7infoOptions(nodeId, asynchronous);
	}
}


//Get the BMX7 status information from nodeId
function bmx7Status(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active )
			bmx7luncedStatus(nodeId, asynchronous);
		else
			bmx7infoStatus(nodeId, asynchronous);
	}
}


//Get the BMX7 descriptions information from nodeId via bmx7info
function bmx7infoDescriptions(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Get BMX7 interfaces from lunced via ubus
		$.ajax({
			url: "../nc/bmx7info_descriptions/?nodeid=" + nodeId,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				if (data == null || data == undefined)
					console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7info_descriptions from " + nodeId + " returned null.");

				else if (data != undefined && data != null && data != ""  ) {
					console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7info_descriptions from " + nodeId + " returned", data);
					nodes[n].bmx7.descriptions = data.data;
				}
				else {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_descriptions request for " + nodeId + " returned an error:", data);
				}
			},

			error: function(data) {
				ncdError();
				console.error("In function " + debug.callee.name + ". Ubus bmx7_descriptions request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}

//Get the BMX7 links information from nodeId via bmx7info
function bmx7infoLinks(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Get BMX7 interfaces from lunced via ubus
		$.ajax({
			url: "../nc/bmx7info_links/?nodeid=" + nodeId,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				if (data == null || data == undefined)
					console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7_links from " + nodeId + " returned null.");

				else if (data.links != undefined && data.links != null && data.links != ""  ) {
					console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7_links from " + nodeId + " returned", data);
					nodes[n].bmx7.links = data.links;
				}
				else {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_links request for " + nodeId + " returned an error:", data);
				}
			},

			error: function(data) {
				ncdError();
				console.error("In function " + debug.callee.name + ". Ubus bmx7_links request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}


//Get the BMX7 options information from nodeId via bmx7info
function bmx7infoOptions(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Get BMX7 interfaces from lunced via ubus
		$.ajax({
			url: "../nc/bmx7info_options/?nodeid=" + nodeId,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				if (data == null || data == undefined)
					console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7info_options from " + nodeId + " returned null.");

				else if (data != undefined && data != null && data != ""  ) {
					console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7info_options from " + nodeId + " returned", data);
					nodes[n].bmx7.options = data.OPTIONS;
				}
				else {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_options request for " + nodeId + " returned an error:", data);
				}
			},

			error: function(data) {
				ncdError();
				console.error("In function " + debug.callee.name + ". Ubus bmx7_options request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}


//Get the BMX7 originators information from nodeId via bmx7info
function bmx7infoOriginators(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Get BMX7 interfaces from lunced via ubus
		$.ajax({
			url: "../nc/bmx7info_originators/?nodeid=" + nodeId,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				if (data == null || data == undefined)
					console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7info_originators from " + nodeId + " returned null.");

				else if (data != undefined && data != null && data != ""  ) {
					console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7info_originators from " + nodeId + " returned", data);
					nodes[n].bmx7.originators = data.data;
				}
				else {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_originators request for " + nodeId + " returned an error:", data);
				}
			},

			error: function(data) {
				ncdError();
				console.error("In function " + debug.callee.name + ". Ubus bmx7_originators request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}

//Get the BMX7 status information from nodeId via bmx7info
function bmx7infoStatus(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

		//Get BMX7 interfaces from lunced via ubus
		$.ajax({
			url: "../nc/bmx7info_status/?nodeid=" + nodeId,
			type: 'get',
			dataType: 'json',
			async: asynchronous,

			success: function(data) {
				if (data == null || data == undefined)
					console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7_status from " + nodeId + " returned null.");

				else if (data.status != undefined && data.status != null && data.status != ""  ) {
					console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7_status from " + nodeId + " returned", data);
					nodes[n].bmx7.status = data.status;
					updateName(nodeId);
				}
				else {
					console.error("In function " + debug.callee.name + ". Ubus bmx7_status request for " + nodeId + " returned an error:", data);
				}
			},

			error: function(data) {
				ncdError();
				console.error("In function " + debug.callee.name + ". Ubus bmx7_status request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
			}
		});
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}


//Get the BMX7 links list from nodeId via lunced
function bmx7luncedLinks(nodeId, asynchronous) {

    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active ) {
			console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

			//Get BMX7 links from lunced via ubus
			$.ajax({
				url: "../nc/bmx7_links/?nodeid=" + nodeId,
				type: 'get',
				dataType: 'json',
				async: asynchronous,

				success: function(data) {
					if (data == null || data == undefined)
						console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7_links from " + nodeId + " returned null.");

					else if (data.links != undefined && data.links != null && data.links != ""  ) {
						console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7_links from " + nodeId + " returned", data);
						nodes[n].bmx7.links = data.links;
					}
				},

				error: function(data) {
					ncdError();
					console.error("In function " + debug.callee.name + ". Ubus bmx7_links request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
				}
			});
		}
		else{
			console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " does not have the NCD active");
		}
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}


//Get the BMX7 options list from nodeId
function bmx7luncedOptions(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active ) {
			console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

			//If not present, create an empty object to store BMX7 objects
			if (nodes[n].bmx7 == undefined)
				nodes[n].bmx7 = {};

			//Get BMX7 options from lunced via ubus
			$.ajax({
				url: "../nc/bmx7_options/?nodeid=" + nodeId,
				type: 'get',
				dataType: 'json',
				async: asynchronous,

				success: function(data) {
					if (data == null){
						console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7_options from " + nodeId + " returned null.");
					}
					else if (data.OPTIONS != undefined) {
						console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7_options from " + nodeId + " returned", data);
						nodes[n].bmx7.options = data.OPTIONS;
					}
				},
				error: function(data) {
					ncdError();
					console.error("In function " + debug.callee.name + ". Ubus bmx7_options request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
				}
			});
		}
		else{
			console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " does not have the NCD active");
		}
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}


//Get the BMX7 status information from nodeId via lunced
function bmx7luncedStatus(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
	var debug = arguments;

	console.log("Function " + arguments.callee.name + " called. nodeId: " + nodeId);

	var n = indexNode(nodeId);

	if ( n > -1 ) {
		if ( nodes[n].ncd.active ) {
			console.debug("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is in the nodes list");

			//If not present, create an empty object to store BMX7 objects
			if (nodes[n].bmx7 == undefined)
				nodes[n].bmx7 = {};
			//Get BMX7 status from lunced via ubus
			$.ajax({
				url: "../nc/bmx7_status/?nodeid=" + nodeId,
				type: 'get',
				dataType: 'json',
				async: asynchronous,

				success: function(data) {
					if (data == null || data == undefined)
						console.warn("In function " + arguments.callee.name + ". Ubus reply for bmx7_status from " + nodeId + " returned null.");

					else if (data.status != undefined && data.status != null && data.status != ""  ) {
						console.debug("In function " + arguments.callee.name + ". Ubus reply for bmx7_status from " + nodeId + " returned", data);
						nodes[n].bmx7.status = data.status;
					}
				},

				error: function(data) {
					ncdError();
					console.error("In function " + debug.callee.name + ". Ubus bmx7_status request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
				}
			});
		}
		else{
			console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " does not have the NCD active");
		}
	}
	else{
		console.warn("In function " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
	}
}








//Calculate the BMX7 path from node1 to node2
function bmx7Traceroute(node1, node2)
{
    var bmx7error = false;
    var debug = arguments;

    //Get the index for node1 and check that it is in the nodes list (if #1)
    var indexNode1 = indexNode(node1);

    if (indexNode1 > -1 ) {

        //Update, synchronously, the BMX7 originators list of node1 to get the latest data
        bmx7Originators(node1, false);
        bmx7Interfaces(node1,false);

        //Check if node1 has the originators list (if #2)
        if ( nodes[indexNode1].bmx7 != null && nodes[indexNode1].bmx7.originators != null ) {

            //Check if node2 is in the originators list of node1 (if #3)
            if (inBmx7OriginatorsList(node2, nodes[indexNode1].bmx7.originators)) {

                //Get the index of node2 in the originators list of node1
                var index2InOriginators = indexBmx7Originators(node2, nodes[indexNode1].bmx7.originators);

                //Update, synchronously, the BMX7 links list of node1 to get the latest data
                bmx7Links(node1, false);

                //Check if node1 has the links list (if #4)
                if ( nodes[indexNode1].bmx7.links != null ) {

                    //Update, synchronously, the neighbours list of node1 to get the latest data
                    addAllNeighbours(node1);

                    //Check that node1 has a non-empty neighbours list (if #5)
                    if ( nodes[indexNode1].neighbours != null && nodes[indexNode1].neighbours.length > 0) {

                        //Find which neighbour has the address that corresponds to node2's viaIp
                        var viaNeighbourIndex = -1;

                        nodes[indexNode1].neighbours.some(function(element, index){

                            //Get the index of the element in the nodes list
                            var elementIndex = indexNode(element);

                            //Check if it is in the nodes list (if #6)
                            if (elementIndex > -1) {

                                //Update, synchronously, the BMX7 interfaces list of element to get the latest data
                                bmx7Interfaces(element, false);

                                //Check that the element node has a non-empty BMX7 interfaces list (if #7)
                                if ( nodes[elementIndex].bmx7 != null && nodes[elementIndex].bmx7.interfaces != null ) {

                                    //Check if the element has the linklocal IP in node1's viaIP (if #8)
                                    if (isIpv6InInterfaces (nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp, nodes[elementIndex].bmx7.interfaces) ){

                                        console.log("Next hop for path from Node1 ("+ node1 + ") to Node2 (" + node2 + ") is node #" + elementIndex + " (" + nodes[elementIndex].id + ")");
                                        viaNeighbourIndex = index;
                                        return true;
                                    }
                                    //(if #8)
                                    else {
                                        if (DEBUGMODE)
                                            console.log("Function: " + arguments.callee.name + ". Neighbour " + element + " of Node1 (" + node1 + ") does not have IPv6 " + nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp + " in the interfaces list");
                                        }

                                }
                                //(if #7)
                                else {
                                    if (DEBUGMODE)
                                        console.log("Function: " + arguments.callee.name + ". Neighbour " + element + " of Node1 (" + node1 + ") has no BMX7 interfaces list");
                                }


                            }

                            //(if #6) element is not in the nodes list
                            else {
                                if (DEBUGMODE)
                                    console.log("Function: " + arguments.callee.name + ". Neighbour " + element + " of Node1 (" + node1 + ") is not in the nodes list");
                            }

                            });

                        //Check if we got the next hop for the path between node1 and node2 (if #9)
                        if (viaNeighbourIndex > -1) {

                            var nextHop = nodes[indexNode(nodes[indexNode1].neighbours[viaNeighbourIndex])].id;

                            //Check if next hop is the destination node(if #10)
                            if ( nextHop == node2 ) {

                                var path = [], hopObject = {};

                                hopObject.in = {};
                                hopObject.in.id = node1;
                                hopObject.in.interface = nodes[indexNode1].bmx7.originators[index2InOriginators].viaDev;
                                hopObject.in.ip = nodes[indexNode1].bmx7.interfaces[indexNameInInterfaces(hopObject.in.interface, nodes[indexNode1].bmx7.interfaces)].llocalIp.split("/")[0];
								hopObject.out = {};
                                hopObject.out.id = nextHop;
                                hopObject.out.ip = nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp;
                                hopObject.out.interface = nodes[indexNode(nextHop)].bmx7.interfaces[indexIpv6InInterfaces(nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp, nodes[indexNode(nextHop)].bmx7.interfaces)].devName;

                                path.push(hopObject);

                                console.log("PATH FOUND! :D");
                                addAllNeighbours(nextHop);

                                console.log("Returning path with first hop", path);
                                return path;

                            }

                            //(if #10) Next hop is an intermediate node
                            else {

                                if (DEBUGMODE)
                                    console.log("Recursively calling bmx7Traceroute("+ nextHop +", " + node2 +")");

                                var path = bmx7Traceroute(nextHop,node2);

                                var hopObject = {};

                                hopObject.in = {};
                                hopObject.in.id = node1;
                                hopObject.in.interface = nodes[indexNode1].bmx7.originators[index2InOriginators].viaDev;
                                hopObject.in.ip = nodes[indexNode1].bmx7.interfaces[indexNameInInterfaces(hopObject.in.interface, nodes[indexNode1].bmx7.interfaces)].llocalIp.split("/")[0];
								hopObject.out = {};
                                hopObject.out.id = nextHop;
                                hopObject.out.ip = nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp;
                                hopObject.out.interface = nodes[indexNode(nextHop)].bmx7.interfaces[indexIpv6InInterfaces(nodes[indexNode1].bmx7.originators[index2InOriginators].viaIp, nodes[indexNode(nextHop)].bmx7.interfaces)].devName;

                                path.push(hopObject);

                                console.log("Returning path with another hop", path);
                                                                return path;
                            }


                        }
                        //(if #9) The next hop couldn't be found
                        else {

                        if (DEBUGMODE)
                            console.log("Function: " + arguments.callee.name + ". Next hop from Node1 (" + node1 + ") to Node2 (" + node2 + ") not found");

                        }



                    }

                    //(if #5) node1 does not have neighbours list, or is empty
                    else {
                        if (DEBUGMODE)
                            console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") has no neighbours data", nodes[indexNode1].neighbours);

                    }

                }

                //(if #4) node1 does not have the links list
                else {
                    if (DEBUGMODE)
                        console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") has no links data");
                }


            }

            //(if #3) node2 is not in the originators list of node1
            else {
                if (DEBUGMODE)
                    console.log("Function: " + arguments.callee.name + ". Node2 (" + node2 + ") is not in the originators list of Node1 (" + node1 + ")" );
            }

        }

        //(if #2) node1 does not have the originators list
        else {
            if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") has no originators data");
        }
    }

    //(if #1) node1 is not in the nodes list
    else {
        if (DEBUGMODE)
            console.log("Function: " + arguments.callee.name + ". Node1 (" + node1 + ") is not in the nodes list");
    }
}

//Get the index of metricAlgo in the options array, -1 if not found
function indexBmx7OptionsAlgorithm(nodeId) {
    return nodes[indexNode(nodeId)].bmx7.options.map(function(element) {
      return element.name;
    }).indexOf("metricAlgo");
}

//Get the index of the exponent "expo" in the metricAlgo options array, -1 if not found
function indexBmx7OptionsAlgorithmExponents(nodeId, expo) {
    return nodes[indexNode(nodeId)].bmx7.options[indexBmx7OptionsAlgorithm(nodeId)].CHILD_OPTIONS.map(function(element) {
		return element.name;
    }).indexOf(expo);
}

//Get the index of metricAlgo in the parameters array, -1 if not found
function indexBmx7ParametersAlgorithm(nodeId) {
    return nodes[indexNode(nodeId)].bmx7.parameters.map(function(element) {
      return element.name;
    }).indexOf("metricAlgo");
}

//Get the index of METRIC_EXTENSION in the extensions array, -1 if not found
function indexBmx7MetricExtensions(extensions) {
    return extensions.map(function(element) {
 		if ( element.METRIC_EXTENSION )
   			return true;
	}).indexOf(true);
}


//Get the index of the exponent "expo" in the metricAlgo parameters array, -1 if not found
function indexBmx7ParametersAlgorithmExponents(nodeId, expo) {
    return nodes[indexNode(nodeId)].bmx7.parameters[indexBmx7ParametersAlgorithm(nodeId)].INSTANCES[0].CHILD_INSTANCES.map(function(element) {
		return element.name;
    }).indexOf(expo);
}


//Check if nodeId is in the BMX7 originators array
function inBmx7OriginatorsList(nodeId, originators) {
    return originators.map(function(element) {
        return ipv62id(element.primaryIp);
        }).some(function(entry) {
            if (entry == nodeId)
                return true;
    });
}


//Get the index of NodeId in the descriptors array, -1 if not found
function indexBmx7NodeIdDescriptors(nodeId, descriptors) {
	console.log("DESCRIPTORS", descriptors);
    return descriptors.map(function(item) {
    	return JSON.stringify(item).contains(id2ipv6(nodeId));
    }).indexOf(true);
}


//Get the index of nodeId in the originators list, -1 if not found
function indexBmx7Originators(nodeId, originators) {
    return originators.map(function(element) {
        return ipv62id(element.primaryIp);
        }).indexOf(nodeId);
}


//Check if an IPv6 address is in the BMX7 interfaces array
function isIpv6InInterfaces (ipv6, interfaces) {
    return interfaces.some(function(item) {
        if (item.llocalIp.split("/")[0] == ipv6)
            return true;
    });
}

//Get the index of the interface with the IPv6 address in the BMX7 interfaces array
function indexIpv6InInterfaces (ipv6, interfaces) {
    return interfaces.map(function(item) {
    	return item.llocalIp.split("/")[0];
    	}).indexOf(ipv6);
}

//Get the index of the interface named intName  in the BMX7 interfaces array
function indexNameInInterfaces (intName, interfaces) {
    return interfaces.map(function(item) {
    	return item.devName.split("/")[0];
    	}).indexOf(intName);
}

//Get the index of the path to nodeId in the paths list
function indexBmx7Paths(paths, nodeId) {
    return paths.map(function(item) {
        return item.id;
        }).indexOf(nodeId);
}

//Return true if both paths are exactly the same, false otherwise
function sameBmx7Paths(path1, path2) {

	if ( path1.id != path2.id || path1.path.length != path2.path.length )
		return false;

	for (i=0; i < path1.path.length; i++) {
		if (path1.path[i].in.id			!= path2.path[i].in.id ||
			path1.path[i].in.interface	!= path2.path[i].in.interface ||
			path1.path[i].in.ip			!= path2.path[i].in.ip ||
			path1.path[i].out.id		!= path2.path[i].out.id ||
			path1.path[i].out.interface	!= path2.path[i].out.interface ||
			path1.path[i].out.ip		!= path2.path[i].out.ip )

			return false
	}

	return true;
}

//Return true if both paths are exactly the same, false otherwise
function sameTestPaths(path1, path2) {

	if ( path1.length != path2.length )
		return false;

	for (var j=0; j < path1.length; j++) {
		if (path1[j].in.id			!= path2[j].in.id ||
			path1[j].in.interface	!= path2[j].in.interface ||
			path1[j].in.ip			!= path2[j].in.ip ||
			path1[j].out.id			!= path2[j].out.id ||
			path1[j].out.interface	!= path2[j].out.interface ||
			path1[j].out.ip			!= path2[j].out.ip )

			return false
	}

	return true;
}
