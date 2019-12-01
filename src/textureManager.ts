import { Texture } from "pixi.js";

export interface ITextures {
    close: Texture;
}

export async function loadTextures(): Promise<ITextures> {

    const data = await import("@/assets/close-24px.svg");
    const close = data.default;

    return {
        close: Texture.from(close)
    };

}
