import onChange from "on-change";

const isObservedSymbol = Symbol();

export class Observer {

    public isObservedSymbol = isObservedSymbol;

    private _value: any;
    private deep: boolean;
    private watchers = new Map<symbol, () => void>();

    public constructor(deep: boolean) {
        this.deep = deep;
    }

    public getValue(): any {
        return this._value;
    }

    public setValue(newVal: any) {
        if (this._value === newVal) { return; }
        if (this.deep && typeof(this._value) === "object") {
            onChange.unsubscribe(this._value);
        }
        if (this.deep && typeof(newVal) === "object") {
            newVal = onChange(newVal, () => { this.invokeWatchers(); });
        }
        this._value = newVal;
        this.invokeWatchers();
    }

    public registerWatcher(thisValue: any, callback: () => void) {
        this.watchers.set(thisValue, callback);
    }

    public unregisterWatcher(thisValue: any) {
        this.watchers.delete(thisValue);
    }

    private invokeWatchers() {
        this.watchers.forEach((w, t) => w.call(t));
    }

}

export function observe(obj: { [k: string]: any }, key: string, deep = false): Observer {

    if (typeof(obj) !== "object") {
        throw new Error("Can't create dependency on value");
    }

    const oldValue = obj[key];
    if (delete obj[key]) {

        let observer: Observer = obj["_" + key];

        // Might already be an observer, if not, create one
        if (!observer || observer.isObservedSymbol === isObservedSymbol) {
            observer = new Observer(deep);
            observer.setValue(oldValue);
            obj["_" + key] = observer;
        }

        // Create new property with getter and setter
        Object.defineProperty(obj, key, {
            get: () => observer.getValue(),
            set: (v) => observer.setValue(v),
            enumerable: true,
            configurable: true
        });

        return observer;

    } else {
        throw new Error("Can't delete property");
    }
}

export function RenderProperty<T extends { needsRender: boolean; }>(target: T, key: string) {
    const observer = observe(target, key);
    observer.registerWatcher(target, function(this: T) { this.needsRender = true; });
}
