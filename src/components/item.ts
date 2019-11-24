import { Item, Track } from "@/model";
import colors from "@/colors";
import { Drawable } from "@/framework";
import { Graphics } from "pixi.js";
import { ItemArea } from "@/types";

interface IItemViewProps {
    item: Item;
    track: Track;
}

export class ItemView extends Drawable<IItemViewProps> {

    private leftHandle = new Graphics();
    private rightHandle = new Graphics();

    public setup() {
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;

        this.leftHandle.interactive = true;
        this.leftHandle.cursor = "col-resize";
        this.graphics.addChild(this.leftHandle);

        this.rightHandle.interactive = true;
        this.rightHandle.cursor = "col-resize";
        this.graphics.addChild(this.rightHandle);

        this.root.eventManager.events.pointerdown.subscribe(this.graphics, () => this.onClick("center"));
        this.root.eventManager.events.pointerdown.subscribe(this.leftHandle, () => this.onClick("leftHandle"));
        this.root.eventManager.events.pointerdown.subscribe(this.rightHandle, () => this.onClick("rightHandle"));
        this.addDependency(this.root, "positionCalculator", undefined, true);
    }

    public render() {
        const x = this.root.positionCalculator.getX(this.props.item.start);
        const width = this.root.positionCalculator.getX(this.props.item.end) - x;
        if (this.props.item.selected) {
            this.leftHandle.clear();
            this.rightHandle.clear();
            this.leftHandle
                .lineStyle(2, colors.accent)
                .beginFill(colors.accent)
                    .drawRoundedRect(x - 5, this.props.track.height / 2 - 20, 5, 40, 3)
                .endFill();
            this.rightHandle
                .lineStyle(2, colors.accent)
                .beginFill(colors.accent)
                    .drawRoundedRect(x + width, this.props.track.height / 2 - 20, 5, 40, 3)
                .endFill();
            this.graphics
                .lineStyle(2, colors.accent)
                .beginFill(colors.secondary)
                    .drawRoundedRect(x, 10, width, this.props.track.height - 20, 5)
                .endFill();
            this.leftHandle.visible = true;
            this.rightHandle.visible = true;
        } else {
            this.leftHandle.visible = false;
            this.rightHandle.visible = false;
            this.graphics
                .beginFill(colors.secondary)
                    .drawRoundedRect(x, 10, width, this.props.track.height - 20, 5)
                .endFill();
        }
    }

    private onClick(area: ItemArea) {
        this.root.eventManager.events.itemClicked.emit({ item: this.props.item, area });
    }

}

/*
@Component
export default class ItemView extends Vue {

    @Prop()
    positionCalculator!: PositionCalculator;

    @Prop()
    item!: Item;

    @Prop()
    track!: Track;

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
*/
