<template lang="pug">
.timeline-item(:class="{ '--selected': selected }", :style="styles", @mousedown.stop="mousedown($event, 'center')")
    .__menu(v-show="selected")
        .__item.material-icons.md-18(@click="$emit('remove')") delete
        .__item.material-icons.md-18 edit
    .__drag-handle.--left(v-show="selected", @mousedown.stop="mousedown($event, 'leftHandle')")
    .__drag-handle.--right(v-show="selected", @mousedown.stop="mousedown($event, 'rightHandle')")
    .__container
        component(v-if="itemComponent", :is="itemComponent", :item="item")
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import { PositionCalculator } from "../PositionCalculator";
import { IItem, ItemArea } from "../types";
import { Editor } from "../Editor";

@Component
export default class TimelineItem extends Vue {

    @Prop()
    positionCalculator!: PositionCalculator;

    @Prop()
    item!: IItem;

    @Prop()
    selected!: boolean;

    @Inject()
    editor!: Editor;

    get styles() {
        const startX = this.positionCalculator.getX(this.item.start);
        const endX = this.positionCalculator.getX(this.item.end);
        return {
            width: `${endX - startX}px`,
            transform: `translate(${startX}px, 10px)`
        };
    }

    get itemComponent() {
        return this.editor.itemComponent;
    }

    mousedown(ev: MouseEvent, area: ItemArea) {
        this.$emit("mousedown", this.item, ev, area);
    }

}
</script>