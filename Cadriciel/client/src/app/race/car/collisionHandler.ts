import { Car, MAX_SPEED, SOUND_INTENSITY_FACTOR } from "../car/car";
import { FLOOR_NAME, PI_OVER_2, PI } from "../../constants";
import { Collision } from "../car/collision";
import { Intersection } from "three";
import { RenderService } from "../../render-service/render.service";

export const enum BumperSide { Left = 0, Right = 1}
const BUMPER_ROTATION: number = 0.7;
const BUMPER_SPEED_REDUCTION: number = 0.5;

export class CollisionHandler {
    private _collision: Collision;

    public constructor(private _render: RenderService) {
        this._collision = new Collision();
    }

    public update(cars: Car[]): void {
        this._collision.checkCollision(cars);
        this.checkOutside(BumperSide.Left, cars);
        this.checkOutside(BumperSide.Right, cars);
    }

    private checkOutside(bumper: BumperSide, cars: Car[]): void {
        for (const car of cars) {
            const intersect: Intersection[] = (bumper === BumperSide.Left) ?
                car.raycasts.intersection(car.raycasts.raycasterLeft, this._render.scene.children) :
                car.raycasts.intersection(car.raycasts.raycasterRight, this._render.scene.children);

            this.manageBounds(intersect, car, bumper);

        }
    }

    public manageBounds(intersect: Intersection[], car: Car, bumper: BumperSide): void {

        if (intersect.length > 0) {
            if (intersect[0].object.name === FLOOR_NAME) {
                if (bumper === BumperSide.Left && !car.getIsOutside(bumper) && !car.getIsOutside(BumperSide.Right)) {
                    car.mesh.rotateY(PI * 2 - BUMPER_ROTATION);
                } else if (bumper === BumperSide.Right && !car.getIsOutside(bumper) && !car.getIsOutside(BumperSide.Left)) {
                    car.mesh.rotateY(BUMPER_ROTATION);
                } else {
                    car.mesh.rotateY(PI_OVER_2);
                }
                car.limitAudio.setVolume(SOUND_INTENSITY_FACTOR * 2 * car._speed.length() / MAX_SPEED);
                car.limitAudio.play();
                car._speed = car._speed.multiplyScalar( BUMPER_SPEED_REDUCTION );
                car.toggleIsOutside(bumper);

            } else if (intersect[0].object.name !== FLOOR_NAME && car.getIsOutside(bumper)) {
                car.toggleIsOutside(bumper);
            }
        }
    }
}
