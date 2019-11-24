import { GraphicsEvent, StandardEvent } from "./events";
import { interaction } from "pixi.js";
import { Item, Track } from "@/model";
import { ItemArea } from "@/types";

export class EventManager {

    public events = {
        pointerdown: new GraphicsEvent(),
        pointerup: new GraphicsEvent(),
        pointermove: new GraphicsEvent(),
        pointerover: new GraphicsEvent(),
        pointerout: new GraphicsEvent(),
        itemClicked: new StandardEvent<{ item: Item, area: ItemArea }>(),
        trackHovered: new StandardEvent<Track>(),
        keydown: new StandardEvent<KeyboardEvent>(),
        keyup: new StandardEvent<KeyboardEvent>()
    };

    public constructor(intMng: interaction.InteractionManager) {
        const that = this;
        intMng.addListener("pointerdown", (data: any) => { that.events.pointerdown.emit(data.target, data); });
        intMng.addListener("pointerup", (data: any) => { that.events.pointerup.emit(data.target, data); });
        intMng.addListener("pointermove", (data: any) => { that.events.pointermove.emit(data.target, data); });
        intMng.addListener("pointerover", (data: any) => { that.events.pointerover.emit(data.target, data); });
        intMng.addListener("pointerout", (data: any) => { that.events.pointerout.emit(data.target, data); });
    }

}