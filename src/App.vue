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
import { Track, Item } from "./model";

@Component
export default class App extends Vue {

    editor = new Editor();

    mounted() {
        const track1 = new Track("Track 1");
        const track2 = new Track("Track 2");
        const track3 = new Track("Track 3");
        const track4 = new Track("Track 4");
        const track5 = new Track("Track 5");
        track1.items.push(new Item(5, 10, { text: "Item 1" }));
        track1.items.push(new Item(15, 30, { text: "Item 2" }));
        track2.items.push(new Item(8, 25, { text: "Item 3" }));
        this.editor.tracks.push(track1, track2, track3, track4, track5);
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
        app.ticker.add(() => t.tick());

    }

}
</script>

<style>
html {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>