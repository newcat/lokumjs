import { Graphics, Application } from "pixi.js";
import { observe, Observer } from "./renderProperty";
import { PositionCalculator } from "@/PositionCalculator";

export interface IRoot {
    app: Application;
    positionCalculator: PositionCalculator;
}

type ViewConstructor<V extends Drawable> = new (root: IRoot) => V;

export abstract class Drawable {

    public graphics: Graphics = new Graphics();
    public needsRender: boolean = true;

    private children: Drawable[] = [];
    private observers: Observer[] = [];

    public constructor(protected root: IRoot) { }

    public tick() {
        if (this.doesNeedRender()) {
            this.graphics.clear();
            this.render();
            this.needsRender = false;
        }
    }

    public destroy() {
        this.graphics.destroy();
        this.observers.forEach((o) => o.unregisterWatcher(this));
    }

    public addChild(child: Drawable) {
        this.children.push(child);
        this.graphics.addChild(child.graphics);
    }

    public removeChild(child: Drawable) {
        let i = this.children.indexOf(child);
        if (i >= 0) { this.children.splice(i, 1); }
        i = this.graphics.getChildIndex(child.graphics);
        this.graphics.removeChildAt(i);
    }

    protected abstract render(): void;

    protected addDependency(object: { [k: string]: any }, key: string, deep = false) {
        const observer = observe(object, key, deep);
        observer.registerWatcher(this, () => { this.needsRender = true; });
        this.observers.push(observer);
    }

    protected createView<V extends Drawable>(type: ViewConstructor<V>): V {
        const view = new type(this.root);
        return view;
    }

    private doesNeedRender(): boolean {
        return this.needsRender || this.children.some((c) => c.doesNeedRender());
    }

}
