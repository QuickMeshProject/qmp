//A file containing functions no longer in use, just in case they are needed back later on

//Update the label of nodeId
function updateLabel(nodeId, asynchronous) {

	asynchronous = typeof asynchronous !== 'undefined' ? asynchronous : false;
	debug = arguments;

	console.log("Function " + debug.callee.name + " called");

var n = indexNode(nodeId);

	//Check if nodeId is in the nodes list (if #1)
	if ( n > -1 ) {

		console.debug("In function " + arguments.callee.name + ". Node: " + nodeId + " is in the nodes list.");

		//Update, synchronously, the systemBoard info
		updateName(nodeId);

		//Check if nodeId is still in the nodes list (if #2)
		if ( n > -1 ) {
			if (DEBUGMODE)
				console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is still in the nodes list");

			//Update the graph
			updateLabels();

		}
		//(if #2) nodeId is no longer in the nodes list
		else {
			if (DEBUGMODE)
				console.log("Function: " + arguments.callee.name + ". nodeId: " + nodeId + " is not in the nodes list");
		}
	}
	//(if #1)
	else {
		console.warn("In function " + arguments.callee.name + ". Node: " + nodeId + " is not in the nodes list.");
	}
}
