import { Graphics, Text, TextStyle } from "pixi.js";
import { Drawable } from "../framework";
import colors from "../colors";

interface IHeaderViewProps {
    headerHeight: number;
    trackHeaderWidth: number;
}

export class HeaderView extends Drawable<IHeaderViewProps> {

    private markerContainer: Graphics|null = null;
    private textStyle = new TextStyle({ fill: colors.labelsMajor, fontSize: 10 });

    public setup() {
        this.setDefaultPropValues({ headerHeight: 30 });
        this.addDependency(this.root, "positionCalculator", undefined, true);
        this.addDependency(this.root.app.renderer, "screen", "width");
    }

    public render() {

        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.root.app.screen.width, this.props.headerHeight)
            .endFill();

        const markers = this.root.positionCalculator.markers;

        if (this.markerContainer) {
            this.graphics.removeChild(this.markerContainer);
            this.markerContainer.destroy();
        }

        this.markerContainer = new Graphics();
        this.markerContainer.x = this.props.trackHeaderWidth;
        markers.forEach((m) => {
            if (m.type === "major") {
                const text = new Text(m.unit.toString(), this.textStyle);
                text.anchor.set(0.5, 1);
                text.position.set(m.position, this.props.headerHeight - 10);
                this.markerContainer!.addChild(text);
            }
            this.markerContainer!
                .beginFill(m.type === "major" ? colors.labelsMajor : colors.labelsMinor)
                    .drawRect(m.position - 2, this.props.headerHeight - 6, 4, 6)
                .endFill();
        });
        this.graphics.addChild(this.markerContainer);
    }

}
