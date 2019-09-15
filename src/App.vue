<template>
  <div id="app">
    <Timeline />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timeline from "./components/Timeline.vue";

@Component({
    components: {
      Timeline
    }
})
export default class App extends Vue {}
</script>
