import uuidv1 from "uuid/v1";

export class Item {

    public id = uuidv1();
    public start: number;
    public end: number;
    public selected = false;
    public data?: Record<string, any>;

    public constructor(start: number, end: number, data?: Record<string, any>) {
        this.start = start;
        this.end = end;
        this.data = data;
    }

}
