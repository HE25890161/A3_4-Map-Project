class Graph {
    // graph members:
    constructor(id, nodes){
        this.ID = id | 0;          // graph ID
        if (nodes == null){
            this.Nodes = [];
        }
        else{
            this.Nodes = nodes;
        }
        // graph nodes
    }

    // extracts node data from json and stores in the nodes list
    // expects Graph json object
    populateGraphFromJSON(jsonobject){
        this.ID = jsonobject.ID;
        const nodeObjectData = jsonobject.Nodes;
        for (let i = 0; i < nodeObjectData.length; i++){
            const myNode = new Node(nodeObjectData[i].Value, nodeObjectData[i].Connections, nodeObjectData[i].Weights);
            myNode.RelativePositionX = nodeObjectData[i].RelativePositionX;
            myNode.RelativePositionY = nodeObjectData[i].RelativePositionY;
            myNode.ID = i;
            this.Nodes.push(myNode);
        }
        
    }

    // adds a new node to the list
    // expects  value (any)
    //          connections (int list)
    //          weights (int list)
    addNode(value, connections, weights){
        this.Nodes.push(new Node(value, connections, weights));
        console.log("added new node");
    }

    // validates node index
    // expects integer in nodeIndex
    // returns false if index out of range
    // returns true if in range
    validateNodeIndex(nodeIndex){
        // check upper boundary
        if (nodeIndex >= this.Nodes.length){
            console.log("nodeIndex out of high range");
            return false;
        }
        // check lower boundary
        else if (nodeIndex < 0){
            console.log("nodeIndex out of low range");
            return false;
        }

        //otherwise return true as node is in range
        return true;
    }

    // finds index of node object
    // expects node object in node
    // returns integer of node index in Nodes list
    // if node not found, returns -1;
    getIndexOfNode(node){
        for (let i = 0; i < this.Nodes.length; i++){
            if (this.Nodes[i].ID == node.ID){
                return i;
            }
        }
        return -1;
    }

    // prints all connections from a given node
    // expects integer index of node in nodeIndex
    // displays node connections their respective node values
    printConnections(nodeIndex){
        // call nodeindex validation subroutine
        if (!this.validateNodeIndex(nodeIndex)){
            // if returns false, exit function
            return;
        }
        
        // get node from nodeindex:
        const chosenNode = this.Nodes[nodeIndex];

        // display node in console
        console.log("Node " + nodeIndex + " (" + chosenNode.Value + ") connects to:\n");
        
        // iterate through node's connections and print their node values
        for (let i = 0; i < chosenNode.Connections.length; i++){
            let edge = chosenNode.Connections[i];
            console.log(i + "\t:\tNode '" + this.Nodes[edge].Value + "'");
        }
    }

    // retrieves all connections from a node
    // expects integer index of node in nodeIndex
    // returns a list of nodes
    getConnections(nodeIndex){
        // call nodeindex validation subroutine
        if (!this.validateNodeIndex(nodeIndex)){
            // if returns false, exit function
            return;
        }

        // get node from nodeindex
        const chosenNode = this.Nodes[nodeIndex];

        // return connections
        return chosenNode.Connections;
    }

    // retrieves weights from a node connection
    // expects integer node indexes
    // returns integer weight
    // returns two if two different weights
    getWeightBetweenNodes(nodeIndexA, nodeIndexB){
        // check if indexes are valid
        if (!this.validateNodeIndex(nodeIndexA)){
            return [];  // if invalid, return empty
        }
        if (!this.validateNodeIndex(nodeIndexB)){
            return []; // if invalid, return empty
        }

        // otherswise find weight:
        // extract nodes
        let nodeA = this.Nodes[nodeIndexA];
        let nodeB = this.Nodes[nodeIndexB];

        // check if nodes are connected
        if (!nodeA.connectionsContains(nodeIndexB)){
            return [];  // if not connected, return empty
        }
        // best to check both ways, just in case:
        if (!nodeB.connectionsContains(nodeIndexA)){
            return [];  // if not connected, return empty
        }
        
        // retrieve indexes to nodes' internal connections lists
        let nodeAindexToB = nodeA.getConnectionIndex(nodeIndexB);
        let nodeBindexToA = nodeB.getConnectionIndex(nodeIndexA);

        // retrieve nodes
        let nodeABweight = nodeA.Weights[nodeAindexToB];
        let nodeBAweight = nodeB.Weights[nodeBindexToA];

        // if weights are equal, return one only
        if (nodeABweight == nodeBAweight){
            return [nodeABweight];
        }

        // otherwise return two weights
        return [nodeABweight, nodeBAweight];
    }

    // positions nodes in a grid ready for display
    // use if nodes not yet initialised with relative positions
    // expects floats in spacingX, spacingY
    // expects integers in width, height
    // spacingX and Y is how far apart nodes should appear
    // width and height is canvas borders, will cause nodes to wrap
    setupNodesForDisplay(spacingX, spacingY, width, height){
        // space initial x and y from the edge of the canvas
        let currentX = spacingX / 2;
        let currentY = spacingY / 2;
        console.log(width);
        console.log(height);
        console.log("(setup nodes for display) # of nodes: " + this.Nodes.length);

        // loop through nodes:
        for (let nodeIndex = 0; nodeIndex < this.Nodes.length; nodeIndex++){
            // extract current node:
            let currentNode = this.Nodes[nodeIndex];
            console.log("(setup nodes for display) currentNode: " + currentNode.Value);

            // set current node relative display position
            currentNode.setRelativeDisplayPosition(currentX, currentY);
            
            // increment x position
            currentX += spacingX;

            // check with x boundary
            if (currentX >= width){
                // if greater, set x to initial edge value
                currentX = spacingX / 2;

                // increment Y by spacing
                currentY += spacingY;

                // check y boundary
                if (currentY >= height){
                    // if y is greater than boundary, need to reset
                    // so stagger nodes in between first
                    currentX = (spacingX / 1.5) * 1.5;
                    currentY = (spacingY / 2) * 1.5;
                }
            }
        }
    }

    // searches a list for an array of items
    // because referencing causes array.include() to always return false for lists
    // expects a list to search in listToSearch
    // expects an array to find in arrayToFind
    // returns true if arrayToFound is in list
    // returns false if not
    searchList(listToSearch, arrayToFind){
        for (let l = 0; l < listToSearch.length; l++){
            const listItem = listToSearch[l];
            let found = true;
            for (let a = 0; a < arrayToFind.length; a++){
                if (listItem[a] != arrayToFind[a]){
                    found = false;
                }
            }
            if (found){
                return true;
            }
        }
    }

    // displays the graph - nodes and edges in a canvas
    // expects canvasID string of html canvas to draw in
    //         nodeRadius int for visual radius of nodes
    //         fontName string for font to display node value
    //         fontSize int for font size in pixels for node value
    //         fontColour string for font colour
    //         fillColour string for colour to fill nodes with
    //         scale float for scale to draw connections at
    // returns nothing, outputs visual graph in canvas of canvasID
    displayGraph(canvasID, nodeRadius, fontName, fontSize, fillColour, fontColour, scale){
        const canvas = document.getElementById(canvasID);       // get canvas from ID
        const ctx = canvas.getContext("2d");                    // create context
        ctx.font = fontSize + "px " + fontName;                 // set up context font

        const visitedWeights = [];

        // iterate through and draw edge connections
        for (let n = 0; n < this.Nodes.length; n++){
            // get current node from list, and calculate position:
            let currentNode = this.Nodes[n];
            console.log("(displaying) current node: " + currentNode.Value);
            let currentNodeX = (currentNode.RelativePositionX + (nodeRadius / 2)) * scale;
            let currentNodeY = (currentNode.RelativePositionY + (nodeRadius / 2)) * scale;     
           
            let currentNodeConnections = currentNode.Connections;   // get that node's list of connections

            // iterate through connections and draw lines
            for (let c = 0; c < currentNodeConnections.length; c++){
                let currentConnection = currentNodeConnections[c];  // get individual connection
                let connectedNode = this.Nodes[currentConnection];  // get node which is indexed from this connection

                // seperating condition terms into two is easier to visualise:
                const bs1 = this.searchList(visitedWeights, [currentNode.ID, connectedNode.ID]);
                const bs2 = this.searchList(visitedWeights, [connectedNode.ID, currentNode.ID]);
                const condition = !bs1 && !bs2;
                
                if (condition){
                    // get connected node position:
                    let connectedNodeX = (connectedNode.RelativePositionX + (nodeRadius / 2)) * scale;
                    let connectedNodeY = (connectedNode.RelativePositionY + (nodeRadius / 2)) * scale;

                    ctx.strokeStyle = "black";

                    // begin drawing line stroke path
                    ctx.beginPath();
                    ctx.moveTo(currentNodeX, currentNodeY);     // move to start node X and Y
                    ctx.lineTo(connectedNodeX, connectedNodeY); // draw line to end X and Y
                    
                    // draw path:
                    ctx.stroke();

                    // now draw weights in middle of line
                    let weightText;
                    let currentWeight = this.getWeightBetweenNodes(this.getIndexOfNode(currentNode), this.getIndexOfNode(connectedNode));
                    weightText = currentNode.Value + "-" + connectedNode.Value + ": " + currentWeight[0]
                    if (currentWeight.length == 2){
                        weightText = weightText + "\n" + connectedNode.Value + "-" + currentNode.Value + ": " + currentWeight[1];
                    }
                    let halfX = currentNodeX + ((connectedNodeX - currentNodeX) / 2);
                    let halfY = currentNodeY + ((connectedNodeY - currentNodeY) / 2);
                    halfX = halfX - ((weightText.length * fontSize) / 4);

                    ctx.strokeStyle = "white";
                    ctx.lineWidth = (fontSize / 10) + 1;
                    ctx.strokeText(weightText, halfX, halfY);
                    ctx.lineWidth = 1;
                    ctx.fillStyle = fontColour;
                    ctx.fillText(weightText, halfX, halfY);

                    // end path
                    ctx.closePath();
                }

                visitedWeights.push([currentNode.ID, connectedNode.ID]);
            }
        }

        // iterate through, and draw all the nodes
        for (let n = 0; n < this.Nodes.length; n++){
            let currentNode = this.Nodes[n];    // get node from list

            // extract node attributes:
            let nodeX = (currentNode.RelativePositionX + (nodeRadius / 2)) * scale;
            let nodeY = (currentNode.RelativePositionY + (nodeRadius / 2)) * scale;
            let nodeV = currentNode.Value;

            // set fill colour
            ctx.fillStyle = fillColour;
            ctx.strokeStyle = "black";
            // begin drawing node circles using paths
            ctx.beginPath();
            // X, Y, Radius, Start Angle, End Angle
            ctx.arc(nodeX, nodeY, nodeRadius, 0 * Math.PI, 2 * Math.PI);
            // draw path on screen
            ctx.stroke();
            // finish path
            ctx.fill();
            
            //set font colour
            ctx.fillStyle = fontColour;
            // draw text inside nodes, align to centre using maths 
            ctx.fillText(nodeV, nodeX - ((nodeV.length * fontSize) / 4), nodeY + (fontSize / 3));
        }
    }

    // need to remove priority queue and just use normal stuff because this doesn't work.
    djikstraTraverse(sourceNodeIndex){
        let V = this.Nodes.length;

        let distance = new Array(V);
        let previous = new Array(V);
        let Q = [];

        // INITIALIZE
        for (let n = 0; n < V; n++){
            distance[n] = Number.MAX_SAFE_INTEGER;
            previous[n] = undefined;
            Q.push(n);
        }

        // Correctly set source distance
        distance[sourceNodeIndex] = 0;

        // MAIN LOOP
        while (Q.length > 0){

            // Find node in Q with smallest distance
            let u = Q[0];
            let smallestDist = distance[u];
            let indexToRemove = 0;

            for (let i = 1; i < Q.length; i++){
                let nodeIndex = Q[i];
                if (distance[nodeIndex] < smallestDist){
                    smallestDist = distance[nodeIndex];
                    u = nodeIndex;
                    indexToRemove = i;
                }
            }

            // Remove u from Q
            Q.splice(indexToRemove, 1);

            // Relax edges
            const conns = this.getConnections(u);
            for (let vc = 0; vc < conns.length; vc++){
                let v = conns[vc];
                let weight = this.getWeightBetweenNodes(u, v)[0];
                let alt = distance[u] + weight;

                if (alt < distance[v]){
                    distance[v] = alt;
                    previous[v] = u;
                }
            }
        }

        return [distance, previous];
    }
    
}

class Node {
    // node has these members:
    // value : string/int/ any datatype
    // connections: list of integers
    // weights: list of integers
    // relativepositionx: float storing X where the node could be displayed on a page
    // relativepositiony: float storing Y where the node could be displayed on a page
    constructor(value, connections, weights, id){
        this.Value = value,
        this.Connections = connections,
        this.Weights = weights
        this.RelativePositionX = 0;
        this.RelativePositionY = 0;
        this.ID = id;
    }

    // sets the node's relative position data
    // expects floats in relativePosX and relativePosY
    setRelativeDisplayPosition(relativePosX, relativePosY){
        this.RelativePositionX = relativePosX;
        this.RelativePositionY = relativePosY;
    }

    // prints node value
    printValue(){
        console.log(this.Value);
    }

    // searches connections and returns an index
    // expects integer node index in nodeIndexToFind
    // returns integer where nodeIndexToFind is found in connections
    // returns -1 if not in connections
    getConnectionIndex(nodeIndexToFind){
        for (let i = 0; i < this.Connections.length; i++){
            if (this.Connections[i] == nodeIndexToFind){
                return i;
            }
        }
        return -1;
    }

    // searches connections for node
    // expects integer node index in nodeIndexToFind
    // returns true if connections contains node index
    // returns false if not
    connectionsContains(nodeIndexToFind){
        for (let i = 0; i < this.Connections.length; i++){
            if (this.Connections[i] == nodeIndexToFind){
                return true;
            }
        }
        return false;
    }
}

// gets a path to a node using output arrays from djikstra traversal
// expects previous array and a goal node index in goalIndex
// returns a list of nodes to traverse
function getPath(previous, goalIndex) {
    let path = [];
    let current = goalIndex;

    while (current !== undefined) {
        path.push(current);
        current = previous[current];
    }

    return path.reverse();
}

// wrapper function for finding a path with the djikstra algorithm.
// expects populated Grap object in graph,
//         index of start node in startNodeIndex
//         index of goal node in goalNodeIndex
function findRoute(graph, startNodeIndex, goalNodeIndex){
    let [distance, previous] = graph.djikstraTraverse(startNodeIndex);
    let path = getPath(previous, goalNodeIndex);
    return { path, cost: distance[goalNodeIndex] };
}

// loads graph data from given url once data has been loaded.
// async allows clean loading and causes other code to wait until correct data retrieved.
async function gatherGraphData(url){
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error("(gather graph data) HTTP error! Status: ${response.status}");
        }

        const data = await response.json();

        console.log("(gather graph data) json data: ", data);
        const jsonob = JSON.parse(JSON.stringify(data));
        return jsonob;
    }
    catch (error){
        console.error("(gather graph data) Error fetching / parsing JSON:", error);
    }
}

// main program
async function main() {
    const foundCanvas = document.getElementById("mapCanvas");

    const url = "https://he25890161.github.io/A3_4-Map-Project/graphData.json";

    const myGraph = new Graph(); 
    const dat = await gatherGraphData(url);
    myGraph.populateGraphFromJSON(dat);

    console.log("(main) graph:", myGraph);
    myGraph.displayGraph(foundCanvas.id, 10, "Monospace", 20, "white", "black", 6);

    console.log("thingy:", findRoute(myGraph, 0, 3));
}

window.onload = main();
