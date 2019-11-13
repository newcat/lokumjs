import { Graphics, Text, TextStyle } from "pixi.js";
import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";

export class Header extends Drawable {

    @RenderProperty
    public headerHeight = 30;

    @RenderProperty
    public trackHeaderWidth!: number;

    private markerContainer: Graphics|null = null;
    private textStyle = new TextStyle({ fill: colors.labelsMajor, fontSize: 10 });

    public setup() {
        this.addDependency(this.root.app.screen, "width");
    }

    public render() {

        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.root.app.screen.width, this.headerHeight)
            .endFill();

        const markers = this.root.positionCalculator.getMarkers(5, 3);

        if (this.markerContainer) {
            this.graphics.removeChild(this.markerContainer);
            this.markerContainer.destroy();
        }

        this.markerContainer = new Graphics();
        this.markerContainer.x = this.trackHeaderWidth;
        markers.forEach((m) => {
            if (m.type === "major") {
                const text = new Text(m.unit.toString(), this.textStyle);
                text.anchor.set(0.5, 1);
                text.position.set(m.position, this.headerHeight - 10);
                this.markerContainer!.addChild(text);
            }
            this.markerContainer!
                .beginFill(m.type === "major" ? colors.labelsMajor : colors.labelsMinor)
                    .drawRect(m.position - 2, this.headerHeight - 6, 4, 6)
                .endFill();
        });
        this.graphics.addChild(this.markerContainer);
    }

}
