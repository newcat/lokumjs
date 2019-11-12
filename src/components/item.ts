import { Item, Track } from "@/model";
import colors from "@/colors";
import { Drawable, RenderProperty } from "@/framework";

export class ItemView extends Drawable {

    @RenderProperty
    item!: Item;

    @RenderProperty
    track!: Track;

    public setup() {
        this.graphics.interactive = true;
        this.graphics.buttonMode = true;
        this.root.eventManager.events.pointerdown.subscribe(this.graphics, this.onClick.bind(this));
    }

    public render() {
        const x = this.root.positionCalculator.getX(this.item.start);
        const width = this.root.positionCalculator.getX(this.item.end) - x;
        if (this.item.selected) {
            this.graphics
                .lineStyle(2, colors.accent)
                .beginFill(colors.secondary)
                    .drawRoundedRect(x, 10, width, this.track.height - 20, 5)
                .endFill()
                .beginFill(colors.accent)
                    .drawRoundedRect(x - 5, this.track.height / 2 - 20, 5, 40, 3)
                    .drawRoundedRect(x + width, this.track.height / 2 - 20, 5, 40, 3)
                .endFill()
                .lineStyle();
        } else {
            this.graphics
                .beginFill(colors.secondary)
                    .drawRoundedRect(x, 10, width, this.track.height - 20, 5)
                .endFill();
        }
    }

    private onClick() {
        this.item.selected = !this.item.selected;
        this.needsRender = true;
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
