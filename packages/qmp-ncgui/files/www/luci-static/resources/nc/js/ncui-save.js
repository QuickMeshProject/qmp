function savePath(nodeIdA, nodeIdB, timestamp, saveButton) {

	if (saveButton != undefined)
		d3.select("#"+saveButton).attr("disabled", true).text("Saving...");

	var bmx6Algo = generateBmx6Algo (nodeIdB, true);

	var pathTest = {};
	pathTest.timestamp = timestamp;

	pathTest.algorithm = {};
	pathTest.algorithm.value = bmx6Algo.value;
	pathTest.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   	pathTest.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
	pathTest.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   	pathTest.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

	pathTest.path = nodes[indexNode(nodeIdA)].bmx6.paths[indexBmx6Paths(nodes[indexNode(nodeIdA)].bmx6.paths, nodeIdB)].path;

	if ( tests.paths == undefined)
		tests.paths = [];

	if ( tests.pathtests == undefined)
		tests.pathtests = [];

	tests.pathtests.push(pathTest);

	console.log("SAVE PATHS...........PATH", pathTest);

	if (tests.paths.length == 0 ) {

		console.log("SAVE PATHS...........NO OTHER PATHS", pathTest);

		var newPath = {};

		newPath.path = pathTest.path;
		newPath.cases = [];

		var newCase = {};
		newCase.timestamp = timestamp;
		newCase.algorithm = {};
		newCase.algorithm.value = bmx6Algo.value;
		newCase.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   		newCase.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
		newCase.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   		newCase.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

		console.log("SAVE PATHS...........PUSHING FIRST PATH", pathTest);
		newPath.cases.push(newCase);

		tests.paths.push(newPath);
		console.log("SAVE PATHS...........FIRST PATH PUSHED", tests);
	}

	else {

		var numpaths = tests.paths.length;

		var pathFound = false;

		for (var i=0; i < numpaths; i++) {

			console.log("SAVE PATHS...........OTHER PATHS", pathTest);
			console.log("SAVE PATHS...........CHECKING PATH " + i, pathTest, tests.paths[0]);

			console.log(tests.paths[i].path, pathTest.path);
			console.log(JSON.stringify(tests.paths[i].path), JSON.stringify(pathTest.path));

			if (sameTestPaths( tests.paths[i].path, pathTest.path)) {

				console.log("SAVE PATHS...........SAME PATHS WITH " + i, pathTest, tests.paths[0]);

				var newCase = {};
				newCase.timestamp = timestamp;
				newCase.algorithm = {};
				newCase.algorithm.value = bmx6Algo.value;
				newCase.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   				newCase.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
				newCase.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   				newCase.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

				console.log("SAVING PATH ", i, "ON CASE ", tests.paths[i].cases.length + "+1");

				tests.paths[i].cases.push(newCase);
				i=numpaths;
				pathFound = true;
				break;
			}
		}

		if (!pathFound) {

			console.log("PATH ", i, "NOT THE SAME");

			var newPath = {};

			var newCase = {};
			newCase.timestamp = timestamp;
			newCase.algorithm = {};
			newCase.algorithm.value = bmx6Algo.value;
			newCase.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   			newCase.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
			newCase.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   			newCase.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

			newPath.path = pathTest.path;
			newPath.cases = [];
			newPath.cases.push(newCase);

			tests.paths.push(newPath);

		}
	}

	if (saveButton != undefined)
		d3.select("#"+saveButton).text("Saved");
}

function savePing(nodeIdA, nodeIdB, pingObject, saveButton) {

	if (saveButton != undefined)
		d3.select("#"+saveButton).attr("disabled", true).text("Saving...");

	var bmx6Algo = generateBmx6Algo (nodeIdB, true);

	pingObject.id.algorithm = {};
	pingObject.id.algorithm.value = bmx6Algo.value;
	pingObject.id.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   	pingObject.id.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
	pingObject.id.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   	pingObject.id.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

	if ( tests.pingtests == undefined)
		tests.pingtests = [];

	tests.pingtests.push(pingObject);

	if (saveButton != undefined)
		d3.select("#"+saveButton).text("Saved");
}

function saveBandwidth(nodeIdA, nodeIdB, bandwidthObject, saveButton) {

	if (saveButton != undefined)
		d3.select("#"+saveButton).attr("disabled", true).text("Saving...");

	var bmx6Algo = generateBmx6Algo (nodeIdB, true);

	bandwidthObject.id.algorithm = {};
	bandwidthObject.id.algorithm.value = bmx6Algo.value;
	bandwidthObject.id.algorithm.rxExpNumerator = bmx6Algo.exponents[0].value;
   	bandwidthObject.id.algorithm.rxExpDivisor = bmx6Algo.exponents[1].value;
	bandwidthObject.id.algorithm.txExpNumerator = bmx6Algo.exponents[2].value;
   	bandwidthObject.id.algorithm.txExpDivisor = bmx6Algo.exponents[3].value;

	if ( tests.bandwidthtests == undefined)
		tests.bandwidthtests = [];

	tests.bandwidthtests.push(bandwidthObject);

	if (saveButton != undefined)
		d3.select("#"+saveButton).text("Saved");
}