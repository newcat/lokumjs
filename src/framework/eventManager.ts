import { Event } from "./event";
import { interaction } from "pixi.js";

export class EventManager {

    public events = {
        pointerdown: new Event()
    };

    public constructor(intMng: interaction.InteractionManager) {
        const that = this;
        intMng.addListener("pointerdown", (data: any) => { that.events.pointerdown.emit(data.target); });
    }

}
