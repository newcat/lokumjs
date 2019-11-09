import { Drawable, RenderProperty } from "@/framework";
import TrackHeader from "./trackHeader";
import { ITrack } from "@/types";

export class Track extends Drawable {

    @RenderProperty
    public y!: number;

    @RenderProperty
    public headerWidth!: number;

    @RenderProperty
    public track!: ITrack;

    private header = new TrackHeader(this.app);

    public setup() {
        this.header.track = this.track;
        this.graphics.addChild(this.header.graphics);
    }

    protected render(): void {
        this.graphics.y = this.y;
        this.header.width = this.headerWidth;
        this.header.tick();
    }

}
