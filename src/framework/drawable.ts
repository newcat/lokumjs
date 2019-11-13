import { Graphics, Application } from "pixi.js";
import { observe, Observer } from "./renderProperty";
import { PositionCalculator } from "@/PositionCalculator";
import { EventManager } from "./eventManager";

export interface IRoot {
    app: Application;
    positionCalculator: PositionCalculator;
    eventManager: EventManager;
}

type Props = Record<string, any>;
type ViewConstructor<V extends Drawable> = new (root: IRoot, propValues?: Props) => V;

export abstract class Drawable {

    public graphics: Graphics = new Graphics();
    public needsRender: boolean = true;
    // public props: Props = {};
    public _reactiveProps: string[] = [];

    protected root: IRoot;

    private children: Drawable[] = [];
    private observers: Observer[] = [];

    public constructor(root: IRoot, propValues?: Props) {
        this.root = root;
        this._reactiveProps.forEach((p) => {
            this.addDependency(this, p, true);
        });
        if (propValues) {
            Object.keys(propValues).forEach((k) => {
                (this as any)[k] = propValues[k];
            });
        }
    }

    // tslint:disable-next-line: no-empty
    public setup() { }

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

    protected createView<V extends Drawable>(type: ViewConstructor<V>, propValues?: Props): V {
        const view = new type(this.root, propValues);
        // view.setup();
        return view;
    }

    private doesNeedRender(): boolean {
        return this.needsRender || this.children.some((c) => c.doesNeedRender());
    }

}
