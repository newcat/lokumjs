import onChange from "on-change";

const isObservedSymbol = Symbol();

export class Observer {

    public static isObserver(val: any) {
        return val.isObservedSymbol === isObservedSymbol;
    }

    public static observe(obj: { [k: string]: any }, key: string, deep = false): Observer {

        if (typeof(obj) !== "object") {
            throw new Error("Can't create dependency on value");
        }

        const oldValue = obj[key];
        if (delete obj[key]) {

            let observer: Observer = obj["_" + key];

            // Might already be an observer, if not, create one
            if (!Observer.isObserver(observer)) {
                observer = new Observer(deep);
                observer.setValue(oldValue);
                obj["_" + key] = observer;
            }

            // Create new property with getter and setter
            Object.defineProperty(obj, key, {
                get: () => observer!.getValue(),
                set: (v) => observer!.setValue(v),
                enumerable: true,
                configurable: true
            });

            return observer;

        } else {
            throw new Error("Can't delete property");
        }
    }

    public static observeAll(obj: { [k: string]: any }, deep = false) {
        return Object.keys(obj).map((k) => Observer.observe(obj, k, deep));
    }

    public static subscribeAll(obj: { [k: string]: any }, thisValue: any, callback: () => void) {
        Object.keys(obj).forEach((k) => {
            if (Observer.isObserver(obj[k])) {
                (obj[k] as Observer).registerWatcher(thisValue, callback);
            }
        });
    }

    public static unsubscribeAll(obj: { [k: string]: any }, thisValue: any) {
        Object.keys(obj).forEach((k) => {
            if (Observer.isObserver(obj[k])) {
                (obj[k] as Observer).unregisterWatcher(thisValue);
            }
        });
    }

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
        if (this.deep && Observer.isObserver(this._value)) {
            (this._value as Observer).unregisterWatcher(this);
        }
        if (this.deep && typeof(newVal) === "object") {
            newVal = Observer.observeAll(newVal, this.deep);
            Observer.subscribeAll()
            newVal = onChange(newVal, (path, value, prevValue) => {
                if (value !== prevValue) {
                    console.log(path, prevValue, value);
                    this.invokeWatchers();
                }
            });
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
