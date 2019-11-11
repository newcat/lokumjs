import uuidv1 from "uuid/v1";
import { Item } from "./item.model";

export class Track {

    public readonly id = uuidv1();
    public name: string;
    public height = 100;
    public items: Item[] = [];

    public constructor(name: string) {
        this.name = name;
    }

}
