import { Graphics, Application } from "pixi.js";
import { observe, Observer } from "./renderProperty";

const provided = new Map<string, any>();

export function provide(key: string, value: any) {
    provided.set(key, value);
}

export function Inject(key: string) {
    return (target: any, property: string) => {
        const value = provided.get(key);
        if (!value) {
            throw new Error("Unknown key: " + key);
        }
        target[property] = value;
    };
}

export abstract class Drawable {

    public graphics: Graphics = new Graphics();
    public needsRender: boolean = true;

    private children: Drawable[] = [];
    private observers: Observer[] = [];

    public constructor(protected app: Application) { }

    public tick() {
        if (this.doesNeedRender()) {
            this.render();
            this.needsRender = false;
        }
    }

    public destroy() {
        this.graphics.destroy();
        this.observers.forEach((o) => o.unregisterWatcher(this));
    }

    protected abstract render(): void;

    protected addDependency(object: { [k: string]: any }, key: string, deep = false) {
        const observer = observe(object, key);
        observer.registerWatcher(this, () => { this.needsRender = true; });
        this.observers.push(observer);
    }

    protected addChild(child: Drawable) {
        this.children.push(child);
    }

    protected removeChild(child: Drawable) {
        const i = this.children.indexOf(child);
        if (i >= 0) { this.children.splice(i, 1); }
    }

    private doesNeedRender(): boolean {
        return this.needsRender || this.children.some((c) => c.doesNeedRender());
    }

}
