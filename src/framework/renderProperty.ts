import onChange from "on-change";

export function RenderProperty(this: any, target: any, key: string) {

    // property getter
    const getter = function(this: any) {
        return this["_" + key];
    };

    // property setter
    const setter = function(this: any, newVal: any) {
        this.needsRender = true;
        onChange.unsubscribe(this["_" + key]);
        const proxy = onChange(newVal, () => { this.needsRender = true; });
        this["_" + key] = proxy;
    };

    // Delete property.
    if (delete this[key]) {
        // Create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }

}
