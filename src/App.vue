<template>
  <v-app>
    <v-row>
      <!-- Canvas -->
      <v-col cols="8"><Graph></Graph></v-col>
      <!-- Data and controls -->
      <v-col cols="4">
        <!-- table -->
        <v-row>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="data"
              :items-per-page="-1"
              hide-default-header
              hide-default-footer
              disable-pagination
              disable-sort
            >
              <template v-slot:item.fraction="{ item }">
                <v-progress-linear :value="item.fraction" height="25">
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template></v-progress-linear
                >
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <!-- control buttons -->
        <v-row>
          <v-col>
            <v-btn color="success"> start </v-btn>
            <v-btn class="ma-2" color="error"> stop </v-btn>
            <v-btn color="primary"> reset </v-btn>
          </v-col>
        </v-row>
        <!-- sliders -->
        <v-slider v-model="speed" label="snelheid" min="1" max="100" step="5"
          ><template v-slot:append
            ><div class="mt-0 pt-0" type="number" style="width: 35px">
              {{ speed }}
            </div>
          </template></v-slider
        >
        <v-slider v-model="alpha" label="alpha" min="0" max="1" step="0.05"
          ><template v-slot:append>
            <div class="mt-0 pt-0" type="number" style="width: 35px">
              {{ alpha }}
            </div>
          </template></v-slider
        >
        <v-row>
          <v-col> </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import Graph from "./components/Graph.vue";
export default {
  components: { Graph },
  data() {
    return {
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
          fraction: 20,
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
    };
  },
};
</script>