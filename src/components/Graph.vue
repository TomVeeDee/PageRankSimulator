<template>
  <v-card style="height: 100%; overflow: hidden" id="canvas_container">
    <!-- <div style="position: relative" id="canvas_container"> -->
    <canvas style="height: inherit; width: inherit" id="pixi"></canvas>
    <!-- </div> -->
  </v-card>
</template>

<script>
import * as PIXI from "pixi.js";
import { GraphDrawer } from "./DrawGraph";
// import { Node } from "../pagerank/Node";
const DRAW_HEIGHT = 500;
const DRAW_WIDTH = 500;

export default {
  name: "Graph",
  props: ["nodes"],
  data() {
    return { drawer: null };
  },
  methods: {
    init() {
      PIXI.settings.RESOLUTION = window.devicePixelRatio;
      let canvas = document.getElementById("pixi");
      this.canvasC = document.getElementById("canvas_container");

      const app = new PIXI.Application({
        width: this.canvasC.getBoundingClientRect().width,
        height: this.canvasC.getBoundingClientRect().height,
        antialias: true,
        // autoResize: false,
        // resizeTo: document.getElementById("canvas_container"),
        view: canvas,
        backgroundAlpha: 0.0,
        autoDensity: true,
      });
      this.app = app;

      this.app.renderer.plugins.interaction.autoPreventDefault = false;
      this.app.renderer.view.style.touchAction = "auto";

      this.graphContainer = new PIXI.Container();
      this.resize();

      this.drawer = new GraphDrawer(
        this.graphContainer,
        this.nodes,
        DRAW_WIDTH,
        DRAW_HEIGHT
      );
      this.drawer.draw();

      this._positionInContainer();

      this.app.stage.addChild(this.graphContainer);
      // this.app.resizeTo = document.getElementById("canvas_container");

      // this.prevW = this.canvasContainer.getBoundingClientRect().width;
      // this.prevH = this.canvasContainer.getBoundingClientRect().height;
      // this.resize();
      window.onresize = () => {
        this.resize();
      };
    },
    resize() {
      // console.log(
      //   "screen width - height",
      //   this.app.screen.width,
      //   this.app.screen.height
      // );
      // console.log("renderer width", this.app.screen.width);
      // console.log("stage width", this.app.stage.width);
      // console.log(
      //   "boudingbox width - height",
      //   this.canvasC.getBoundingClientRect().width,
      //   this.canvasC.getBoundingClientRect().height
      // );
      // console.log("---");

      let w = this.canvasC.getBoundingClientRect().width;
      let h = this.canvasC.getBoundingClientRect().height;
      this.app.renderer.resize(w, h);

      let scaleX = w / DRAW_WIDTH;
      let scaleY = h / DRAW_HEIGHT;
      let scale = Math.min(scaleX, scaleY);

      this.graphContainer.scale.set(scale, scale);

      this._positionInContainer();
    },

    _positionInContainer() {
      this.graphContainer.calculateBounds();
      this.graphContainer.x =
        this.app.screen.width / 2 - this.graphContainer.width / 2 - 20; //TODO hard coded
      this.graphContainer.y =
        this.app.screen.height / 2 - this.graphContainer.height / 2;
    },

    highlightPath(node1, node2, highlightCon = false) {
      this.drawer.highlight(node1, node2, highlightCon);
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