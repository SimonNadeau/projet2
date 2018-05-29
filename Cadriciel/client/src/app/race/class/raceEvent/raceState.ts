import { BeforeRaceState } from "./beforeRace";
import { RaceEventInterface } from "./raceEventInterface";
import { DuringRaceState } from "./duringRace";
import { RenderService } from "../../../render-service/render.service";
import { AfterRaceState } from "./afterRace";
import { SoundService } from "../../../services/sound.service";

export const BEFORE_RACE_NUMBER: number = 1;
export const DURING_RACE_NUMBER: number = 2;
export const AFTER_RACE_NUMBER: number = 3;

export class RaceState {
    private _beforeRaceEvent: BeforeRaceState;
    private _duringRace: DuringRaceState;
    private _afterRace: AfterRaceState;
    private _currentState: RaceEventInterface;
    private _stateNumber: number;
    private _soundService: SoundService;
    private _isStart: boolean = false;

    public get stateNumber(): number {
        return this._stateNumber;
    }

    public constructor(private _render: RenderService) {
        this._beforeRaceEvent = new BeforeRaceState();
        this._duringRace = new DuringRaceState(this._render);
        this._afterRace = new AfterRaceState(this._render);
        this._soundService = new SoundService();
        this._currentState = this._beforeRaceEvent;
        this._stateNumber = 1;
    }

    public update(): void {
        if (this._isStart) {
            this._currentState.update();
            if (this.isStateFinnished()) {
                this.nextState();
            }
        }
    }

    public start(): void {
        this._isStart = true;
    }

    public setTimer(): void {
        this._currentState.setTimer();
    }

    private nextState(): void {
        if ( this._stateNumber === BEFORE_RACE_NUMBER ) {
            this._soundService.initializeStart();
            this._currentState = this._duringRace;
            this._stateNumber = DURING_RACE_NUMBER;
        } else if ( this._stateNumber === DURING_RACE_NUMBER ) {
            this._currentState = this._afterRace;
            this._stateNumber = AFTER_RACE_NUMBER;
        }
    }

    public isStateFinnished(): boolean {
        return this._currentState.isStateFinnished();
    }

    public time(): string[] {
        return this._currentState.time();
    }

    public setEnd(): void {
        this._stateNumber = AFTER_RACE_NUMBER;
    }
}
