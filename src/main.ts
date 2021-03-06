import { createTimeline, Editor, Track, Item } from "./lib";
import { Text, TextStyle } from "pixi.js";

const editor = new Editor();

function addTrack() {
    editor.addTrack(new Track("Track " + (editor.tracks.length + 1)));
}

function addItem() {
    editor.tracks[0].items.push(new Item(50, 80, { text: "Item X" }));
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

    const wrapperEl = document.getElementById("wrapper") as HTMLElement;
    const { timeline, root } = await createTimeline(editor, wrapperEl);

    (window as any).$data = timeline;
    document.getElementById("addTrackBtn")?.addEventListener("click", addTrack);
    document.getElementById("addItemBtn")?.addEventListener("click", addItem);

    root.eventManager.events.renderItem.subscribe(Symbol(), ({ item, graphics, width, height }) => {
        graphics
            .beginFill(0xff0000)
                .drawRoundedRect(10, 10, width - 20, height - 20, 5)
            .endFill();
    });

    const style = new TextStyle({ fontSize: 10, fill: 0xffffff });
    const fpsText = new Text("FPS", style);
    fpsText.position.set(10, 10);
    root.app.stage.addChild(fpsText);
    root.app.ticker.add(() => {
        fpsText.text = root.app.ticker.elapsedMS.toFixed(2);
    });

});
