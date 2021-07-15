import { Node, NodeUtils } from "../Node";
import { PageRankSimulator } from "../PageRankSimulator";

test('simple test two nodes no alpha', () => {
  let n1 = new Node("A");
  let n2 = new Node("B");


  NodeUtils.connect(n1,n2);
  NodeUtils.connect(n2,n1);

  let pageRank = new PageRankSimulator(n1, [n1,n2]);
  expect(pageRank.relativeHits(n1)).toBe(0);

  let result = pageRank.step();

  expect(result).toBe(n2);
  expect(result.hits).toBe(1);
  expect(n1.hits).toBe(0)
  expect(pageRank.totalHits).toBe(1);
  expect(pageRank.relativeHits(n1)).toBe(0);
  expect(pageRank.relativeHits(n2)).toBe(1);

  const STEPS = 500;
  // now simulate it a bit futher
  for (let step = 0; step < STEPS; step++) {
    pageRank.step();
  }

  expect(pageRank.totalHits).toBe(STEPS + 1);
  expect(pageRank.relativeHits(n1)).toBeCloseTo(0.5,2);
  expect(pageRank.relativeHits(n2)).toBeCloseTo(0.5,2);
  expect(pageRank.relativeHits(n1) + pageRank.relativeHits(n2)).toBeCloseTo(1.0,5);
  });

  test('simple test three nodes no alpha', () => {
    let n1 = new Node("A");
    let n2 = new Node("B");
  
  
    NodeUtils.connect(n1,n2);
    NodeUtils.connect(n2,n1);
  
    let pageRank = new PageRankSimulator(n1);
    expect(pageRank.relativeHits()).toBe(0);
  
    let result = pageRank.step();
  
    expect(result).toBe(n2);
    expect(result.hits).toBe(1);
    expect(n1.hits).toBe(0)
    expect(pageRank.totalHits).toBe(1);
    expect(pageRank.relativeHits(n1)).toBe(0);
    expect(pageRank.relativeHits(n2)).toBe(1);
  
    const STEPS = 500;
    // now simulate it a bit futher
    for (let step = 0; step < STEPS; step++) {
      pageRank.step();
    }
  
    expect(pageRank.totalHits).toBe(STEPS + 1);
    expect(pageRank.relativeHits(n1)).toBeCloseTo(0.5,2);
    expect(pageRank.relativeHits(n2)).toBeCloseTo(0.5,2);
    expect(pageRank.relativeHits(n1) + pageRank.relativeHits(n2)).toBeCloseTo(1.0,5);
    });

  test('simple test three nodes', () => {
    let n1 = new Node("A");
    let n2 = new Node("B");
    let n3 = new Node("D");
  
    NodeUtils.connect(n1,n2);
    NodeUtils.connect(n2,n1);

    NodeUtils.connect(n1,n3);
    NodeUtils.connect(n2,n3);
  
    let pageRank = new PageRankSimulator(n1, [n1, n2, n3]);
    expect(pageRank.relativeHits(n1)).toBe(0);

    // check if it convergences correctly
    const STEPS = 8000;
    const ALPHA = 0.85;
  
    for (let step = 0; step < STEPS; step++) {
      pageRank.step(ALPHA);
    }

    expect(pageRank.totalHits).toBe(STEPS);
    expect(pageRank.relativeHits(n1)).toBeCloseTo(0.29197, 2);
    expect(pageRank.relativeHits(n2)).toBeCloseTo(0.29197, 2);
    expect(pageRank.relativeHits(n3)).toBeCloseTo(0.41606, 2);
    });