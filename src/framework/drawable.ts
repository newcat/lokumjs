import { Graphics, Application } from "pixi.js";

export abstract class Drawable {

    public graphics: Graphics = new Graphics();
    private needsRender: boolean = false;

    public constructor(protected app: Application) { }

    public tick() {
        if (this.needsRender) {
            this.render();
            this.needsRender = false;
        }
    }

    public destroy() {
        this.graphics.destroy();
    }

    protected abstract render(): void;

}
