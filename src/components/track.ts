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
        this.graphics
            .lineStyle(1, colors.markerLine)
            .moveTo(0, 0)
            .lineTo(this.root.app.screen.width, 0)
            .moveTo(0, this.track.height)
            .lineTo(this.root.app.screen.width, this.track.height);

        this.header.width = this.headerWidth;
        this.header.tick();

        this.items.graphics.x = this.headerWidth;
        this.items.tick();
    }

}
