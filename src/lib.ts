import { TimelineView } from "./components/timeline";
import { Editor } from "./Editor";
import { Application } from "pixi.js";
import { PositionCalculator } from "./PositionCalculator";
import { EventManager } from "./framework";
import { loadTextures } from "./textureManager";

export * from "./Editor";

export async function createTimeline(editor: Editor, wrapperEl: HTMLElement) {

    const app = new Application({
        view: document.getElementById("canvas") as HTMLCanvasElement,
        resizeTo: document.getElementById("wrapper") as HTMLElement,
        antialias: true
    });

    const positionCalculator = new PositionCalculator(app);
    const eventManager = new EventManager(app.renderer.plugins.interaction);
    const textures = await loadTextures();
    const root = { app, positionCalculator, eventManager, textures };

    const timeline = new TimelineView(root, { editor });
    timeline.setup();
    app.stage.addChild(timeline.graphics);
    app.ticker.add(() => timeline.tick());

    // TODO: Only trigger when the current canvas is focused
    window.addEventListener("keydown", (ev) => eventManager.events.keydown.emit(ev));
    window.addEventListener("keyup", (ev) => eventManager.events.keyup.emit(ev));

    return { timeline, root };

}
