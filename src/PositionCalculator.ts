export class PositionCalculator {

    public visibleWidth = 0;
    public offset = 0;
    public unitWidth = 10;

    constructor(unitWidth: number) {
        this.unitWidth = unitWidth;
    }

    public getX(units: number) {
        return units * this.unitWidth + this.offset;
    }

    public getUnit(x: number) {
        return Math.floor((x - this.offset) / this.unitWidth);
    }

    public getMarkers(nthUnit: number) {
        const markers = [];
        let n = 0;
        let x = 0;
        do {
            x = this.getX(n);
            if (x > 0 && x < this.visibleWidth) {
                markers.push(x);
            }
            n += nthUnit;
        } while (x < this.visibleWidth);
        return markers;
    }

}
