import { Drawable } from "./drawable";

export class ArrayRenderer<T, V extends Drawable> extends Drawable {

    private views = new Map<any, V>();
    private array!: T[];
    private onNewItem!: (newItem: T, index: number, array: T[]) => V;
    private onRender?: (view: V, item: T, index: number, array: T[]) => any;
    private idFn?: (item: T) => any;

    public bind(
        array: T[],
        onNewItem: (newItem: T, index: number, array: T[]) => V,
        onRender?: (view: V, item: T, index: number, array: T[]) => any,
        idFn?: (item: T) => any
    ) {
        this.array = array;
        this.onNewItem = onNewItem;
        this.onRender = onRender;
        this.idFn = idFn;
    }

    public render() {

        console.log(this.array.map((x: any) => x.id));

        this.array.forEach((item, index, array) => {
            console.log((item as any).id);
            const id = this.getId(item);
            let view = this.views.get(id);
            if (!view) {
                view = this.onNewItem(item, index, array);
                this.views.set(id, view);
                this.addChild(view);
            }
            if (this.onRender) { this.onRender(view, item, index, array); }
            view.tick();
        });

        console.log("Completed foreach");

        const removedTracks = Array.from(this.views.keys())
            .filter((id) => !this.array.find((x) => id === this.getId(x)));
        removedTracks.forEach((t) => {
            const view = this.views.get(t)!;
            this.removeChild(view);
            view.destroy();
        });

    }

    private getId(item: T) {
        return this.idFn ? this.idFn(item) : item;
    }

}
