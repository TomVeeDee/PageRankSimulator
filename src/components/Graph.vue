<template>
  <div id="canvas_container">
    <canvas id="pixi"></canvas>
  </div>
</template>

<script>
import * as PIXI from "pixi.js";
import drawGraph from "./DrawGraph.js";

export default {
  name: "Graph",

  methods: {
    drawPixi() {
      var canvas = document.getElementById("pixi");

      const app = new PIXI.Application({
        antialias: true,
        autoResize: true,
        resizeTo: document.getElementById("canvas_container"),
        view: canvas,
        backgroundAlpha: 0.1,
      });
      window.onresize = () => {
        console.log("resizing");
        app.resize();
      };
      drawGraph(app);
    },
  },

  mounted() {
    this.drawPixi();
  },
};
</script>