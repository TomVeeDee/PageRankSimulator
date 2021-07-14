export class Node {
    constructor(ID) {
        this.toNodes = [];
        this.fromNodes = [];
        this.ID = ID;
    }

}

export let NodeUtils = {
    connect(node1, node2) {
        if(node1.toNodes.includes(node2)) {
            throw "Node 1 already contains node 2 as a toNode";
        }
        if(node2.fromNodes.includes(node1)) {
            throw "Node 2 already contains node 1 as a fromNode";
        }
        node1.toNodes.push(node2);
        node2.fromNodes.push(node1);
    },
    removeConnection(node1,node2) {
        if(!node1.toNodes.includes(node2)) {
            throw "Node 1 doesn't contains node 2 as a toNode";
        }
        if(!node2.fromNodes.includes(node1)) {
            throw "Node 2 doesn't contains node 1 as a fromNode";
        }
        node1.toNodes.splice(node1.toNodes.indexOf(node2),1);
        node2.fromNodes.splice(node2.fromNodes.indexOf(node1),1);
    }
}