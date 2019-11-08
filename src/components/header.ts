import { Drawable, RenderProperty } from "@/framework";
import colors from "@/colors";

export class Header extends Drawable {

    @RenderProperty
    private headerHeight = 20;

    public render() {
        this.graphics
            .beginFill(colors.header)
                .drawRect(0, 0, this.app.screen.width, this.headerHeight)
            .endFill();
    }

}
