import { TypingHandler } from "./typing-handler";
import { Car } from "../car/car";

const LEFT_KEYCODE: number = 65;        // A
const RIGHT_KEYCODE: number = 68;       // D

const ACCELERATE_KEYCODE: number = 87;  // W
const BRAKE_KEYCODE: number = 83;       // S

export const STEERINGCODES: number[] = [LEFT_KEYCODE, RIGHT_KEYCODE, ACCELERATE_KEYCODE, BRAKE_KEYCODE];

export class SteeringHandler implements TypingHandler {

    public constructor(private _car: Car) {}

    public handleKeyDown(eventCode: number): void {
        switch (eventCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = true;
                break;
            case LEFT_KEYCODE:
                this._car.steerLeft();
                break;
            case RIGHT_KEYCODE:
                this._car.steerRight();
                break;
            case BRAKE_KEYCODE:
                this._car.brake();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(eventCode: number): void {
        switch (eventCode) {
            case ACCELERATE_KEYCODE:
                this._car.isAcceleratorPressed = false;
                break;
            case LEFT_KEYCODE:
            case RIGHT_KEYCODE:
                this._car.releaseSteering();
                break;
            case BRAKE_KEYCODE:
                this._car.releaseBrakes();
                break;
            default:
                break;
        }
    }
}
