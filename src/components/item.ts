import { Component, Vue, Prop, Inject } from "vue-property-decorator";
import { PositionCalculator } from "../PositionCalculator";
import { IItem, ItemArea, ITrack } from "../types";
import { Editor } from "../Editor";
import { CreateElement } from "vue";
import { Graphics } from "pixi.js";
import colors from "@/colors";

@Component
export default class TimelineItem extends Vue {

    @Prop()
    positionCalculator!: PositionCalculator;

    @Prop()
    item!: IItem;

    @Prop()
    track!: ITrack;

    @Prop()
    y!: number;

    @Inject()
    editor!: Editor;

    graphics: Graphics = new Graphics();

    get start() {
        return this.positionCalculator.getX(this.item.start);
    }

    get end() {
        return this.positionCalculator.getX(this.item.end);
    }

    render(h: CreateElement) {
        return h("template", this.$slots.default);
    }

    mounted() {
        (this.$parent as any).registerGraphics(this.graphics);
    }

    updated() {
        this.graphics.clear();

        if (this.item.selected) {
            this.graphics.lineStyle(2, colors.accent);
        }

        this.graphics
            .beginFill(colors.secondary)
                .drawRoundedRect(this.item.start, this.y + 10, this.item.end - this.item.start, this.track.height - 20, 5)
            .endFill();

        if (this.item.selected) {
            this.graphics
                .beginFill(colors.accent)
                    .drawRoundedRect(this.item.start - 5, this.track.height / 2 - 20, 5, 40, 3)
                    .drawRoundedRect(this.item.end, this.track.height / 2 - 20, 5, 40, 3)
                .endFill();
        }
    }

    destroyed() {
        (this.$parent as any).unregisterGraphics(this.graphics);
        this.graphics.destroy();
    }

    get itemComponent() {
        return this.editor.itemComponent;
    }

    mousedown(ev: MouseEvent, area: ItemArea) {
        this.$emit("mousedown", this.item, ev, area);
    }

}
