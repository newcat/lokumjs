import { IItem, ITrack } from "./types";
import uuidv1 from "uuid/v1";

type AddItemType = Omit<IItem, "id"> & Record<string, any>;

export class Editor {

    /** Component that will be displayed inside the items */
    public itemComponent: any;

    private _tracks: ITrack[] = [];
    private _items: IItem[] = [];

    public get tracks() {
        return this._tracks as ReadonlyArray<ITrack>;
    }

    public get items() {
        return this._items as ReadonlyArray<IItem>;
    }

    public addTrack(name: string): ITrack {
        const t: ITrack = { id: this.generateId(), name, height: 100 };
        this._tracks.push(t);
        return t;
    }

    public removeTrack(id: string) {
        const i = this.tracks.findIndex((t) => t.id === id);
        if (i >= 0) {
            this._tracks.splice(i, 1);
        }
    }

    public addItem(trackId: string, start: number, end: number): IItem|undefined;
    public addItem(item: AddItemType): IItem|undefined;
    public addItem(trackIdOrItem: string|AddItemType, start?: number, end?: number): IItem|undefined {
        let item;
        if (typeof(trackIdOrItem) === "string") {
            item = { id: this.generateId(), track: trackIdOrItem as string, start: start!, end: end!, selected: false };
        } else {
            item = { id: (trackIdOrItem as any).id || this.generateId(), ...trackIdOrItem };
        }
        if (this.validateItem(item)) {
            this._items.push(item);
            return item;
        } else {
            return undefined;
        }
    }

    public removeItem(item: string|IItem) {
        let i = -1;
        if (typeof(item) === "string") {
            i = this.items.findIndex((x) => x.id === item);
        } else {
            i = this.items.indexOf(item);
        }
        if (i >= 0) {
            this._items.splice(i, 1);
        }
    }

    public validateItem(item: IItem) {
        const otherItems = this.items.filter((i) => i.track === item.track && i.id !== item.id);
        return !otherItems.some((i) =>
            (i.start <= item.start && i.end >= item.start) ||
            (i.start <= item.end && i.end >= item.end) ||
            (i.start >= item.start && i.end <= item.end)
        );
    }

    private generateId() {
        return uuidv1();
    }

}
