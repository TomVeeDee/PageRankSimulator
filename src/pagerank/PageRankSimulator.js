import { NodeUtils } from "./Node";
const { Random, MersenneTwister19937 } = require("random-js");

export class PageRankSimulator {
  constructor(startNode, nodeList) {
    // this.startNode = startNode;
    this.currentNode = startNode;
    this.totalHits = 0;
    this.nodeList = nodeList;
    this.randomGen = new Random(MersenneTwister19937.autoSeed());
    this.wasRandomChoice = false;
  }

  _probability(n) {
    return this.randomGen.bool(n);
  }

  _chooseRandom(list, nodeToIgnore = null) {
      if(nodeToIgnore == null) {
        
          return this.randomGen.pick(list);
      }
      else {
          let pick = this.randomGen.pick(list);
          while(pick == nodeToIgnore) {
              pick = this.randomGen.pick(list);
          }
          return pick;
      }
  }

  step(alpha = 1) {
    let nextNode = null;
    if (this._probability(alpha)) {
      // we choose a random connection
      // first check if this is a dangling node
      if (this.currentNode.connections.length == 0) {
        //dangling node, choose random node
        nextNode = this._chooseRandom(this.nodeList);
        this.wasRandomChoice = true;
      } else {
        nextNode = this._chooseRandom(this.currentNode.connections);
        this.wasRandomChoice = false;
      }
    } else {
      // we choose a random node
      nextNode = this._chooseRandom(this.nodeList);
      this.wasRandomChoice = true;
    }

    nextNode.hits = nextNode.hits + 1;
    this.totalHits += 1;

    this.currentNode = nextNode;
    return nextNode;
  }
  
  relativeHits(node) {
    return this.totalHits == 0 ? 0 : node.hits / this.totalHits;
  }
}
