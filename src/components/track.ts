import { Drawable, RenderProperty, ArrayRenderer } from "@/framework";
import TrackHeader from "./trackHeader";
import { Track, Item } from "@/model";
import colors from "@/colors";
import { ItemView } from "./item";

export class TrackView extends Drawable {

    @RenderProperty
    public headerWidth!: number;

    @RenderProperty
    public track!: Track;

    private header = new TrackHeader(this.root);
    private items = this.createView<ArrayRenderer<Item, ItemView>>(ArrayRenderer);

    public setup() {
        this.header.track = this.track;
        this.header.setup();
        this.addChild(this.header);
        this.addChild(this.items);
        this.addDependency(this.root.app.screen, "width");

        this.items.bind(this.track.items,
            (newItem) => {
                const itemView = new ItemView(this.root);
                itemView.track = this.track;
                itemView.item = newItem;
                itemView.setup();
                return itemView;
            }
        );
    }

    protected render(): void {

        // top and bottom borders
        this.drawLine(colors.markerLine, 0, 0, this.root.app.screen.width, 0);
        this.drawLine(colors.markerLine, 0, this.track.height, this.root.app.screen.width, this.track.height);

        // markers
        this.root.positionCalculator.markers
            .filter((m) => m.type === "major")
            .forEach((m) => {
                this.drawLine(colors.markerLine, m.position, 0, m.position, this.track.height);
            });

        this.header.width = this.headerWidth;
        this.header.tick();

        this.items.graphics.x = this.headerWidth;
        this.items.tick();

    }

    private drawLine(color: number, x1: number, y1: number, x2: number, y2: number) {
        this.graphics
            .lineStyle(1, color)
            .moveTo(x1, y1)
            .lineTo(x2, y2);
    }

}
