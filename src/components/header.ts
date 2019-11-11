import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";

export class Header extends Drawable {

    @RenderProperty
    public headerHeight = 30;

    public setup() {
        this.addDependency(this.root.app.screen, "width");
    }

    public render() {
        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.root.app.screen.width, this.headerHeight)
            .endFill();
    }

}
