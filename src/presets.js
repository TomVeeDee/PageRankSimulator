import { Node, NodeUtils } from "./pagerank/Node";

export const PRESETS = [
    {
        title:"geen connecties",
        create: function(nA, nB, nC, nD, nE) {
            return [nA, nB, nC, nD, nE];
        },
        img: require("@/assets/examples/geen_connecties.png")
    },
    {
        title:"twee nodes",
        create: function(nA, nB, nC, nD, nE) {
            NodeUtils.connect(nA,nB);
            NodeUtils.connect(nB,nA);
            return [nA, nB, nC, nD, nE];
        },
        img: require("@/assets/examples/twee_nodes.png")
    },
    {
        title:"figuur 2",
        create: function(nA, nB, nC, nD, nE) {
            NodeUtils.connect(nA,nB);
            NodeUtils.connect(nB,nE);
            NodeUtils.connect(nA,nE);
            NodeUtils.connect(nC,nA);
            NodeUtils.connect(nA,nD);
            NodeUtils.connect(nC,nD);
            NodeUtils.connect(nD,nC);
            return [nA, nB, nC, nD, nE];
        },
        img: require("@/assets/examples/figuur_2.png")
    },
    {
        title:"alles verbonden ",
        create: function(nA, nB, nC, nD, nE) {
            NodeUtils.connect(nA, nB);
            NodeUtils.connect(nA, nC);
            NodeUtils.connect(nA, nD);
            NodeUtils.connect(nA, nE);
      
            NodeUtils.connect(nB, nA);
            NodeUtils.connect(nB, nC);
            NodeUtils.connect(nB, nD);
            NodeUtils.connect(nB, nE);
      
            NodeUtils.connect(nC, nA);
            NodeUtils.connect(nC, nB);
            NodeUtils.connect(nC, nD);
            NodeUtils.connect(nC, nE);
      
            NodeUtils.connect(nD, nA);
            NodeUtils.connect(nD, nB);
            NodeUtils.connect(nD, nC);
            NodeUtils.connect(nD, nE);
      
            NodeUtils.connect(nE, nA);
            NodeUtils.connect(nE, nB);
            NodeUtils.connect(nE, nC);
            NodeUtils.connect(nE, nD);
            return [nA, nB, nC, nD, nE];
        },
        img: require("@/assets/examples/alles_verbonden.png")
    },
];