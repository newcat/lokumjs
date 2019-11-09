import onChange from "on-change";

export function RenderProperty(this: any, target: any, key: string) {

    // property getter
    const getter = function(this: any) {
        return this["_" + key];
    };

    // property setter
    const setter = function(this: any, newVal: any) {
        const oldVal = this["_" + key];
        if (oldVal === newVal) { return; }
        if (typeof(oldVal) === "object") {
            onChange.unsubscribe(this["_" + key]);
        }
        if (typeof(newVal) === "object") {
            newVal = onChange(newVal, () => { this.needsRender = true; });
        }
        this["_" + key] = newVal;
        this.needsRender = true;
    };

    // Delete property.
    if (delete target[key]) {
        // Create new property with getter and setter
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
        });
    }

}
