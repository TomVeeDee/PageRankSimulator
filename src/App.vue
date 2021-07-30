<template>
  <v-app>
    <v-container>
      <v-row>
        <!-- Canvas -->
        <v-col xl="8" lg="8" md="12" sm="12" cols="12">
          <Graph ref="graph" :nodes="nodes"></Graph>
        </v-col>
        <!-- Data and controls -->
        <v-col xl="4" lg="4" md="12" sm="12" cols="12">
          <!-- table -->
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="data"
                :items-per-page="-1"
                hide-default-footer
                disable-pagination
                disable-sort
              >
                <template v-slot:item.fraction="{ item }">
                  <v-progress-linear
                    v-if="showProgressBar"
                    :value="item.fraction"
                    height="25"
                  >
                    <template v-slot:default="{ value }">
                      <strong>{{ value.toFixed(1) }}%</strong>
                    </template></v-progress-linear
                  >
                  <strong v-else>{{ item.fraction.toFixed(1) }}%</strong>
                </template>
                <template v-slot:body.append>
                  <tr class="pa-0">
                    <th>Totaal hits</th>
                    <th>{{ totalHits }}</th>
                    <th></th>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
          <!-- control buttons -->
          <v-row>
            <v-col>
              <v-row>
                <v-col cols="6">
                  <v-btn block color="success" @click="start"> start </v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn block color="error" @click="stop"> stop </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn block color="primary" @click="reset"> reset </v-btn>
                </v-col>
                <v-col>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        block
                        color="primary"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        Examples
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        v-for="(item, index) in presets"
                        :key="index"
                        @click="loadPreset(index)"
                      >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- sliders -->
          <v-row>
            <v-slider
              v-model="speed"
              label="snelheid"
              min="1"
              max="100"
              step="5"
              ><template v-slot:append>
                <v-text-field
                  v-model="speed"
                  class="mt-0 pt-0"
                  type="number"
                  style="width: 60px"
                ></v-text-field> </template
            ></v-slider>
          </v-row>
          <v-row>
            <v-slider v-model="alpha" label="alpha" min="0" max="1" step="0.05"
              ><template v-slot:append>
                <v-text-field
                  v-model="alpha"
                  class="mt-0 pt-0"
                  type="number"
                  step="0.05"
                  style="width: 60px"
                ></v-text-field> </template
            ></v-slider>
          </v-row>
          <v-row>
            <v-col>
              <v-btn icon color="primary" @click.stop="infoDialog = true">
                <v-icon large>mdi-help-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- info dialog -->
    <v-dialog v-model="infoDialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5"> Info </v-card-title>

        <v-card-text> Todooo </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Graph from "./components/Graph.vue";
import { Node, NodeUtils } from "./pagerank/Node";
import { PageRankSimulator } from "./pagerank/PageRankSimulator";
import { PRESETS } from "./presets";

const MIN_SPEED = 2000; // in ms, range is from MIN_SPEED to MIN_SPEED / 100

export default {
  components: { Graph },
  meta: {
    title: "Login",
  },
  head: {
    title: {
      inner: "JuniorCollege PageRank",
    },
    link: [
      {
        rel: "icon",
        href: require("./assets/favicon.png"),
      },
    ],
  },
  data() {
    return {
      infoDialog: false,
      running: false,
      nodes: null,
      pageRankSim: null,
      speed: 1,
      alpha: 1,
      headers: [
        {
          text: "site",
          align: "start",
          sortable: false,
          value: "siteName",
        },
        { text: "hits", value: "hits" },
        { text: "verdeling", value: "fraction" },
      ],
      data: [
        {
          siteName: "A",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "B",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "C",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "D",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "E",
          hits: 0,
          fraction: 0,
        },
      ],
      presets: PRESETS,
    };
  },
  methods: {
    loadPreset(i) {
      this.stop();
      this.reset();

      let n1 = this.nodes[3];
      let n2 = this.nodes[4];
      let n3 = this.nodes[0];
      let n4 = this.nodes[1];
      let n5 = this.nodes[2];
      NodeUtils.clearConnections(n1);
      NodeUtils.clearConnections(n2);
      NodeUtils.clearConnections(n3);
      NodeUtils.clearConnections(n4);
      NodeUtils.clearConnections(n5);
      this.nodes = PRESETS[i].create(n1, n2, n3, n4, n5);

      this.$refs.graph.updateState();

      this.reset();
    },
    restStatistics() {
      for (const n of this.nodes) {
        n.hits = 0;
      }
      this.pageRankSim.totalHits = 0;
    },
    init(reset = false) {
      const NODE_NAMES = ["A", "B", "C", "D", "E"];
      let n1;
      let n2;
      let n3;
      let n4;
      let n5;
      if (reset) {
        n1 = this.nodes[0];
        n2 = this.nodes[1];
        n3 = this.nodes[2];
        n4 = this.nodes[3];
        n5 = this.nodes[4];
        NodeUtils.clearConnections(n1);
        NodeUtils.clearConnections(n2);
        NodeUtils.clearConnections(n3);
        NodeUtils.clearConnections(n4);
        NodeUtils.clearConnections(n5);
        n1.hits = 0;
        n2.hits = 0;
        n3.hits = 0;
        n4.hits = 0;
        n5.hits = 0;
      } else {
        n1 = new Node(NODE_NAMES[0]);
        n2 = new Node(NODE_NAMES[1]);
        n3 = new Node(NODE_NAMES[2]);
        n4 = new Node(NODE_NAMES[3]);
        n5 = new Node(NODE_NAMES[4]);
      }

      NodeUtils.connect(n1, n2);
      NodeUtils.connect(n1, n3);
      NodeUtils.connect(n1, n4);
      NodeUtils.connect(n1, n5);

      NodeUtils.connect(n2, n1);
      NodeUtils.connect(n2, n3);
      NodeUtils.connect(n2, n4);
      NodeUtils.connect(n2, n5);

      NodeUtils.connect(n3, n1);
      NodeUtils.connect(n3, n2);
      NodeUtils.connect(n3, n4);
      NodeUtils.connect(n3, n5);

      NodeUtils.connect(n4, n1);
      NodeUtils.connect(n4, n2);
      NodeUtils.connect(n4, n3);
      NodeUtils.connect(n4, n5);

      NodeUtils.connect(n5, n1);
      NodeUtils.connect(n5, n2);
      NodeUtils.connect(n5, n3);
      NodeUtils.connect(n5, n4);

      this.nodes = [n3, n4, n5, n1, n2];
      this.data = [
        {
          siteName: "A",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "B",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "C",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "D",
          hits: 0,
          fraction: 0,
        },
        {
          siteName: "E",
          hits: 0,
          fraction: 0,
        },
      ];
      // console.log(this.pageRankcSim);
      let randomStartN =
        this.nodes[Math.floor(Math.random() * this.nodes.length)];
      this.pageRankSim = new PageRankSimulator(randomStartN, this.nodes);
      this.currentNode = randomStartN;
    },
    step() {
      let nextNode = this.pageRankSim.step(this.alpha);
      this.$refs.graph.removeHighlights();
      this.$refs.graph.highlightPath(
        this.currentNode,
        nextNode,
        !this.pageRankSim.wasRandomChoice
      );
      this.currentNode = nextNode;
      // console.log(nextNode.name);
      // console.log(this.data[0].hits);
    },
    reset() {
      this.stop();
      this.restStatistics();
      this.$refs.graph.removeHighlights();
    },
    start() {
      if (this.running) {
        return;
      }
      this.running = true;
      this.step(); // otherwise nothing happens for first x seconds
      this.timer = setInterval(this.step, MIN_SPEED / this.speed);
    },
    stop() {
      this.running = false;
      clearInterval(this.timer);
    },
  },
  created() {
    this.init();
  },
  computed: {
    totalHits() {
      return this.pageRankSim.totalHits;
    },
    showProgressBar() {
      return (
        this.$vuetify.breakpoint.name == "xl" ||
        this.$vuetify.breakpoint.name == "lg"
      );
    },
  },
  mounted() {
    for (let i = 0; i < 5; i++) {
      this.$watch("nodes." + i.toString() + ".hits", function (val) {
        this.$set(this.data[i], "hits", val);
        let frac = this.totalHits == 0 ? 0 : (val * 100) / this.totalHits;
        this.$set(this.data[i], "fraction", frac);
      });
    }

    // update all fracs
    this.$watch("pageRankSim.totalHits", function (val) {
      for (let i = 0; i < 5; i++) {
        let frac = val == 0 ? 0 : (this.data[i].hits * 100) / val;
        this.$set(this.data[i], "fraction", frac);
      }
    });
  },
  watch: {
    speed(newVal, oldVal) {
      if (this.running) {
        clearInterval(this.timer);
        this.timer = setInterval(this.step, MIN_SPEED / newVal);
      }
    },
  },
};
</script>