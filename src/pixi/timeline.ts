import { Application, Graphics } from "pixi.js";
import colors from "@/colors";

export default class Timeline {

    public headerHeight = 30;

    public tracks = [
        {
            height: 100,
            items: [
                { start: 300, end: 600 }
            ]
        },
        { height: 150, items: [] },
        { height: 100, items: [] },
    ];

    public render(app: Application) {
        const graphics = new Graphics();
        const { width, height } = app.screen;

        // fill background
        graphics
            .beginFill(colors.timeline)
            .drawRect(0, 0, width, height)
            .endFill();

        // draw header
        graphics
            .beginFill(colors.header)
            .drawRect(0, 0, width, this.headerHeight)
            .endFill();

        const trackGraphics = new Graphics();
        trackGraphics.position.y = this.headerHeight;

        // draw markers
        // TODO

        let y = 0;
        for (const t of this.tracks) {
            trackGraphics.beginFill(colors.secondary);
            for (const item of t.items) {
                trackGraphics.lineStyle(2, colors.accent);
                trackGraphics.drawRoundedRect(item.start, y + 10, item.end - item.start, t.height - 20, 5);
                trackGraphics.beginFill(colors.accent);
                trackGraphics.drawRoundedRect(item.start - 5, t.height / 2 - 20, 5, 40, 3);
                trackGraphics.drawRoundedRect(item.end, t.height / 2 - 20, 5, 40, 3);
                trackGraphics.endFill();
            }
            trackGraphics.endFill();

            y += t.height;
            trackGraphics.lineStyle(1, colors.markerLine).moveTo(0, y).lineTo(width, y);
        }

        graphics.addChild(trackGraphics);
        app.stage.addChild(graphics);
    }

}
