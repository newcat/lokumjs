import { Track } from "@/model";
import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";
import { TextStyle, Text } from "pixi.js";

export default class TrackHeader extends Drawable {

    @RenderProperty
    public track!: Track;

    @RenderProperty
    public width: number = 200;

    private style = new TextStyle({
        fill: colors.text,
        fontWeight: "bold"
    });

    private text = new Text("Test", this.style);

    public setup() {
        this.graphics.addChild(this.text);
    }

    render() {
        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.width, this.track.height)
            .endFill();
        this.text.text = this.track.name;
        const textBounds = this.text.getBounds();
        this.text.x = 30;
        this.text.y = (this.track.height - textBounds.height) / 2;
    }

    public destroy() {
        this.text.destroy();
        super.destroy();
    }

}
