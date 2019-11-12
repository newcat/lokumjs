export class Event {

    private subscribers = new Map<any, (data?: any) => void>();

    public subscribe(graphicsInstance: any, callback: (data: any) => void) {
        this.subscribers.set(graphicsInstance, callback);
    }

    public unsubscribe(graphicsInstance: any) {
        this.subscribers.delete(graphicsInstance);
    }

    public emit(graphicsInstance: any, data?: any) {
        const subscriber = this.subscribers.get(graphicsInstance);
        if (subscriber) { subscriber(data); }
    }

}
