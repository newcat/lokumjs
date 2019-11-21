import { Drawable, ArrayRenderer } from "@/framework";
import TrackHeader from "./trackHeader";
import { Track, Item } from "@/model";
import colors from "@/colors";
import { ItemView } from "./item";

export interface ITrackViewProps {
    headerWidth: number;
    track: Track;
}

export class TrackView extends Drawable<ITrackViewProps> {

    private header = this.createView(TrackHeader, { track: this.props.track });
    private items = this.createView<ArrayRenderer<Item, ItemView>>(ArrayRenderer);

    public setup() {
        this.addChild(this.header);
        this.addChild(this.items);

        this.items.bind(this.props.track.items,
            (newItem) => this.createView(ItemView, { item: newItem, track: this.props.track }));
    }

    protected render(): void {

        // top and bottom borders
        this.drawLine(colors.markerLine, 0, 0, this.root.app.screen.width, 0);
        this.drawLine(colors.markerLine, 0, this.props.track.height, this.root.app.screen.width, this.props.track.height);

        // markers
        this.root.positionCalculator.markers
            .filter((m) => m.type === "major")
            .forEach((m) => {
                this.drawLine(colors.markerLine, m.position, 0, m.position, this.props.track.height);
            });

        this.header.props.width = this.props.headerWidth;
        this.header.tick();

        this.items.graphics.x = this.props.headerWidth;
        this.items.tick();

    }

    private drawLine(color: number, x1: number, y1: number, x2: number, y2: number) {
        this.graphics
            .lineStyle(1, color)
            .moveTo(x1, y1)
            .lineTo(x2, y2);
    }

}
