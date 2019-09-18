<template lang="pug">
.timeline
    .timeline-track(
        v-for="t in tracks",
        :key="t"
        @mouseenter="hoveredTrack = t"
        @mouseleave="hoveredTrack = ''"
    )
        timeline-item(
            v-for="item, i in getItems(t)",
            :key="i",
            :position-calculator="positionCalculator",
            :item="item"
            :selected="selected.includes(item.id)"
            @mousedown="onItemMousedown"
        )
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PositionCalculator } from "../PositionCalculator";

import TimelineItem from "./Item.vue";
import { IItem, DragDirection, IViewItem, ItemArea } from "../types";

@Component({
    components: { TimelineItem }
})
export default class Timeline extends Vue {

    positionCalculator = new PositionCalculator(10);

    items: IItem[] = [
        { id: "item0", track: "track0", start: 5, end: 10 },
        { id: "item1", track: "track0", start: 12, end: 24 },
        { id: "item2", track: "track1", start: 5, end: 24 }
    ];

    tracks = [ "track0", "track1" ];

    selected: string[] = [];

    hoveredTrack = "";
    isDragging = false;
    dragArea: ItemArea = "center";
    dragItem: IItem|null = null;
    dragStartPosition = { x: 0, y: 0 };
    dragStartStates: IItem[] = [];

    get markers() {
        return this.positionCalculator.getMarkers(2);
    }

    get viewItems(): IViewItem[] {
        return this.items.map((i) => {
            const vi = i as IViewItem;
            vi.inDanger = vi.inDanger || false;
            vi.selected = vi.selected || false;
            return vi;
        });
    }

    getItems(track: string) {
        return this.items.filter((i) => i.track === track);
    }

    onItemMousedown(item: IItem, ev: MouseEvent, area: ItemArea) {
        if (area === "center") {
            if (ev.ctrlKey) {
                if (this.selected.includes(item.id)) {
                    this.selected.splice(this.selected.indexOf(item.id));
                } else {
                    this.selected.push(item.id);
                }
            } else {
                this.selected = [item.id];
            }
        }
        this.dragArea = area;
        this.dragItem = item;
        this.isDragging = true;
        this.dragStartStates = this.items.map((i) => JSON.parse(JSON.stringify(i)));
    }

    onMousemove(ev: MouseEvent) {
        if (this.isDragging) {
            if (this.dragArea === "leftHandle") {
                this.dragItem!.start = this.positionCalculator.getX
            }
        }
    }

    onMouseup() {
        this.dragItem = null;
        this.isDragging = false;
    }

}
</script>