import { Node, NodeUtils } from "./pagerank/Node";

export const PRESETS = [
    {
        title:"geen connecties",
        create: function(nA, nB, nC, nD, nE) {
            return [nA, nB, nC, nD, nE];
        }
    },
    {
        title:"twee nodes",
        create: function(nA, nB, nC, nD, nE) {
            NodeUtils.connect(nA,nB);
            NodeUtils.connect(nB,nA);
            return [nA, nB, nC, nD, nE];
        }
    },
    {
        title:"figuur 2 ",
        create: function(nA, nB, nC, nD, nE) {
            NodeUtils.connect(nA,nB);
            NodeUtils.connect(nB,nE);
            NodeUtils.connect(nA,nE);
            NodeUtils.connect(nC,nA);
            NodeUtils.connect(nA,nD);
            NodeUtils.connect(nC,nD);
            NodeUtils.connect(nD,nC);
            return [nA, nB, nC, nD, nE];
        }
    },
];