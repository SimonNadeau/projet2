import { Timer } from "../timer/timer";
import { RaceEventInterface } from "./raceEventInterface";

const TIMER_TIME: number = 3;

export class BeforeRaceState implements RaceEventInterface {
    private _timer: Timer;

    public constructor() {
        this._timer = new Timer(TIMER_TIME);
    }

    public update(): void {
        this._timer.update();
    }

    public time(): string[] {
        const timeArray: string[] = new Array<string>();
        this._timer.getTime().forEach((time) => {
            timeArray.push(time.toString());
        });

        return timeArray;
    }

    public setTimer(): void {}

    public isStateFinnished(): boolean {
        return this._timer.isFinished();
    }
}
