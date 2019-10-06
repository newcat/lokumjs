<template lang="pug">
.timeline(
    @mouseup="onMouseup",
    @mousedown="onMousedown",
    @mouseleave="onMouseup"
    @contextmenu.prevent="openContextMenu"
)
    timeline-header(:markers="markers", :labelfun="(u) => u + 's'")
    .item-container
        .marker-line(
            v-for="m in majorMarkers",
            :key="m.unit",
            :style="{ transform: `translateX(${m.position}px)` }"
        )
        .timeline-track(
            v-for="t in editor.tracks",
            :key="t.id"
            @mouseenter="hoveredTrack = t"
            @mouseleave="hoveredTrack = ''"
            @mousemove="onMousemove"
        )
            timeline-item(
                v-for="item in getItems(t.id)",
                :key="item.id",
                :position-calculator="positionCalculator",
                :item="item"
                :selected="selected.includes(item.id)"
                @mousedown="onItemMousedown"
                @remove="editor.removeItem(item)"
            )
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { PositionCalculator } from "../PositionCalculator";

import ContextMenu from "./ContextMenu.vue";
import TimelineHeader from "./Header.vue";
import TimelineItem from "./Item.vue";
import { Editor } from "../Editor";
import { IItem, DragDirection, IViewItem, ItemArea, ITrack } from "../types";

@Component({
    components: { ContextMenu, TimelineHeader, TimelineItem }
})
export default class Timeline extends Vue {

    @Prop()
    editor!: Editor;

    positionCalculator = new PositionCalculator(10);

    selected: string[] = [];

    hoveredTrack: ITrack|null = null;
    isDragging = false;
    dragArea: ItemArea|"" = "";
    dragItem: IItem|null = null;
    dragStartPosition = 0;
    dragStartTrack: ITrack|null = null;
    dragStartStates: IItem[] = [];

    contextMenu = {
        x: 0,
        y: 0,
        open: false,
        items: [
            { label: "Add Item", submenu: [
                { label: "TestItem", value: "AddTestItem" }
            ] }
        ]
    };

    get markers() {
        return this.positionCalculator.getMarkers(5, 3);
    }

    get majorMarkers() {
        return this.markers.filter((m) => m.type === "major");
    }

    mounted() {
        window.addEventListener("resize", () => this.onResize());
        this.onResize();
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
            } else if (this.dragArea === "center") {
                const diffUnits = Math.floor((ev.clientX - this.dragStartPosition) / this.positionCalculator.unitWidth);

                const startTrackIndex = this.editor.tracks.indexOf(this.dragStartTrack!);
                const endTrackIndex = this.editor.tracks.indexOf(this.hoveredTrack!);
                let diffTracks = 0;
                if (startTrackIndex >= 0 && endTrackIndex >= 0) {
                    diffTracks = endTrackIndex - startTrackIndex;
                }
                this.dragStartStates.forEach((i) => {
                    const trackIndex = this.editor.tracks.findIndex((t) => i.track === t.id);
                    const newTrackIndex = trackIndex + diffTracks;
                    if (newTrackIndex < 0) {
                        diffTracks = -trackIndex;
                    } else if (newTrackIndex >= this.editor.tracks.length) {
                        diffTracks = this.editor.tracks.length - trackIndex;
                    }
                });

                this.dragStartStates.forEach((i) => {
                    const item = this.editor.items.find((j) => j.id === i.id)!;
                    const newTrackIndex = this.editor.tracks.findIndex((t) => t.id === i.track) + diffTracks;
                    const newTrackId = this.editor.tracks[newTrackIndex].id;
                    if (this.editor.validateItem({
                        ...item,
                        start: i.start + diffUnits,
                        end: i.end + diffUnits,
                        track: newTrackId
                    })) {
                        item.start = i.start + diffUnits;
                        item.end = i.end + diffUnits;
                        item.track = newTrackId;
                    }
                });
            } else {
                this.positionCalculator.offset += ev.movementX;
                if (this.positionCalculator.offset > 0) {
                    this.positionCalculator.offset = 0;
                }
            }
        }
    }

    onMousedown(ev: MouseEvent) {
        if (!ev.ctrlKey) {
            this.selected = [];
        }
        this.isDragging = true;
    }

    onMouseup() {
        this.dragItem = null;
        this.isDragging = false;
        this.dragArea = "";
    }

    onResize() {
        this.positionCalculator.visibleWidth = this.$el.clientWidth;
    }

    openContextMenu(event: MouseEvent) {
        this.contextMenu.open = true;
        this.contextMenu.x = event.clientX;
        this.contextMenu.y = event.clientY;
    }

}
</script>