class Graph {
    // graph members:
    constructor(id, nodes){
        this.ID = id,           // graph ID
        this.Nodes = nodes      // graph nodes
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

        // check if nodes are connected
        if (!nodeA.connectionsContains(nodeIndexB)){
            return [];  // if not connected, return empty
        }
        // best to check both ways, just in case:
        if (!nodeB.connectionsContains(nodeIndexA)){
            return [];  // if not connected, return empty
        }

        // otherswise find weight:
        // extract nodes
        let nodeA = this.Nodes[nodeIndexA];
        let nodeB = this.Nodes[nodeIndexB];
        
        // retrieve indexes to nodes' internal connections lists
        let nodeAindexToB = nodeA.getConnectionIndex(nodeIndexB);
        let nodeBindexToA = nodeB.getConnectionIndex(nodeIndexA);

        // retrieve nodes
        let nodeABweight = nodeA.Weights[nodeAindexToB];
        let nodeBAweight = nodeB.weights[nodeBindexToA];

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

        // loop through nodes:
        for (let nodeIndex = 0; nodeIndex < this.Nodes.length; nodeIndex++){
            // extract current node:
            let currentNode = this.Nodes[nodeIndex];

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

    // displays the graph - nodes and edges in a canvas
    // expects canvasID string of html canvas to draw in
    //         nodeRadius int for visual radius of nodes
    //         fontName string for font to display node value
    //         fontSize int for font size in pixels for node value
    // returns nothing, outputs visual graph in canvas of canvasID
    displayGraph(canvasID, nodeRadius, fontName, fontSize, fillColour, fontColour){
        const canvas = document.getElementById(canvasID);       // get canvas from ID
        const ctx = canvas.getContext("2d");                    // create context
        ctx.font = fontSize + "px " + fontName;                 // set up context font

        // iterate through and draw edge connections
        for (let n = 0; n < this.Nodes.length; n++){
            // get current node from list, and calculate position:
            let currentNode = this.Nodes[n];
            let currentNodeX = currentNode.RelativePositionX + (nodeRadius / 2);
            let currentNodeY = currentNode.RelativePositionY + (nodeRadius / 2);     
           
            let currentNodeConnections = currentNode.Connections;   // get that node's list of connections

            // iterate through connections and draw lines
            for (let c = 0; c < currentNodeConnections.length; c++){
                let currentConnection = currentNodeConnections[c];  // get individual connection
                let connectedNode = this.Nodes[currentConnection];  // get node which is indexed from this connection

                // get connected node position:
                let connectedNodeX = connectedNode.RelativePositionX + (nodeRadius / 2);
                let connectedNodeY = connectedNode.RelativePositionY + (nodeRadius / 2);

                // begin drawing line stroke path
                ctx.beginPath();
                ctx.moveTo(currentNodeX, currentNodeY);     // move to start node X and Y
                ctx.lineTo(connectedNodeX, connectedNodeY); // draw line to end X and Y
                
                // draw path:
                ctx.stroke();

                // end path
                ctx.closePath();
            }
        }

        // iterate through, and draw all the nodes
        for (let n = 0; n < this.Nodes.length; n++){
            let currentNode = this.Nodes[n];    // get node from list

            // extract node attributes:
            let nodeX = currentNode.RelativePositionX + (nodeRadius / 2);
            let nodeY = currentNode.RelativePositionY + (nodeRadius / 2);
            let nodeV = currentNode.Value;

            // set fill colour
            ctx.fillStyle = fillColour;
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
};

class Node {
    // node has these members:
    // value : string/int/ any datatype
    // connections: list of integers
    // weights: list of integers
    // relativepositionx: float storing X where the node could be displayed on a page
    // relativepositiony: float storing Y where the node could be displayed on a page
    constructor(value, connections, weights){
        this.Value = value,
        this.Connections = connections,
        this.Weights = weights
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
};
const foundCanvas = document.getElementById("mapCanvas");
let myGraph;

// node value, connections, weights
// myGraph.addNode("abc", [1], [0]);
// myGraph.addNode("def", [0], [0]);
// myGraph.addNode("ghi", [1], [0]);
// myGraph.addNode("jkl", [1], [0]);
// myGraph.addNode("mno", [0], [0]);
// myGraph.addNode("pqr", [1], [0]);
// myGraph.addNode("stu", [0, 1], [0, 0]);

// myGraph.printConnections(-1);
// myGraph.printConnections(0);
// myGraph.printConnections(1);
// myGraph.printConnections(2);

//myGraph.setupNodesForDisplay(60, 60, foundCanvas.width, foundCanvas.height);
//myGraph.displayGraph(foundCanvas.id, 20, "Monospace", 20, "white", "black");