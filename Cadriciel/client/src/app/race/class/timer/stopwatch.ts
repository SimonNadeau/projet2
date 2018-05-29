import { TimeInterface, TWO_DIGIT, HUNDRED, TIME_SYSTEM } from "./timeInterface";

export class Stopwatch implements TimeInterface {

    private _minutes: number;
    private _seconds: number;
    private _hundredth: number;
    private _total: number;

    public constructor() {
        this._minutes = 0;
        this._seconds = 0;
        this._hundredth = 0;
        this._total = 0;
    }

    public update(): void {
        ++this._total;
        this._hundredth = Math.floor(this._total % HUNDRED);
        this._seconds = Math.floor(this._total / TIME_SYSTEM) % TIME_SYSTEM;
        this._minutes = Math.floor(this._total / (TIME_SYSTEM * TIME_SYSTEM)) % TIME_SYSTEM;
    }

    public reset(): void {
        this._total = 0;
        this._hundredth = 0;
        this._seconds = 0;
        this._minutes = 0;
    }

    private formatTime(nbr: number): string {
        if (nbr === 0) {
            return "00";
        }
        if (nbr < TWO_DIGIT) {
            return "0" + nbr.toString();
        }

        return nbr.toString();
    }

    public getFormattedMinutes(): string {
        return this.formatTime(this._minutes);
    }

    public getFormattedSeconds(): string {
        return this.formatTime(this._seconds);
    }

    public getFormattedHundredth(): string {
        return this.formatTime(this._hundredth);
    }

    public getTime(): number[] {
        const array: number[] = [];
        if (this._hundredth === 0 && this._seconds === 0 && this._minutes === 0) {
            return array;
        }
        array.push(this._hundredth);
        array.push(this._seconds);
        array.push(this._minutes);

        return array;
    }
}
