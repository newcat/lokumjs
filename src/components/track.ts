import { Drawable, RenderProperty } from "@/framework";
import TrackHeader from "./trackHeader";
import { Track } from "@/model";
import colors from "@/colors";

export class TrackView extends Drawable {

    @RenderProperty
    public y!: number;

    @RenderProperty
    public headerWidth!: number;

    @RenderProperty
    public track!: Track;

    private header = new TrackHeader(this.app);

    public setup() {
        this.header.track = this.track;
        this.graphics.addChild(this.header.graphics);
        this.addChild(this.header);
        this.addDependency(this.app.screen, "width");
    }

    protected render(): void {

        // top and bottom borders
        this.graphics
            .lineStyle(1, colors.markerLine)
            .moveTo(0, 0)
            .lineTo(this.app.screen.width, 0)
            .moveTo(0, this.track.height)
            .lineTo(this.app.screen.width, this.track.height);

        this.graphics.y = this.y;
        this.header.width = this.headerWidth;
        this.header.tick();
    }

}
