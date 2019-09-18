<template lang="pug">
.timeline(@mouseup="onMouseup", @mousedown="onMousedown", @mouseleave="onMouseup")
    .timeline-track(
        v-for="t in editor.tracks",
        :key="t.id"
        @mouseenter="hoveredTrack = t"
        @mouseleave="hoveredTrack = ''"
        @mousemove="onMousemove"
    )
        timeline-item(
            v-for="item, i in getItems(t.id)",
            :key="i",
            :position-calculator="positionCalculator",
            :item="item"
            :selected="selected.includes(item.id)"
            @mousedown="onItemMousedown"
        )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PositionCalculator } from "../PositionCalculator";

import TimelineItem from "./Item.vue";
import { Editor } from "../Editor";
import { IItem, DragDirection, IViewItem, ItemArea, ITrack } from "../types";

@Component({
    components: { TimelineItem }
})
export default class Timeline extends Vue {

    @Prop()
    editor!: Editor;

    positionCalculator = new PositionCalculator(10);

    selected: string[] = [];

    hoveredTrack: ITrack|null = null;
    isDragging = false;
    dragArea: ItemArea = "center";
    dragItem: IItem|null = null;
    dragStartPosition = 0;
    dragStartTrack: ITrack|null = null;
    dragStartStates: IItem[] = [];

    get markers() {
        return this.positionCalculator.getMarkers(2);
    }

    getItems(track: string) {
        return this.editor.items.filter((i) => i.track === track);
    }

    onItemMousedown(item: IItem, ev: MouseEvent, area: ItemArea) {
        if (area === "center") {
            if (ev.ctrlKey) {
                if (this.selected.includes(item.id)) {
                    this.selected.splice(this.selected.indexOf(item.id), 1);
                } else {
                    this.selected.push(item.id);
                }
            } else if (!this.selected.includes(item.id)) {
                this.selected = [item.id];
            }
        }
        this.dragArea = area;
        this.dragItem = item;
        this.dragStartPosition = ev.clientX;
        this.dragStartTrack = this.hoveredTrack;
        this.isDragging = true;
        this.dragStartStates = this.selected.map((id) => JSON.parse(JSON.stringify(
            this.editor.items.find((i) => i.id === id))));
    }

    onMousemove(ev: MouseEvent) {
        if (this.isDragging) {
            if (this.dragArea === "leftHandle") {
                const newStart = this.positionCalculator.getUnit(ev.clientX);
                if (this.editor.validateItem({...this.dragItem!, start: newStart})) {
                    this.dragItem!.start = newStart;
                }
            } else if (this.dragArea === "rightHandle") {
                const newEnd = this.positionCalculator.getUnit(ev.clientX);
                if (this.editor.validateItem({...this.dragItem!, end: newEnd})) {
                    this.dragItem!.end = newEnd;
                }
            } else {
                const diffUnits = Math.floor((ev.clientX - this.dragStartPosition) / this.positionCalculator.unitWidth);
                this.dragStartStates.forEach((i) => {
                    const item = this.editor.items.find((j) => j.id === i.id)!;
                    if (this.editor.validateItem({...item, start: i.start + diffUnits, end: i.end + diffUnits})) {
                        item.start = i.start + diffUnits;
                        item.end = i.end + diffUnits;
                    }
                });
            }
        }
    }

    onMousedown(ev: MouseEvent) {
        if (!ev.ctrlKey) {
            this.selected = [];
        }
    }

    onMouseup() {
        this.dragItem = null;
        this.isDragging = false;
    }

}
</script>