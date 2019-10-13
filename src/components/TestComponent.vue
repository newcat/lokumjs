<template lang="pug">
div(style="display:flex;height:100%;align-items:center;padding:5px;")
    div(style="height:100%;")
        img(:src="url", style="height:100%;border-radius:3px;")
    div(style="margin-left: 1em;") {{ item.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TestComponent extends Vue {

    @Prop()
    item!: any;

    get url() {
        return `https://via.placeholder.com/140x100.png?text=${this.item.text}`;
    }

}
</script>