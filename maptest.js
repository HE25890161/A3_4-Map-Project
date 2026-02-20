const nodes = ["Node A", "Node B", "Node C"];
const edges = [[1, 2], [0, 2], [0, 1]];

function getNodeConnections (nodeIndex) {
  var edge = edges[nodeIndex];
  let len = edge.length;
  for (let i = 0; i < len; i++) {
    console.log(edge[i]);
  }
}

getNodeConnections(0);  // 1, 2
getNodeConnections(1);  // 0, 2
getNodeConnections(2);  // 0, 1
