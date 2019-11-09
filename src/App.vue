<template>
    <div id="app" ref="wrapper" style="width:100%;height:600px;">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Timeline } from "./components/timeline";
import { Editor } from "./Editor";
import TestComponent from "./components/TestComponent.vue";

import * as PIXI from "pixi.js";

@Component
export default class App extends Vue {

    editor = new Editor();

    mounted() {
        const { id: tid1 } = this.editor.addTrack("Track 1");
        const { id: tid2 } = this.editor.addTrack("Track 2");
        this.editor.addTrack("Track 3");
        this.editor.addTrack("Track 4");
        this.editor.addTrack("Track 5");
        this.editor.addItem({ track: tid1, start: 5, end: 10, text: "Item 1", selected: false });
        this.editor.addItem({ track: tid1, start: 15, end: 30, text: "Item 2", selected: false });
        this.editor.addItem({ track: tid2, start: 8, end: 25, text: "Item 3", selected: false });
        this.editor.itemComponent = TestComponent;

        const app = new PIXI.Application({
            view: this.$refs.canvas as HTMLCanvasElement,
            resizeTo: this.$refs.wrapper as HTMLElement,
            antialias: true
        });
        const t = new Timeline(app);
        t.editor = this.editor;
        t.setup();
        app.stage.addChild(t.graphics);
        t.render();

    }

}
</script>

<style>
html {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>