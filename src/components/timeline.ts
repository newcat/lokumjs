import { Container, Point } from "pixi.js";
import { Editor } from "../Editor";
import { Drawable, ArrayRenderer } from "@/framework";

import { HeaderView } from "./header";
import { TrackView } from "./track";
import colors from "@/colors";
import { Track, Item } from "@/model";
import { ItemArea } from "@/types";

interface ITimelineViewProps {
    editor: Editor;
    trackHeaderWidth: number;
}

interface IMouseEventData {
    global: Point;
    originalEvent: PointerEvent;
}

export class TimelineView extends Drawable<ITimelineViewProps> {

    private header!: HeaderView;
    private tracks!: ArrayRenderer<Track, TrackView>;
    private trackContainer = new Container();
    private trackOffsets: number[] = [];

    private hoveredTrack: Track|null = null;
    private isDragging = false;
    private dragArea: ItemArea|"" = "";
    private dragItem: Item|null = null;
    private dragStartPosition = 0;
    private dragStartTrack: Track|null = null;
    private dragStartStates: Item[] = [];
    private ctrlPressed = false;

    public setup() {

        this.setDefaultPropValues({ trackHeaderWidth: 200 });
        this.graphics.interactive = true;

        this.header = this.createView(HeaderView, { trackHeaderWidth: this.props.trackHeaderWidth });
        this.tracks = this.createView<ArrayRenderer<Track, TrackView>>(ArrayRenderer);

        this.root.eventManager.events.pointerdown.subscribe(this.graphics, () => {
            this.onMousedown();
        });
        this.root.eventManager.events.pointerup.subscribe(this.graphics, () => {
            this.onMouseup();
        }, true);
        this.root.eventManager.events.pointermove.subscribe(this.graphics, (data) => {
            this.onMousemove(data.data);
        }, true);
        this.root.eventManager.events.keydown.subscribe(this, (ev) => {
            if (ev.key === "Control") { this.ctrlPressed = true; }
        });
        this.root.eventManager.events.keyup.subscribe(this, (ev) => {
            if (ev.key === "Control") { this.ctrlPressed = false; }
        });

        this.root.eventManager.events.itemClicked.subscribe(this, (data) => {
            this.onItemMousedown(data!.item, data!.area);
        });
        this.root.eventManager.events.trackHovered.subscribe(this, (track) => {
            this.hoveredTrack = track;
        });

        this.addChild(this.header);
        this.addChild(this.tracks);
        this.graphics.addChild(this.trackContainer);
        this.trackContainer.addChild(this.tracks.graphics);

        this.tracks.bind(this.props.editor.tracks,
            (newTrack) => this.createView(TrackView, { track: newTrack, headerWidth: this.props.trackHeaderWidth }),
            (trackView, t, i) => { trackView.graphics.y = this.trackOffsets[i]; }
        );

    }

    public render() {

        this.graphics
            .beginFill(colors.timeline)
                .drawRect(0, 0, this.root.app.screen.width, this.root.app.screen.height)
            .endFill();

        this.header.tick();

        this.trackContainer.y = this.header.props.headerHeight;
        this.trackOffsets = this.getTrackOffsets(this.props.editor.tracks);
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

    private getAllItems() {
        return this.props.editor.tracks.flatMap((t) => t.items);
    }

    private getSelectedItems() {
        return this.getAllItems().filter((i) => i.selected);
    }

    private onMousedown() {
        if (!this.ctrlPressed) {
            this.getAllItems().forEach((i) => { i.selected = false; });
        }
        this.isDragging = true;
    }

    private onMousemove(data: IMouseEventData) {
        const x = data.global.x;
        if (this.isDragging) {
            if (this.dragArea === "leftHandle") {
                const newStart = this.root.positionCalculator.getUnit(x);
                const track = this.props.editor.findTrackByItem(this.dragItem!)!;
                if (this.props.editor.validateItem(track, {...this.dragItem!, start: newStart})) {
                    this.dragItem!.start = newStart;
                }
            } else if (this.dragArea === "rightHandle") {
                const newEnd = this.root.positionCalculator.getUnit(x);
                const track = this.props.editor.findTrackByItem(this.dragItem!)!;
                if (this.props.editor.validateItem(track, {...this.dragItem!, end: newEnd})) {
                    this.dragItem!.end = newEnd;
                }
            } else if (this.dragArea === "center") {
                const diffUnits = Math.floor((data.global.x - this.dragStartPosition) / this.root.positionCalculator.unitWidth);

                const startTrackIndex = this.props.editor.tracks.indexOf(this.dragStartTrack!);
                const endTrackIndex = this.props.editor.tracks.indexOf(this.hoveredTrack!);
                let diffTracks = 0;
                if (startTrackIndex >= 0 && endTrackIndex >= 0) {
                    diffTracks = endTrackIndex - startTrackIndex;
                }
                this.dragStartStates.forEach((item) => {
                    const trackIndex = this.props.editor.tracks.findIndex((t) => t.items.some((i) => i.id === item.id));
                    const newTrackIndex = trackIndex + diffTracks;
                    if (newTrackIndex < 0) {
                        diffTracks = -trackIndex;
                    } else if (newTrackIndex >= this.props.editor.tracks.length) {
                        diffTracks = this.props.editor.tracks.length - trackIndex;
                    }
                });

                this.dragStartStates.forEach((i) => {
                    const item = this.getAllItems().find((j) => j.id === i.id)!;
                    const newTrackIndex = this.props.editor.tracks.findIndex((t) => t.items.includes(item)) + diffTracks;
                    if (this.props.editor.validateItem(this.props.editor.tracks[newTrackIndex], {
                        ...item,
                        start: i.start + diffUnits,
                        end: i.end + diffUnits
                    })) {
                        item.start = i.start + diffUnits;
                        item.end = i.end + diffUnits;
                    }
                });
            } else {
                this.root.positionCalculator.offset += data.originalEvent.movementX;
                if (this.root.positionCalculator.offset > 0) {
                    this.root.positionCalculator.offset = 0;
                }
            }
        }
    }

    private onMouseup() {
        this.dragItem = null;
        this.isDragging = false;
        this.dragArea = "";
    }

    private onItemMousedown(item: Item, area: ItemArea) {
        if (area === "center") {
            if (this.ctrlPressed) {
                if (item.selected) {
                    item.selected = false;
                } else {
                    item.selected = true;
                }
            } else if (!item.selected) {
                this.getAllItems().forEach((i) => { i.selected = false; });
                item.selected = true;
            }
        }
        this.dragArea = area;
        this.dragItem = item;
        this.dragStartPosition = this.root.app.renderer.plugins.interaction.mouse.global.x;
        this.dragStartTrack = this.hoveredTrack;
        this.isDragging = true;
        this.dragStartStates = this.getSelectedItems().map((i) => JSON.parse(JSON.stringify(i)));
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
