<template>
  <div id="canvas_container">
    <canvas id="pixi"></canvas>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import { GraphDrawer } from "./DrawGraph";
import { Node } from "../pagerank/Node";

export default {
  name: "Graph",
  props: ["nodes"],
  data() {
    return { drawer: null };
  },
  methods: {
    init() {
      var canvas = document.getElementById("pixi");

      const app = new PIXI.Application({
        antialias: true,
        autoResize: true,
        resizeTo: document.getElementById("canvas_container"),
        view: canvas,
        backgroundAlpha: 0.0,
        autoDensity: true,
        resolution: window.devicePixelRatio,
      });
      app.stage.sortableChildren = true;

      this.drawer = new GraphDrawer(app, this.nodes);
      this.drawer.draw();

      window.onresize = () => {
        app.resize();
        // console.log(app.screen.width);
        this.drawer.updateScaling();
        this.drawer.draw();
      };
    },
    highlightPath(node1, node2) {
      this.drawer.highlight(node1, node2);
    },
    removeHighlights() {
      this.drawer.removeHighlights();
    },
  },

  mounted() {
    this.init();
  },
};
</script>