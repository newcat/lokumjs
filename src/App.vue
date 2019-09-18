<template>
  <div id="app">
    <Timeline :editor="editor"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Timeline from "./components/Timeline.vue";
import { Editor } from "./Editor";

@Component({
    components: {
      Timeline
    }
})
export default class App extends Vue {

    editor = new Editor();

    mounted() {
        const { id: tid1 } = this.editor.addTrack("Track 1");
        const { id: tid2 } = this.editor.addTrack("Track 2");
        this.editor.addItem(tid1, 5, 10);
        this.editor.addItem(tid1, 15, 30);
        this.editor.addItem(tid2, 8, 25);
    }

}
</script>
