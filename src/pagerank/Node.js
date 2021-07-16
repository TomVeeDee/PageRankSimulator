export class Node {
    constructor(name) {
        this.connections = [];
        this.name = name;
        this.hits = 0;
        this._state = "default";
    }
}

export let NodeUtils = {
    connect(node1, node2) {
        if(node1.connections.includes(node2)) {
            throw "Node 1 already contains node 2 as a toNode";
        }
        node1.connections.push(node2);
    },
    removeConnection(node1,node2) {
        if(!node1.connections.includes(node2)) {
            throw "Node 1 doesn't contains node 2 as a toNode";
        }
        node1.connections.splice(node1.connections.indexOf(node2),1);
    },
    getIndex(nodeList, node) {
        return nodeList.indexOf(node);
    },
    getNode(nodeList, node) {
        let index = this.getIndex(nodeList, node);
        if(index == -1) {
            return null;
        }
        return nodeList[index];
    },
    isConnectedTo(node1, node2 ) {
        return node1.connections.includes(node2);
    }
}