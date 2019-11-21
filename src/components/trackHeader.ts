import { Track } from "@/model";
import { Drawable } from "@/framework";
import colors from "@/colors";
import { TextStyle, Text } from "pixi.js";

interface ITrackHeaderViewProps {
    track: Track;
    width: number;
}

export default class TrackHeaderView extends Drawable<ITrackHeaderViewProps> {

    protected defaultPropValues = {
        width: 200
    };

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
                .drawRect(0, 0, this.props.width, this.props.track.height)
            .endFill();
        this.text.text = this.props.track.name;
        const textBounds = this.text.getBounds();
        this.text.x = 30;
        this.text.y = (this.props.track.height - textBounds.height) / 2;
    }

    public destroy() {
        this.text.destroy();
        super.destroy();
    }

}
