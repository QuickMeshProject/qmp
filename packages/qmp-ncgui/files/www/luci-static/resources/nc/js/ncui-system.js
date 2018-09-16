// A file with some system-specific Ubus requests for the NCui

//Request via Ubus the NCD daemon version
function getNCDVersion(nodeId, refresh, asynchronous, thenSystemBoard)
{
	refresh = typeof refresh !== 'undefined' ? refresh : false;
    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
    thenSystemBoard = typeof thenSystemBoard !== 'undefined' ? thenSystemBoard : false;
    var debug = arguments;

	console.log("Function " + debug.callee.name + " called.", nodeId, asynchronous);

	//Get the index of the node
	var n = indexNode(nodeId);

	//Check if the node is in the nodes list (if #1)
	if ( n > -1 ) {

		console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

		//Check if the node has the NCD daemon
        if ( n > -1 && nodes[n].ncd.active ) {

			console.debug("In function " + debug.callee.name + ". Node " + nodeId + " has the NCD daemon active.");

			console.debug("In function " + debug.callee.name + ". Calling Ubus ncd_version for node " + nodeId + ".");



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
						nodes[indexNode(nodeId)].ncd.active = true;
						onWindowResize();
					}
				},

				error: function(data) {
					nodes[indexNode(nodeId)].ncd.active = false;
					nodes[indexNode(nodeId)].ncd.error = UBUSERROR_NCDVERSION;
					console.error("In function " + debug.callee.name + ". Ubus ncd_version request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						console.error("In function " + debug.callee.name + ". Ubus ncd_version request for " + nodeId + " returned an error:", data, "Retrying...");
						$.ajax(this);
					}
				},
				complete: function(data) {
					if (thenSystemBoard) {
						updateSystemBoard(nodeId, true, true);
					}
				}
			});
		}

		//else (if #2)
		else {
			console.warn("In function " + debug.callee.name + ". Node " + nodeId + " has the NCD daemon disabled");
		}
	}
	//else (if #1)
	else {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list");
	}
}

function minVersion (nodeVersion, reqVersion){
	nodeVersion = typeof nodeVersion !== 'undefined' ? nodeVersion : -1;
	reqVersion  = typeof reqVersion  !== 'undefined' ? reqVersion  : -1;
	debugVar = arguments;

	console.log("Function: " + arguments.callee.name + " called. nodeVersion: " + nodeVersion + ". reqVersion: " + reqVersion);

	if ( nodeVersion != -1 && reqVersion != -1 ){
		nodeVersionArray = nodeVersion.split(".");
		reqVersionArray  = reqVersion.split(".");


		if ( nodeVersionArray.length > 0 && reqVersionArray.length > 0 ) {

			for (var i = 0; i < nodeVersionArray.length; i++) {
    			if ( !Number.isInteger(parseInt(nodeVersionArray[i]))) {
					console.warn("In function " + arguments.callee.name + ". Wrong format in nodeVersion field " + i + ": " + nodeVersionArray[i]);
					return false;
    			}
			}

			for (var i = 0; i < reqVersionArray.length; i++) {
    			if ( !Number.isInteger(parseInt(reqVersionArray[i]))) {
					console.warn("In function " + arguments.callee.name + ". Wrong format in reqVersion field " + i + ": " + reqVersionArray[i]);
					return false;
    			}
			}

			for (var i=0; i<Math.min(nodeVersionArray.length, reqVersionArray.length); i++ ) {
				if ( parseInt(nodeVersionArray[i]) > parseInt(reqVersionArray[i]) )
					return true;
				else if ( parseInt(nodeVersionArray[i]) < parseInt(reqVersionArray[i]) )
					return false;
			}

			if (nodeVersionArray.length == reqVersionArray.length)
				return true;


			if (nodeVersionArray.length >= reqVersionArray.length)
				return true;

			else
				return false;

		}

		else {
			console.warn("In function: " + arguments.callee.name + ". Version values could not be parsed");
			return false;
		}

	}

	else {
		console.warn("In function: " + arguments.callee.name + ". One of the arguments missing (nodeVersion: " + nodeVersion + ", reqVersion: " + reqVersion);
		return false;
	}
}

//TODO
function ncdError() {
	console.log("error");
}

//Request, via Ubus, the system.info information of a node
function updateSystemInfo(nodeId, asynchronous)
{
    asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : true;
    var debug = arguments;

    //Get the index of the node in the nodes list
    var nodeIndex = indexNode(nodeId);

    if (DEBUGMODE)
        console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " . Index: " + nodeIndex);

    //Check if the node is actually in the nodes list (if #1)
    if (nodeIndex > -1 && nodes[nodeIndex].ncd.active) {

        //If not present, create an empty object to store system data objects
        if ( nodes[nodeIndex].system == null )
            nodes[nodeIndex].system = {};

        //A small change in case it is the local node, otherwise lunced call fails
        //TODO: Fix lunced
        if (nodes[nodeIndex].local)
            nodeId = "local"

        var scriptUrl = "../nc/system_info/?nodeid=" + nodeId;

        $.ajax({
            url: scriptUrl,
            type: 'get',
            dataType: 'json',
            async: asynchronous,

            success: function(data) {
                //Check if the returned data is null (if #2)
                if (data == null){
                    if (DEBUGMODE)
                        console.log("Function: " + arguments.callee.name + ". Ubus returned null.");
                }
                //(if #2) returned data is
                else {
                    if (DEBUGMODE)
                        console.log("Function: " + arguments.callee.name + ". Ubus response: ", data);
                            nodes[nodeIndex].system.info = data;

                     }
            },

            error: function(data) {
				console.error("In function " + debug.callee.name + ". Ubus bmx6_system_info request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
            }
        });
    }

    //(if #1) the node is not in the nodes list
    else {
        if (DEBUGMODE) {
            console.log("Function: " + arguments.callee.name + ". Node " + nodeId + " is not in the nodes list.");
        }
    }
}


function updateSystemBoard(nodeId, asynchronous, thenBMX6Status)
{
	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	thenBMX6Status = typeof thenBMX6Status !== 'undefined' ? thenBMX6Status : false;
	var debug = arguments;

	console.log("Function " + debug.callee.name + " called.", nodeId, asynchronous, thenBMX6Status);

    //Get the index of the node in the nodes list
    var n = indexNode(nodeId);

    //Check if the node is actually in the nodes list (if #1)
    if (n > -1 ) {
    	//Check if the node has NCD
    	if(nodes[n].ncd.active) {

			console.debug("In function " + debug.callee.name + ". Node " + nodeId + " is in the nodes list (index = " + n + " ).");

			//A small change in case it is the local node, otherwise lunced call fails
	        //TODO: Fix lunced
	        if (nodes[n].local)
	            nodeId = "local"

			//This is the only function that calls Ubus without checking for NCD to be active on the node
			console.debug("In function " + debug.callee.name + ". Calling Ubus system_board for node " + nodeId + ".");

	        var scriptUrl = "../nc/system_board/?nodeid=" + nodeId;

	        $.ajax({
	            url: scriptUrl,
	            type: 'get',
	            dataType: 'json',
	            async: asynchronous,

	            success: function(data) {

	                if (data == null) {
						console.warn("In function " + debug.callee.name + ". Ubus system_board call for node " + nodeId + " returned null.");
	                }

	                else if (data.error != undefined) {
	                	console.warn("In function " + debug.callee.name + ". Ubus system_board call for node " + nodeId + " returned error " + data.error +":", data);
	                	console.warn("In function " + debug.callee.name + ". Marking NCD for node " + nodeId + " as inactive.");
	                	nodes[n].ncd.active = false;
					}
					else {
						console.debug("In function " + arguments.callee.name + ". Saving system.board data to node " + nodeId + ":", data);
						console.debug("In function " + debug.callee.name + ". Marking NCD for node " + nodeId + " as active.");
						//console.log("In function " + debug.callee.name + ". Calling getNCDversion for node " + nodeId + " asynchronously.");
						console.log("In function " + debug.callee.name + ". Calling updateName for node " + nodeId + ".");
						if (nodes[n].system == undefined)
							nodes[n].system = {};
						nodes[n].system.board = data;
						nodes[n].ncd.active = true;
						onWindowResize();
						updateName(nodeId);
					}
	            },

	            error: function(data) {
					console.error("In function " + debug.callee.name + ". Ubus system_board request for " + nodeId + " returned an error:", data, "Try count: " + this.tryCount);
					nodes[n].ncd.active = false;
					this.tryCount++;
					if (this.tryCount <= this.retryLimit) {
						this.timeout = ajaxTimeout + this.tryCount*ajaxTimeoutAdd;
						$.ajax(this);
					}
	            },

				complete: function(data) {
				}
			});
		}

		else if (thenBMX6Status) {
			bmx6Status(nodeId,true);
        }
    }

    //(if #1) the node is not in the nodes list
    else {
        if (DEBUGMODE) {
		console.warn("In function " + debug.callee.name + ". Node " + nodeId + " is not in the nodes list.");

		if (thenBMX6Status)
			bmx6Status(nodeId,true);
        }
    }
}
