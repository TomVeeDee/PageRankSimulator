/* eslint-disable no-unused-vars */
import NodeC from "./canvascomponents/NodeC.js";
import ConnectorC from "./canvascomponents/ConnectorC.js";

export class GraphDrawer {
  constructor(app, nodes) {
    this.nodes = nodes;
    this.nodeCs = [];
    this.connectors = [];
    this.hightlighted = [];
    this.nodeMapping = new Map();
    this.app = app;
    // this.connectorMapping = new Map(); no longer needed, solved in an easier way

    if (nodes.length != 5) {
      throw "nodes doesn't contain 5 items. This graphdrawer is designed to work with exactly 5 nodes only.";
    }

    let minDim = (app.screen.height < app.screen.width) ? app.screen.height : app.screen.width;
    let vertices = this._regPolyGetVertices(minDim / 3, {
      x: app.screen.width / 2,
      y: app.screen.height / 2,
    });

    for (const [i, vert] of vertices.entries()) {
      let n = new NodeC(app.stage, nodes[i].name, [vert[0], vert[1]]);
      this.nodeMapping.set(nodes[i], n);
      this.nodeCs.push(n);
    }

    for (const [i, node] of this.nodeCs.entries()) {
      let reducedList = this.nodeCs.slice();
      reducedList.splice(i, 1);

      for (const toNode of reducedList) {
        let con = new ConnectorC(app.stage, node, toNode);
        node.connectorCs.push(con);
        this.connectors.push(con);
      }
    }
  }

  updateScaling() {
    let minDim = (this.app.screen.height < this.app.screen.width) ? this.app.screen.height : this.app.screen.width;
    let vertices = this._regPolyGetVertices(minDim / 3, {
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
    });
    for (const [i, vert] of vertices.entries()) {
      this.nodeCs[i].location[0] = vert[0];
      this.nodeCs[i].location[1] = vert[1];
    }
  }

  highlight(node1, node2) {
    let node1C = this.nodeMapping.get(node1);
    let node2C = this.nodeMapping.get(node2);
    node2C.state = "active";
    node2C.draw();


    let connection = node1C.connectorCs[node1C.connectorCs.indexOf(node2C)];
    connection = node1C.connectorCs.find(e =>e.node2 == node2C);

    // we dont check if the connection is active or exist, we assume that this function will never be called on an inactive/non existing connection
    connection.state = "active";
    connection.draw();

    this.hightlighted.push(node2C);
    this.hightlighted.push(connection);
  }

  removeHighlights() {
    if(this.hightlighted.length == 0) {
      return;
    }
    // an unactive connection will never be highlighted so its safe to set all components back to default state and redraw them
    for(const c of this.hightlighted) {
      c.state = "default";
      c.draw();
    }
  }

  draw() {
    for (const c of this.connectors) {
      c.draw();
    }
    for (const n of this.nodeCs) {
      n.draw();
    }
  }

  _regPolyGetVertices(radius, center = { x: 0, y: 0 }, rot = 0, vertCount = 5) {
    let vertices = [];
    for (let k = 0; k < 5; k++) {
      let x = center.x + radius * Math.cos(rot + (k * 2 * Math.PI) / vertCount);
      let y = center.y + radius * Math.sin(rot + (k * 2 * Math.PI) / vertCount);
      vertices.push([x, y]);
    }
    return vertices;
  }
}
