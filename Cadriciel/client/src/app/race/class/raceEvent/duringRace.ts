import { RaceEventInterface, NBR_LAPS, LAP } from "./raceEventInterface";
import { Stopwatch } from "../timer/stopwatch";
import { RenderService } from "../../../render-service/render.service";
import { Intersection } from "three";
import { STARTING_LINE_NAME } from "../trackGenerator";
import { Car } from "../../car/car";
import { CollisionHandler } from "../../car/collisionHandler";

export class DuringRaceState implements RaceEventInterface {
    private _timer: Stopwatch;
    private _lastDate: number;
    private _collisionHandler: CollisionHandler;
    public isEnd: boolean;

    public constructor(private _render: RenderService) {
        this._timer = new Stopwatch();
        this.isEnd = false;
        this._collisionHandler = new CollisionHandler(this._render);
    }

    // Common functions
    public update(): void {
        const timeSinceLastFrame: number = this.timeSinceLastFrame();
        this._timer.update();
        this._render.car.lapsTime.update();
        this._render.virtualCars.updateTime();
        this._render.car.update(timeSinceLastFrame);
        this._render.virtualCars.update(timeSinceLastFrame);
        this._render.getAllCars().forEach((player) => {
            this.checkStartingLine(player);
        });
        this._collisionHandler.update(this.addAllCars());
    }

    public time(): string[] {
        return [ this._timer.getFormattedHundredth(), this._timer.getFormattedSeconds(), this._timer.getFormattedMinutes()];
    }

    public setTimer(): void {}

    public isStateFinnished(): boolean {  return this.isEnd; }

    // Specific functions
    private timeSinceLastFrame(): number {
        if (this._lastDate !== undefined) {
            const timeSinceLastFrame: number = Date.now() - this._lastDate;
            this._lastDate = Date.now();

            return timeSinceLastFrame;
        } else {
            this._lastDate = Date.now();

            return 0;
        }
    }

    private checkStartingLine(player: Car): void {
        const intersect: Intersection[] = player.raycasts.intersection(player.raycasts.raycasterLeft, this._render.scene.children);

        if (intersect.length > 0) {
            if (intersect[0].object.name === STARTING_LINE_NAME) {
                this.detectStartingLine(player);
            } else {
                player.onStartingLine = false;
            }
        }
    }

    private detectStartingLine(player: Car): void {
        if (!player.onStartingLine) {
            if (!player.onTrack) {
                player.onTrack = true;
            } else {
                this.checkEndOfRace(player);
            }
            player.onStartingLine = true;
        }
    }

    private checkEndOfRace(car: Car): void {
        if (car.lap <= NBR_LAPS) {
            car.addResultFrom(car.lapsTime, (LAP + car.lap.toString()));
            if (this._render.car.lap === NBR_LAPS) {
                if (car === this._render.car) {
                    this.isEnd = true;
                    car.lap++;
                }
            } else if (car.onTrack) {
                car.lapsTime.reset();
                car.lap++;
            }
        }
    }

    private addAllCars(): Car[] {
        const cars: Car[] = [];
        cars.push(this._render.car);
        for (const virtualPlayer of this._render.virtualCars.virtualPlayers) {
            cars.push(virtualPlayer);
        }

        return cars;
    }
}
