import { RaceEventInterface } from "./raceEventInterface";
import { RenderService } from "../../../render-service/render.service";

const TIME_00: string = "00";

export class AfterRaceState implements RaceEventInterface {

    public constructor(private _render: RenderService) {}

    public update(): void {
        this._render.car.engineAudio.pause();
        this._render.virtualCars.virtualPlayers.forEach((virtualPlayer) => {
            virtualPlayer.engineAudio.pause();
        });
    }

    public time(): string[] {
        return [TIME_00, TIME_00, TIME_00];
    }

    public setTimer(): void {}

    public isStateFinnished(): boolean {
        return false;
    }

}
