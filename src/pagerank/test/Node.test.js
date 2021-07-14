import { Node, NodeUtils } from "../Node";

test("connecting nodes", () => {
  let n1 = new Node("A");
  let n2 = new Node("B");
  let n3 = new Node("C");
  //
  NodeUtils.connect(n1, n2);

  expect(n1.toNodes).toContain(n2);
  expect(n1.toNodes.length).toBe(1);
  expect(n1.fromNodes.length).toBe(0);

  expect(n2.fromNodes).toContain(n1);
  expect(n2.fromNodes.length).toBe(1);
  expect(n2.toNodes.length).toBe(0);

  //
  NodeUtils.connect(n1, n3);
  NodeUtils.connect(n3, n1);

  expect(n1.toNodes).toContain(n2);
  expect(n1.toNodes).toContain(n3);
  expect(n1.fromNodes).toContain(n3);
  expect(n1.toNodes.length).toBe(2);
  expect(n1.fromNodes.length).toBe(1);

  expect(n2.fromNodes).toContain(n1);
  expect(n2.fromNodes.length).toBe(1);
  expect(n2.toNodes.length).toBe(0);

  expect(n3.toNodes).toContain(n1);
  expect(n3.fromNodes).toContain(n1);
  expect(n3.toNodes.length).toBe(1);
  expect(n3.fromNodes.length).toBe(1);
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
  
  expect(n3.toNodes).not.toContain(n1);
  expect(n1.fromNodes).not.toContain(n3);
});
