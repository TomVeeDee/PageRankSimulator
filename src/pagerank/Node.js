export class Node {
    /**
     * 
     * @param {string} name The name of the node
     */
    constructor(name) {
        this.connections = [];
        this.name = name;
        this.hits = 0;
        this._state = "default";
    }
}

export let NodeUtils = {
    /**
     * 
     * @param {Node} node Removes all the connections coming <b>from</b> this node.
     */
    clearConnections(node) {
        node.connections = [];
    },
    /**
     * 
     * @param {Node} node1 The node the connection is coming from
     * @param {Node} node2 The node the connection is going to
     */
    connect(node1, node2) {
        if(node1.connections.includes(node2)) {
            throw "Node 1 already contains node 2 as a toNode";
        }
        node1.connections.push(node2);
    },
    /**
     * 
     * @param {Node} node1 
     * @param {Node} node2 
     */
    removeConnection(node1,node2) {
        if(!node1.connections.includes(node2)) {
            throw "Node 1 doesn't contains node 2 as a toNode";
        }
        node1.connections.splice(node1.connections.indexOf(node2),1);
    },
    /**
     * Get the index of a node in an array.
     * @param {Array} nodeList An array of Nodes
     * @param {Node} node
     * @returns The index of the object node in the array
     */
    getIndex(nodeList, node) {
        return nodeList.indexOf(node);
    },
    /**
     * TODO useless function!
     * @param {Array} nodeList An array of nodes
     * @param {Node} node 
     * @returns The node in the array
     */
    getNode(nodeList, node) {
        let index = this.getIndex(nodeList, node);
        if(index == -1) {
            return null;
        }
        return nodeList[index];
    },
    /**
     * 
     * @param {Node} node1 
     * @param {Node} node2 
     * @returns True if node1 is connected to node2, false otherwise
     */
    isConnectedTo(node1, node2 ) {
        return node1.connections.includes(node2);
    }
}