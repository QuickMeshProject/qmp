// A file with some routines and utilities useful for the NCui graph.js,
// sorted alphabetically

var DEBUGMODE = true;
var ERRORMODE = true;
var ERROR = 1
var WARNING = 2
var DEBUG = 3
var ubusRetries = 5;
var retryTimeoutms = 1000;
var loopWaitTime = 1000;
var loopsArray = [];
var maxLoopCount = 10;
var MAX_SET_ALGO_RETRIES = 3;
var MAX_GET_DESC_RETRIES = 3;

//Add a link between two nodes in the links array
function addLink(sourceId, targetId) {

    if ( inNodesList(sourceId) )
        if ( inNodesList(targetId) )
            if (!linkExists (sourceId, targetId)) {

                var sourceIndex = indexNode(sourceId), targetIndex = indexNode(targetId);

                if (sourceIndex > -1 && targetIndex > -1 ) {

                    links.push({source: nodes[sourceIndex], target: nodes[targetIndex], strokeWidth: currentThickness + currentZoom*tPerZoom});

                    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
                  link.enter().insert("line", ".node").attr("class", "link");

                  force.start();
                }
            }

            else {
                if (DEBUGMODE)
                    console.log("Function addLink. A link between " + sourceId + " and " + targetId + " already exists");
            }

        else {
            if (DEBUGMODE)
                console.log("Function addLink. Node " + targetId + " is not in nodes list");
        }

    else {
        if (DEBUGMODE)
                console.log("Function addLink. Node " + sourceId + " is not in nodes list");
    }
}


//Add node2 to the list of node1's neighbours
function addNeighbour(node1, node2) {

    //Check if nodes exists
    if ( inNodesList(node1) ) {
        if ( inNodesList(node2) ) {

        var indexNode1 = indexNode(node1), indexNode2 = indexNode(node2);

        //Create the neighbour arrays if not present
        if ( nodes[indexNode1].neighbours == null )
            nodes[indexNode1].neighbours = [];

        //Check if node2 is in the array and, if not, add it
        if ( nodes[indexNode1].neighbours.indexOf(node2) == -1 )
            nodes[indexNode1].neighbours.push(node2);
        }
        else if (DEBUGMODE)
            console.log("Function: addNeighbours. Node " + node2 + " not found.");
    }
    else if (DEBUGMODE)
        console.log("Function: addNeighbours. Node " + node1 + " not found.");
}


//Delete the link between sourceId and targetId (or vice versa) from the links array
function delLink(sourceId, targetId) {

    //Actually remove the link
    if (linkExists(sourceId, targetId)) {

        index = indexLink(sourceId, targetId);

        if (index > -1) {

            links.splice(index, 1);

            link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
      link.exit().remove();

            force.start();
        }
        else if (DEBUGMODE)
                console.log("Function delLink. Link between " + sourceId + " and " + targetId + " is not in links list");
        }
    else {
        if (DEBUGMODE)
            console.log("Function delLink. Link between " + sourceId + " and " + targetId + " does not exist");
    }
}

//Delete an array of links from the links array
function delLinks(linksArray) {

    //For each link in linksArray
    linksArray.forEach( function(element) {
        delLink(element.source, element.target);
    });
}


//Delete all the links between nodeId and other nodes
function delNodeLinks(nodeId) {

    currentLinks = links;

    currentLinks.forEach(function(element,index) {
        if ( element.source.id == nodeId || element.target.id == nodeId )
            delLink(element.source.id, element.target.id);
    });
}


//Delete an array of nodes from the nodes list
function delNodes(nodesArray) {

    nodesArray.forEach( function(element) {
        delNode(element);
    });
}


//Delete nodeId from the nodes list
//TODO: delete the node from the list of remote neighbours
function delNode(nodeId) {

    if (inNodesList(nodeId) ) {

        index = indexNode(nodeId);

        if ( index > -1 ) {
            if ( index > 0 ) {

                //delNodeLinks(nodeId);
                //delNodeFromNeighbours(nodeId);

                nodes.splice(index, 1);

                label = label.data(nodes, function(d) { return d.id;});
              node = node.data(nodes, function(d) { return d.id;});

          node.exit().remove();
          label.exit().remove();

                force.start();
            }
            else if (DEBUGMODE)
                console.log("Function delNode. Node " + nodeId + " (local) can not be deleted");
        }
        else if (DEBUGMODE)
                console.log("Function delNode. Node " + nodeId + " is not in nodes list");
    }
    else if (DEBUGMODE)
        console.log("Function delNode. Node " + nodeId + " is not in nodes list");
}


//Check if node2 is in node1's neighbours list
function hasNeighbour(node1, node2) {
    if ( inNodesList(node1) )
        if ( indexNode(node1) > -1 && nodes[indexNode(node1)].neighbours != null)
            return isInArray( node2, nodes[indexNode(node1)].neighbours);
        else
            return false;
    else if (DEBUGMODE)
            console.log("Function hasNeighbour. Node " + node1 + " is not in nodes list");
    return false;
}


//Get the id of the currently selected node
function idCenterNode() {
    var nodeId = null;

    nodes.some(function(element, index) {
        if ( element.center == true) {
            nodeId = element.id;
            return true;
        }
    });
    return nodeId;
}


//Turn an id into an ipv6
function id2ipv6 (nodeId) {
    return nodeId.replace(/_/g,":");
}


//Get the index of the currently selected node
function indexCenterNode() {
    return indexNode(idCenterNode());
}


//Get the index of nodeId in the nodes array, -1 if not found
function indexNode(nodeId) {
    return nodes.map(function(element) {
      return element.id;
    }).indexOf(nodeId);
}


//Get the index of the link between node1 and node2, -1 if not found
function indexLink(node1, node2) {
    var linkIndex = -1;

    links.some(function(element, index) {
        if ( (element.source.id == node1 && element.target.id == node2 ) || (element.target.id == node1 && element.source.id == node2 ) ) {
            linkIndex = index;
            return true;
        }
    });
    return linkIndex;
}


//Check if nodeId is in the nodes array
function inNodesList(nodeId) {
    return nodes.map(function(element) {
        return element.id;
        }).some(function(entry) {
            if (entry == nodeId)
                return true;
    });
}


//Get the index of node1 in node2's originators array, -1 if not found
function indexOriginator(node1, node2) {
    return nodes[indexNode(node2)].bmx6.originators.map(function(element) {
      return element.primaryIp;
    }).indexOf(id2ipv6(node1));
}


//Turn an ipv6 into an id
function ipv62id (nodeid) {
    return nodeid.replace(/:/g,"_");
}


//Check if an element is in an array
function isInArray (element, array) {
    return array.some(function(item) {
        if (item == element)
            return true;
    });
}


//Check if there is a link between sourceId and targetId exists in the links array
function linkExists(sourceId, targetId) {
    return links.some(function(element) {
        if ( (element.source.id == sourceId && element.target.id == targetId ) || (element.target.id == sourceId && element.source.id == targetId ) )
            return true;
    });
}


//Convert a BMX6 metric value (e.g. 54000K) to a regular number (54000000)
function metric2number(metric) {

    var result = metric;
    var metricLetters = [{"letter":'K', "value":1000}, {"letter":'M', "value":1000000}, {"letter":'G', "value":1000000000}];

    metricLetters.forEach(function(item) {
        if (metric.split(item.letter,1)[0] != metric)
            result=metric.split(item.letter,1)[0]*item.value;
    });
    return result;
}

//Sanitize the lists of links. If a link does not correspond with the nodes' neigbhours declarations, remove it.
function sanitizeLinks() {

    var linksToRemove = [];

    //Check every link
    links.forEach( function (element) {

        //If the neighbourness reference is not reciprocal, add the link to the list of links to remove
        if ( !isInArray(element.target.id, nodes[indexNode(element.source.id)].neighbours )
            || !isInArray(element.source.id, nodes[indexNode(element.target.id)].neighbours ))
                linksToRemove.push({"source": element.source.id, "target": element.target.id});
    });

    //If there are links to remove, proceed
    if ( linksToRemove.length > 0 )
        delLinks( linksToRemove );
}


//Sanitize the lists of nodes. If a node declares having a network but the other does not, remove it.
function sanitizeNodes() {

    var nodesToRemove = [];
    var neighboursToRemove = [];

    //Check every node
    nodes.forEach( function (nodeElement, nodeIndex) {

        //If it has neighbours declared, check all the reciprocal references
        if ( nodeElement.neighbours != null && nodeElement.neighbours.length > 0 ) {

            //For each of the declared neighbours
            nodeElement.neighbours.forEach( function(entry) {

                //If the reciprocal reference is not found...
                if ( !isInArray(nodes[nodeIndex].id,nodes[indexNode(entry)].neighbours) ) {

                    //...save it to later undeclare the neighbourness.
                    neighboursToRemove.push( {"node": nodes[nodeIndex].id, "neighbour": entry} );
                }

            });
        }

        else {
            nodesToRemove.push(nodes[nodeIndex].id);
        }

    });

    //If there are neighbours to remove, proceed
    if ( neighboursToRemove.length > 0 )
        neighboursToRemove.forEach( function (element) {
            nodes[indexNode(element.node)].neighbours.pop(element.neighbour);
        });

    //Now that the neighbours list is sanitized, sanitize the list of links
    sanitizeLinks();

    //Finally, if there are nodes to remove, proceed
    if ( nodesToRemove.length > 0 )
        delNodes( nodesToRemove );

}


//Show all nodes on the graph
function showAllNodes(nodesCount) {

    nodesCount = typeof nodesCount !== 'undefined' ? nodesCount : 0;

    if (nodesCount < nodes.length) {
        addAllNeighbours(nodes[nodesCount].id, true, false)
        showAllNodes(nodesCount+1);
    }

    else {
    console.log("End");}
}


//Sort a nodes list alphabetically and return it
function sortNodesList(nodesList) {
    return nodesList.sort(function (a, b) { return d3.ascending(a.name, b.name); } );
}

//Return a *copy* of the nodes list sorted alphabetically
function sortedNodes() {
	var nnodes = [];
	for (i=0; i < nodes.length; i++)
		nnodes.push(nodes[i]);
	return sortNodesList(nnodes);
}

//Return the list of nodes sorted alphabetically, but putting nodeId in first place
function sortedNodesFirst(nodeId) {

    var allSortedNodes = sortedNodes(), returnNodes = [];

    returnNodes.push(nodes[indexNode(nodeId)]);

    allSortedNodes.forEach ( function (d) {
        if (d.id != nodeId)
            returnNodes.push(d);});

    return returnNodes;
}

//Return the list of node names sorted alphabetically, but putting nodeId in first place
function sortedNodesFirst(nodeId) {

    var allSortedNodes = sortedNodes(), returnNodes = [];

    returnNodes.push(nodes[indexNode(nodeId)]);

    allSortedNodes.forEach ( function (d) {
        if (d.id != nodeId)
            returnNodes.push(d);});

    return returnNodes;
}










function createSelectNodes (selection, id, data) {

    id = typeof id !== 'undefined' ? id : "unnamedSelect";
    data = typeof data !== 'undefined' ? data : nodes;
    onchange = typeof onchange !== 'undefined' ? onchange : "#";

    // Build the dropdown menu
    selection.append("select")
        .attr("id", id)
        .selectAll("option")
        .data(sortedNodes())
        .enter()
        .append("option")
        .attr("value", function(d) {return d.id;})
        .text(function(d) {return d.name;});
}


function createDropdownVector (a, b) {
	var result = [];
	if (typeof a === "number" && typeof b === "number" ) {
		if (b >= a)	{
			while (a < b+1) {
    			result.push({"value":a, "name":a});
    			a++;
			}
		}
		else {
			while (b < a+1) {
    			result.push({"value":b, "name":b});
    			b++;
			}
		}
	}
	return result;
}

function createSelectAlgorithm(selection, id, data) {

    id = typeof id !== 'undefined' ? id : "unnamedSelect";
    data = typeof data !== 'undefined' ? data : [];
    onchange = typeof onchange !== 'undefined' ? onchange : "#";

    // Build the dropdown menu
    selection.append("select")
        .attr("id", id)
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d) {return d.value;})
        .text(function(d) {return d.value + " (" + d.name + ")";});
}


function createSelectNumber (selection, id, data, def, dropdownClass) {

    id = typeof id !== 'undefined' ? id : "unnamedSelect";
    data = typeof data !== 'undefined' ? data : [];
    onchange = typeof onchange !== 'undefined' ? onchange : "#";
    dropdownClass = typeof dropdownClass !== 'undefined' ? dropdownClass : "";

    // Build the dropdown menu
    selection.append("select")
    	.attr("class", dropdownClass)
        .attr("id", id)
        .selectAll("option")
        .data(data)
        .enter()
        .append("option")
        .attr("value", function(d) {return d.value;})
        .text(function(d) {
			if (d.value == def)
				return d.value + " (default)";
			else
        		return d.value;
        });
}


//Return the colour to fill the node with according to its properties
function nodeColour (node) {

    if (node.local && node.center)
        return nodeColourLocalCenter;
    else if (node.local)
        return nodeColourLocal;
    else if (node.center)
        return nodeColourCenter;
    else if (node.selected)
    	return nodeColourSelected;
    else if (node.ncd.active)
        return nodeColourNCD;
    else
        return nodeColourDefault;
}

//Print messages to the console log
function log(category, functionName, message, extra1, extra2, extra3, extra4, extra5) {

	switch(category) {
		case WARNING:
        	console.log ("[WARNING]..." + functionName + ": " + message, extra1, extra2, extra3, extra4, extra5)
        	break;
		case DEBUG:
        	console.log ("[DEBUG]....." + functionName + ": " + message, extra1, extra2, extra3, extra4, extra5)
        	break;
		default:
        	console.log ("[ERROR]....." + functionName + ": " + message, extra1, extra2, extra3, extra4, extra5)
        	break;
	}
}

//Return "asynchronously" if true, "synchronously" if false
function asynchronously(asynchronous) {
	if (asynchronous)
		return "asynchronously";
	return "synchronously";
}

//Convert a BMX6 tun4address to an IPv4 address
function tun4Address2ipAddress (tun4Address) {
	tun4Address = typeof tun4Address !== 'undefined' ? tun4Address : "127.0.0.1";
	return tun4Address.split("/")[0];
}