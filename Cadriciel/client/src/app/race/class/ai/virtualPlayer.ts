import { Car } from "../../car/car";
import { Vector3 } from "three";
import { PI_OVER_2, STRAIGHT_ANGLE_DEG } from "../../../constants";

const NAME: string = "Virtual Player ";

const MIN_ANGLE: number = 89.9;
const MAX_ANGLE: number = 90.1;
const MIN_SPEED: number = 28;
const MAX_SPEED: number = 50;

const SMALL_RADIUS_FACTOR: number = 4;
const PREVIOUS_POINT_INDEX: number = 0;
const CURRENT_POINT_INDEX: number = 1;
const NEXT_POINT_INDEX: number = 2;
const MAX_TURN_ANGLE: number = 90;
const MAX_BRAKE_DISTANCE: number = 100;
const SMALL_RADIUS_CAP: number  = 16;
const SMALL_RADIUS_MIN: number = 18;

export class VirtualPlayer extends Car {
    private _speedCap: number  = 0;
    private _smallRadius: number;
    private _points: Array<Vector3> = new Array<Vector3>();
    public _id: number;

    private get currentAngle(): number {
        return this.radToDeg(new Vector3().subVectors(this._points[CURRENT_POINT_INDEX],
                                                      this.pos)
            .angleTo((new Vector3(0, 1, 0)).cross(this.direction)));
    }

    public get distanceToNode(): number {
        return this.pos.distanceTo(this._points[CURRENT_POINT_INDEX]);
    }

    private get nextAngle(): number {
        return this.radToDeg(new Vector3().subVectors(this._points[NEXT_POINT_INDEX],
                                                      this._points[CURRENT_POINT_INDEX])
            .angleTo((new Vector3(0, 1, 0)).subVectors(this._points[CURRENT_POINT_INDEX],
                                                       this._points[PREVIOUS_POINT_INDEX])));
    }

    private set smallRadius(angle: number) {
        this._smallRadius = angle / SMALL_RADIUS_FACTOR;
        if (this._smallRadius < SMALL_RADIUS_CAP) {
            this._smallRadius = SMALL_RADIUS_MIN;
        }
    }

    public set spawnPosition(position: Vector3) {
        this._spawnPosition = position;
    }

    public constructor(tmpPoints: Array<Vector3>, initialAngle: number, id: number) {
        super();
        this._directionAngle = initialAngle;
        this.generatePoints(tmpPoints);
        this.smallRadius = this.nextAngle;
        this._id = id;
        this._name = NAME + id.toString();
    }

    private adjust(): void {
        this.adjustDirection();
        this.adjustAcceleration();
    }

    private adjustAcceleration(): void {

        this.adjustSpeedCap();

        if (this.speed.length() <=  this._speedCap) {
            this.releaseBrakes();
            this.isAcceleratorPressed = true;
        }  else {
            this.isAcceleratorPressed = false;
        }
    }

    private adjustSpeedCap(): void {
        if (this.distanceToNode <= MAX_BRAKE_DISTANCE && this.nextAngle > MAX_TURN_ANGLE ||
             this.distanceToNode <= MAX_BRAKE_DISTANCE / 2) {
            this._speedCap = MIN_SPEED;
            this.isAcceleratorPressed = false;
            this.brake();
        }  else {
            this._speedCap = MAX_SPEED;
        }
    }

    private  adjustDirection(): void {
        if (this.currentAngle < MIN_ANGLE) {
            this.steerLeft();
        } else if (this.currentAngle > MAX_ANGLE) {
            this.steerRight();
        }
    }

    private generatePoints(tmpPoints: Array<Vector3>): void {
        for (let i: number = 0; i < tmpPoints.length; i++) {
            this._points[i] = new Vector3(tmpPoints[i].x,
                                          tmpPoints[i].y,
                                          -tmpPoints[i].z);
        }
    }

    private radToDeg(radAngle: number): number {
        return (radAngle * STRAIGHT_ANGLE_DEG) / (PI_OVER_2 * 2);
    }

    public inSmallCircle(): boolean {
        return this.distanceToNode < this._smallRadius;
    }

    public isAligned(): boolean {
        return (this.currentAngle >= MIN_ANGLE && this.currentAngle <= MAX_ANGLE);
    }

    public update(timeSinceLastFrame: number): void {
        if (!this.isAligned()) {
            this.adjust();
        }
        if (this.inSmallCircle()) {
          this.updateToNewPoint();
        }
        super.update(timeSinceLastFrame);
    }

    public updateToNewPoint(): void {
        this._points.push(this._points.shift());
        this.smallRadius = this.nextAngle;
    }
}
