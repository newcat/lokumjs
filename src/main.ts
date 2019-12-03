import { TimelineView } from "./components/timeline";
import { Editor } from "./Editor";

import * as PIXI from "pixi.js";
import { Track, Item } from "./model";
import { PositionCalculator } from "./PositionCalculator";
import { EventManager } from "./framework";
import { loadTextures } from "./textureManager";

const editor = new Editor();

function addTrack() {
    editor.addTrack(new Track("Track " + (editor.tracks.length + 1)));
}

window.addEventListener("load", async () => {

    const track1 = new Track("Track 1");
    const track2 = new Track("Track 2");
    const track3 = new Track("Track 3");
    const track4 = new Track("Track 4");
    const track5 = new Track("Track 5");
    const i = new Item(5, 10, { text: "Item 1" });
    i.resizable = false;
    track1.items.push(i);
    track1.items.push(new Item(15, 30, { text: "Item 2" }));
    track2.items.push(new Item(8, 25, { text: "Item 3" }));
    [track1, track2, track3, track4, track5].forEach((t) => {
        t.removable = false;
        editor.addTrack(t);
    });

    const app = new PIXI.Application({
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

    (window as any).$data = timeline;
    window.addEventListener("keydown", (ev) => eventManager.events.keydown.emit(ev));
    window.addEventListener("keyup", (ev) => eventManager.events.keyup.emit(ev));
    document.getElementById("addTrackBtn")?.addEventListener("click", addTrack);

});
