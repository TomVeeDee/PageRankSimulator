import { Node, NodeUtils } from "../Node";

test("connecting nodes succes", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");
  //
  NodeUtils.connect(n1, n2);

  expect(n1.connections).toContain(n2);
  expect(n1.connections.length).toBe(1);

  expect(n2.connections.length).toBe(0);

  //
  NodeUtils.connect(n1, n3);
  NodeUtils.connect(n3, n1);

  expect(n1.connections).toContain(n2);
  expect(n1.connections).toContain(n3);
  expect(n1.connections.length).toBe(2);

  expect(n2.connections.length).toBe(0);

  expect(n3.connections).toContain(n1);
  expect(n3.connections.length).toBe(1);


});


test("connecting nodes error", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");
  //
  NodeUtils.connect(n1, n2);

  expect(()=>NodeUtils.connect(n1,n2)).toThrow("Node 1 already contains node 2 as a toNode");
});

test("is connected to", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");

  NodeUtils.connect(n1, n2);

  expect(NodeUtils.isConnectedTo(n1,n2)).toBe(true);
  expect(NodeUtils.isConnectedTo(n1,n2)).toBe(true);
  expect(NodeUtils.isConnectedTo(n1,n1)).toBe(false);
  expect(NodeUtils.isConnectedTo(n1,n3)).toBe(false);
});

test("removing connections", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");
// we assume here that connect works
  NodeUtils.connect(n1, n2);
  NodeUtils.connect(n1, n3);
  NodeUtils.connect(n3, n1);

  NodeUtils.removeConnection(n3, n1);
  
  expect(n3.connections).not.toContain(n1);
  expect(n3.connections.length).toBe(0);
  expect(n1.connections.length).toBe(2);
});


test("getIndex", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");

  let nodeList = [n1, n2, n3];
  expect(NodeUtils.getIndex(nodeList, n1)).toBe(0);
  expect(NodeUtils.getIndex(nodeList, n2)).toBe(1);
  expect(NodeUtils.getIndex(nodeList, n3)).toBe(2);

  expect(NodeUtils.getIndex(nodeList, new Node("A"))).toBe(-1); // not the same object

  expect(NodeUtils.getIndex(nodeList, new Node("D"))).toBe(-1);

});
