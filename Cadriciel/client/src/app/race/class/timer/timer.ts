import { TimeInterface } from "./timeInterface";

const TIME_SYSTEM: number = 60;

export class Timer implements TimeInterface {
    private _total: number;
    private readonly _initialSeconds: number;

    public get seconds(): number {
        return this._seconds;
    }

    public constructor(private _seconds: number) {
        this._total = this._seconds;
        this._initialSeconds = _seconds;
    }

    public start(): void {

    }

    public reset(): void {
        this._total = 0;
        this._seconds = this._initialSeconds;
    }

    public update(): void {
        if ( ! this.isFinished()) {
            ++ this._total;
            this._seconds = this._initialSeconds - Math.floor(this._total / TIME_SYSTEM) % TIME_SYSTEM;
        }
    }

    public getTime(): number[] {
        const array: number[] = new Array<number>();
        array.push(this.seconds);

        return array;
    }

    public getTimeString(): string {
        return this.seconds.toString();
    }

    public isFinished(): boolean {
        return this._seconds <= 0;
    }
}
