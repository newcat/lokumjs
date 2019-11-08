import { ITrack } from "../types";
import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";

export default class TrackHeader extends Drawable {

    @RenderProperty
    public track!: ITrack;

    @RenderProperty
    public headerWidth!: number;

    render() {
        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.headerWidth, this.track.height)
            .endFill();
    }

}
