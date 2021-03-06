/* eslint-disable no-unused-vars */
import NodeC from "./canvascomponents/NodeC.js";
import ConnectorC from "./canvascomponents/ConnectorC.js";
import { NodeUtils } from "../pagerank/Node";
export class GraphDrawer {
  /**
   * 
   * @param {PXI.Stage} container 
   * @param {Array} nodes 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(container, nodes, width = 1000, height = 1000) {
    this.nodes = nodes;
    this.nodeCs = [];
    this.connectors = [];
    this.hightlighted = [];
    this.nodeMapping = new Map();
    this.iNodeMapping = new Map();
    this.container = container;
    this.width = width;
    this.height = height;
    // this.connectorMapping = new Map(); no longer needed, solved in an easier way

    container.sortableChildren = true;

    if (nodes.length != 5) {
      throw "nodes doesn't contain 5 items. This graphdrawer is designed to work with exactly 5 nodes only.";
    }

    let minDim = height < width ? height : width;
    let rotation = Math.PI*54/180;
    let centerY = height - minDim/2-20;
    let vertices = this._regPolyGetVertices(minDim / 2 - 25, {
      //TODO hard coded, must be the radius of the circles or not?
      x: width / 2,
      y: centerY,
    },rotation);

    for (const [i, vert] of vertices.entries()) {
      let n = new NodeC(container, nodes[i].name, [vert[0], vert[1]]);
      this.nodeMapping.set(nodes[i], n);
      this.iNodeMapping.set(n, nodes[i]);
      this.nodeCs.push(n);
    }

    for (const [i, node] of this.nodeCs.entries()) {
      let reducedList = this.nodeCs.slice();
      reducedList.splice(i, 1);

      for (const toNode of reducedList) {
        let con = new ConnectorC(container, node, toNode);
        con.onClick = (con, e) => this._connectionUpdate(con, e, this);
        node.connectorCs.push(con);
        this.connectors.push(con);
      }
    }
  }
  _connectionUpdate(con, e, self) {
    let node1 = [...self.nodeMapping.entries()].find(
      ([k, v]) => v == con.node1
    )[0];
    let node2 = [...self.nodeMapping.entries()].find(
      ([k, v]) => v == con.node2
    )[0];

    if (con.state === "disabled") {
      con.state = "default";
      NodeUtils.connect(node1, node2);
    } else {
      con.state = "disabled";
      NodeUtils.removeConnection(node1, node2);
    }

    con.draw();
  }

  /**
   * Rescale the drawings in the canvas based on the screen size
   */
  updateScaling() {
    let minDim =
      this.app.screen.height < this.app.screen.width
        ? this.app.screen.height
        : this.app.screen.width;
    let vertices = this._regPolyGetVertices(minDim / 3, {
      x: this.app.screen.width / 2,
      y: this.app.screen.height / 2,
    });
    for (const [i, vert] of vertices.entries()) {
      this.nodeCs[i].location[0] = vert[0];
      this.nodeCs[i].location[1] = vert[1];
    }
  }

  /**
   * Highlight a path on the graph, all highlights are saved and can be removed later by @see removeHighlights
   * @param {Node} node1 The node from with the highlight starts
   * @param {Node} node2 The node the highlight goes to
   * @param {boolean} hightLightCon If true the connection will be highlighted too
   */
  highlight(node1, node2, hightLightCon = true) {
    let node1C = this.nodeMapping.get(node1);
    let node2C = this.nodeMapping.get(node2);
    node2C.state = "active";
    node2C.draw();
    this.hightlighted.push(node2C);

    if (hightLightCon) {
      let connection = node1C.connectorCs[node1C.connectorCs.indexOf(node2C)];
      connection = node1C.connectorCs.find((e) => e.node2 == node2C);

      // we dont check if the connection is active or exist, we assume that this function will never be called on an inactive/non existing connection
      connection.state = "active";
      connection.draw();
      this.hightlighted.push(connection);
    }
  }
  
  /**
   * Removes the highlights, if any
   * @see highlight
   * @returns nothing
   */
  removeHighlights() {
    if (this.hightlighted.length == 0) {
      return;
    }
    // an unactive connection will never be highlighted so its safe to set all components back to default state and redraw them
    while(this.hightlighted.length != 0) {
      const c = this.hightlighted.pop();
      c.state = "default";
      c.draw();
    }

  }

  /**
   * Updates the connection state (default/disabled) based on the underlying data model.
   * This function must be called afther altering the underlying node model
   * @see this.nodes
   */
  updateState() {
    // console.log(this.connectors);
    for( const c of this.connectors) {
      let n1 = this.iNodeMapping.get(c.node1)
      let n2 = this.iNodeMapping.get(c.node2)
      if(NodeUtils.isConnectedTo(n1,n2)) {
        c.state = "default";
      }
      else {
        c.state = "disabled"
      }
      c.draw();
    }

  }

  /**
   * Draw all components on the canvas
   */
  draw() {
    for (const c of this.connectors) {
      c.draw();
    }
    for (const n of this.nodeCs) {
      n.draw();
    }
  }

  /**
   * Calculates the points (x,y) of a regular polygon.
   * @param {number} radius The radius of the circle that intersects with all points of the polygon
   * @param {object} center The center of the polygon, an object containing an x and y, both numbers
   * @param {number} rot The rotation of the polygon around its center
   * @param {number} vertCount The vertex count
   * @returns An array containing the points of the polygon. Each element is an array of the form [x, y]
   */
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
