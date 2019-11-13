import { Container } from "pixi.js";
import { Editor } from "../Editor";
import { Drawable, RenderProperty, ArrayRenderer } from "@/framework";

import { Header } from "./header";
import { TrackView } from "./track";
import colors from "@/colors";
import { Track } from "@/model";

export class Timeline extends Drawable {

    @RenderProperty
    public editor!: Editor;

    @RenderProperty
    public trackHeaderWidth = 200;

    private header = this.createView(Header, { trackHeaderWidth: this.trackHeaderWidth });
    private tracks = this.createView<ArrayRenderer<Track, TrackView>>(ArrayRenderer);
    private trackContainer = new Container();
    private trackOffsets: number[] = [];

    public setup() {
        this.addChild(this.header);
        this.addChild(this.tracks);
        this.graphics.addChild(this.trackContainer);
        this.trackContainer.addChild(this.tracks.graphics);

        this.tracks.bind(this.editor.tracks,
            (newTrack) => {
                const trackView = this.createView(TrackView);
                trackView.track = newTrack;
                trackView.headerWidth = this.trackHeaderWidth;
                trackView.setup();
                return trackView;
            },
            (trackView, t, i) => {
                trackView.graphics.y = this.trackOffsets[i];
            }
        );
    }

    public render() {

        this.graphics
            .beginFill(colors.timeline)
                .drawRect(0, 0, this.root.app.screen.width, this.root.app.screen.height)
            .endFill();

        this.header.tick();

        this.trackContainer.y = this.header.headerHeight;
        this.trackOffsets = this.getTrackOffsets(this.editor.tracks);
        this.tracks.tick();

    }

    private getTrackOffsets(tracks: Track[]) {
        const offsets = [0];
        let prev = 0;
        tracks.forEach((t) => {
            offsets.push(prev += t.height);
        });
        return offsets;
    }

}

/*
@Component
export class OldTimeline extends Vue {

    @Prop()
    @Provide("editor")
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
        const x = ev.pageX - (this.$refs.trackcontainer as HTMLElement).offsetLeft;
        if (this.isDragging) {
            if (this.dragArea === "leftHandle") {
                const newStart = this.positionCalculator.getUnit(x);
                if (this.editor.validateItem({...this.dragItem!, start: newStart})) {
                    this.dragItem!.start = newStart;
                }
            } else if (this.dragArea === "rightHandle") {
                const newEnd = this.positionCalculator.getUnit(x);
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

    onMousewheel(ev: MouseWheelEvent) {
        ev.preventDefault();
        let scrollAmount = ev.deltaY;
        if (ev.deltaMode === 1) {
            scrollAmount *= 32; // Firefox fix, multiplier is trial & error
        }
        if (ev.ctrlKey) {
            // zoom
            const newUnitWidth = this.positionCalculator.unitWidth * (1 - scrollAmount / 3000);
            if (newUnitWidth >= 1) {
                this.positionCalculator.unitWidth = newUnitWidth;
            }
        }
    }

    onResize() {
        this.positionCalculator.visibleWidth = this.$el.clientWidth;
    }

}
*/
