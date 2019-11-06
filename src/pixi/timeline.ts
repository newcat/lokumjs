import { Application, Graphics, Container } from "pixi.js";
import colors from "@/colors";

export default class Timeline {

    public headerHeight = 20;

    public render(app: Application) {
        const graphics = new Graphics();
        const { width, height } = app.screen;

        // fill background
        graphics
            .beginFill(colors.timeline)
            .drawRect(0, 0, width, height);

        // draw header
        graphics
            .beginFill(colors.header)
            .drawRect(0, 0, width, 30);

        app.stage.addChild(graphics);
    }

}
