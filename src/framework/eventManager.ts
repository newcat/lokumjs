import { GraphicsEvent, StandardEvent } from "./events";
import { interaction } from "pixi.js";
import { Item } from "@/model";
import { ItemArea } from "@/types";

export class EventManager {

    public events = {
        pointerdown: new GraphicsEvent(),
        itemClicked: new StandardEvent<{ item: Item, area: ItemArea }>()
    };

    public constructor(intMng: interaction.InteractionManager) {
        const that = this;
        intMng.addListener("pointerdown", (data: any) => { that.events.pointerdown.emit(data.target); });
    }

}
