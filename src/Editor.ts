import { Track, Item } from "./model";

export class Editor {

    public tracks: Track[] = [];

    public validateItem(track: Track, item: Item) {
        return !track.items.some((i) =>
            (i.start <= item.start && i.end >= item.start) ||
            (i.start <= item.end && i.end >= item.end) ||
            (i.start >= item.start && i.end <= item.end)
        );
    }

    public findTrackByItem(item: Item) {
        return this.tracks.find((t) => t.items.includes(item));
    }

}
