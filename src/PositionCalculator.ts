import { Application } from "pixi.js";

export class PositionCalculator {

    public offset = 0;
    public unitWidth = 10;
    public targetMarkersPer100Pixels = 2;

    constructor(private app: Application) { }

    public getX(units: number) {
        return units * this.unitWidth + this.offset;
    }

    public getUnit(x: number) {
        return Math.floor((x - this.offset) / this.unitWidth);
    }

    public getMarkers(nthUnit: number, majorMultiplier = 1) {
        const markers = [];
        let n = 0;
        let x = 0;
        do {
            x = this.getX(n);
            if (x >= 0 && x < this.app.screen.width) {
                if (n % majorMultiplier === 0) {
                    markers.push({ type: "major", unit: n, position: x });
                } else {
                    markers.push({ type: "minor", unit: n, position: x });
                }
            }
            n += nthUnit;
        } while (x < this.app.screen.width);
        return markers;
    }

}
