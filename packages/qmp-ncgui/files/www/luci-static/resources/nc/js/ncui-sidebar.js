var categories = [  {"id": "system", "name": "Node",
                    "subcategories":   [{"id": "board", "name": "Board", "functn": sidebarSystemBoard},
                                        {"id": "info", "name": "Info", "functn": sidebarSystemInfo},
                                        {"id": "network", "name": "Network", "functn": sidebarSystemNetwork}] },
                    {"id": "mesh", "name": "Network",
                    "subcategories":   [{"id": "neighbours", "name": "Neighbours", "functn": sidebarMeshNeighbours},
                    					{"id": "gateways", "name": "Gateways", "functn": sidebarMeshAllNodes},
                                   		{"id": "allnodes", "name": "Add neighbours", "functn": sidebarMeshAllNodes},
                                        {"id": "allbmx6", "name": "Load all BMX6 info", "functn": sidebarMeshAllBmx6},
                                        {"id": "paintlinks", "name": "Load available links info", "functn": sidebarMeshPaintLinks},
                                        {"id": "paintalllinks", "name": "Load all links info", "functn": sidebarMeshPaintAllLinks}] },
                    {"id": "bmx6", "name": "BMX6",
                     "subcategories":  [{"id": "status", "name": "Status", "functn": sidebarBmx6Status},
                                        {"id": "interfaces", "name": "Interfaces", "functn": sidebarBmx6Interfaces},
                                        {"id": "links", "name": "Links", "functn": sidebarBmx6Links},
                                        {"id": "originators", "name": "Originators", "functn": sidebarBmx6Originators},
                                        {"id": "paths", "name": "Paths", "functn": sidebarBmx6Paths},
                                        {"id": "algorithm", "name": "Algorithm", "functn": sidebarBmx6Algorithm},
                                        {"id": "evaluation", "name": "Algorithms evaluation", "functn": sidebarBmx6Evaluation},
                                        {"id": "metrics", "name": "Metrics (table)", "functn": sidebarBmx6Metrics},
                                        {"id": "matrix", "name": "Metrics (matrix)", "functn": sidebarBmx6Matrix}] },
                     {"id": "experimentation", "name": "Experimentation",
                     "subcategories":  [{"id": "testing", "name": "Network testing", "functn": testingMain}] }];



//Replace the sidebar title space with the content provided
function updateSidebarTitle(content) {
    d3.select('#sidebarTitle').selectAll("h3").remove();
    d3.select('#sidebarTitle').append("h3").text(content);
}

//Replace the sidebar content space with the content provided
function updateSidebarContent(category, subcategory, nodeId, refresh) {

    refresh = typeof refresh !== 'undefined' ? refresh : true;

    emptySidebarContent();
    appendSidebarContent(category, subcategory, nodeId, refresh);
}

//Append the content provided to the sidebar category space
function appendSidebarCategory(category, nodeId, content) {

    if (!d3.select("ul#sidebarCategory").selectAll("li").size()) {
        d3.select('ul#sidebarCategory')
            .append("li")
            .attr("class", "active")
            .attr("id", category)
            .attr("onclick", generateCategoryOnclick(category,nodeId))
            .attr("href", "javascript:void(0);")
            .html(content);
    }

    else {
        d3.select('ul#sidebarCategory')
            .append("li")
            .attr("id", category)
            .attr("onclick", generateCategoryOnclick(category,nodeId))
            .attr("href", "javascript:void(0);")
            .html(content);
    }
}


//Append the content provided to the sidebar category space
function appendSidebarCategoryDropdown(category, nodeId, content) {

    //Create the button
    var bg = d3.select("#dropdownDiv")
                .append("div")
                .attr("class", "btn-group");

    var bt = bg.append("button")
               .attr("type", "button")
               .attr("class", "btn bnt-default dropdown-toggle")
               .attr("data-toggle", "dropdown")
               .append("text")
               .text(content);

    var ul = bg.append("ul")
               .attr("class", "dropdown-menu")
               .attr("style", "top: 68px")
               .attr("role", "menu");

    //Add the subcategories
    var index = indexCategory(category);

    categories[index].subcategories.forEach( function(d) {
        ul.append("li")
          .append("a")
          .attr("onclick", generateSubcategoryOnclick(category, d.id, nodeId))
          .attr("href", "javascript:void(0);")
          .text(d.name);

        });

}



//Append the content provided to the sidebar category space
function appendSidebarSubcategory(category, subcategory, nodeId, content) {

    if (!d3.select("ul#sidebarSubcategory").selectAll("li").size()) {
        d3.select('ul#sidebarSubcategory')
            .append("li")
            .attr("class", "active")
            .attr("id", subcategory)
            .attr("onclick", generateSubcategoryOnclick(category, subcategory, nodeId))
            .attr("href", "javascript:void(0);")
            .html(content);
    }

    else {
        d3.select('ul#sidebarSubcategory')
            .append("li")
            .attr("id", subcategory)
            .attr("onclick", generateSubcategoryOnclick(category, subcategory, nodeId))
            .attr("href", "javascript:void(0);")
            .html(content);
    }
}




function generateCategoryOnclick(category, nodeId) {
    return ('categoryClick("'+category+'","'+nodeId+'")');
}


function generateSubcategoryOnclick(category,subcategory,nodeId) {
    return 'subcategoryClick("'+category+'","'+subcategory+'","'+nodeId+'")';
}


function categoryClick(category, nodeId) {

    category = typeof category !== 'undefined' ? category : categories[0].id;

    d3.select('ul#sidebarCategory').selectAll("li").classed("active", false);
    d3.select('ul#sidebarCategory').selectAll("li"+"#"+category).classed("active", true)

    if (categoryExists(category)) {

        index = indexCategory(category);

        //Empty the subcategory space
        emptySidebarSubcategory();

        //Add the subcategories of the category
        categories[index].subcategories.forEach(function(element) {
        appendSidebarSubcategory(category, element.id, nodeId, element.name);});
    }
}


function subcategoryClick(category, subcategory, nodeId) {

    category = typeof category !== 'undefined' ? category : categories[0].id;
    subcategory = typeof subcategory !== 'undefined' ? subcategory : categories[indexCategory(category)].subcategories[0].id;


    d3.select('ul#sidebarSubcategory').selectAll("li").classed("active", false);
    d3.select('ul#sidebarSubcategory').selectAll("li"+"#"+subcategory).classed("active", true)
    updateSidebarContent(category, subcategory, nodeId);
}


//Empty the sidebar menu space
function emptySidebarMenu() {
    d3.select("#sidebarMenu").selectAll("div").remove();
    d3.select("#sidebarMenu").append("div").attr("id", "dropdownDiv");

    //d3.select("#sidebarMenu").append("ul").attr("class", "nav nav-tabs sidebarsubcategory").attr("role", "tablist").attr("id", "sidebarSubcategory");
}

//Empty the sidebar menu space
function emptySidebarSubcategory() {
    d3.select('ul#sidebarSubcategory').selectAll("*").remove();

    d3.select("#sidebarMenu").append("ul").attr("class", "nav nav-tabs").attr("role", "tablist").attr("id", "sidebarSubcategory");
}


//Empty the sidebar content space
function emptySidebarContent() {
    d3.select('#sidebarContent').selectAll("*").remove();
}

//Refresh the whole sidebar adding all the sections available for the node (i.e. on node select change)
function refreshSidebar(nodeId) {

    nodeId = typeof nodeId !== 'undefined' ? nodeId : idCenterNode();

    //Get the index of the current center node
    var nodeIndex = indexNode(nodeId);

    if (nodeIndex > -1) {

        //Update the title
        updateSidebarTitle(nodes[nodeIndex].name);

        //Empty the category, subcategory and content spaces
        emptySidebarMenu();
        emptySidebarContent();

        //Add the available categories
        categories.forEach(function(element) {
        appendSidebarCategoryDropdown(element.id, nodeId, element.name);});

        //Add the available categories
        //categories.forEach(function(element) {
        //appendSidebarCategory(element.id, nodeId, element.name);});

        //Add the subcategories of the first category
        //categories[0].subcategories.forEach(function(element) {
        //appendSidebarSubcategory(categories[0].id, element.id, nodeId, element.name);});

        //Add the content for the first subcategory of the first category
        updateSidebarContent(categories[0].id, categories[0].subcategories[0].id, nodeId);
    }
}


function appendSidebarContent (category, subcategory, nodeId, refresh) {

	refresh = typeof refresh !== 'undefined' ? refresh : true;
	category = typeof category !== 'undefined' ? category : categories[0].id;
	subcategory = typeof subcategory !== 'undefined' ? subcategory : categories[0].subcategories[0].id;

	if (categoryExists(category) && subcategoryExists(category, subcategory))
		categories[indexCategory(category)].subcategories[indexSubcategory(category, subcategory)].functn(nodeId, refresh);
}


//Get the index of the category in the categories array, -1 if not found
function indexCategory(category) {
    return categories.map(function(element) {
      return element.id;
    }).indexOf(category);
}

//Get the index of the subcategory in the subcategories array of the category, -1 if not found
function indexSubcategory(category, subcategory) {
    if (categoryExists(category)) {
        return categories[indexCategory(category)].subcategories.map(function(element) {
            return element.id;
        }).indexOf(subcategory);
    }
    return -1;
}

//Check if the category exists
function categoryExists(category) {
    if (indexCategory(category) > -1 )
        return true;
    return false;
}

//Check if the subcategory exists in the category
function subcategoryExists(category, subcategory) {
    if ( indexSubcategory(category, subcategory) > -1)
        return true;
    return false;
}

//Capitalize the first letter of a string
function capitalizeFirstLetter(toCapitalize) {
    return toCapitalize.substr(0, 1).toUpperCase() + toCapitalize.substr(1);
}

//Capitalize the first letter of every word of a string
function titleCase(toCapitalize)
{
    return toCapitalize.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}