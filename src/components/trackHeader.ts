import { ITrack } from "../types";
import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";

export default class TrackHeader extends Drawable {

    @RenderProperty
    public track!: ITrack;

    @RenderProperty
    public width: number = 200;

    render() {
        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.width, this.track.height)
            .endFill();
    }

}
