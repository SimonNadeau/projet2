import { Point } from "./point";
import { Line, LineBasicMaterial, Geometry } from "three";
import { TRACK_WIDTH } from "./trackGenerator";
import { EDITOR_TO_GAME } from "../../render-service/render.service";

const RED: number = 0xFF0000;
const BLUE: number = 0x0000FF;

const WIDTH_FACTOR: number = 2;
const SQUARED: number = 2;

export class Segment {
    public _isAngleValid: boolean;
    public _isLengthValid: boolean;
    public _isIntersectFree: boolean;
    private _beginPoint: Point;
    private _endPoint: Point;

    public constructor( beginPoint: Point, endPoint: Point ) {
        this._beginPoint = beginPoint;
        this._endPoint = endPoint;
        this._isAngleValid = true;
        this._isLengthValid = false;
        this._isIntersectFree = true;
    }

    public get beginPoint(): Point {
        return this._beginPoint;
    }

    public get endPoint(): Point {
        return this._endPoint;
    }

    public isAllValid(): boolean {
        return this._isAngleValid && this.isLongEnough() && this._isIntersectFree;
    }

    public getLength(): number {
        if ((this._beginPoint !== undefined) && (this._endPoint !== undefined)) {
            const xDeltaSquare: number = (this._beginPoint.node.position.x - this._endPoint.node.position.x) ** SQUARED;
            const yDeltaSquare: number = (this._beginPoint.node.position.y - this._endPoint.node.position.y) ** SQUARED;
            const zDeltaSquare: number = (this._beginPoint.node.position.z - this._endPoint.node.position.z) ** SQUARED;

            return Math.sqrt(xDeltaSquare + yDeltaSquare + zDeltaSquare);
        } else {
            return undefined;
        }
    }

    public isLongEnough(): boolean {
        return this.getLength() >= WIDTH_FACTOR * TRACK_WIDTH / EDITOR_TO_GAME;
    }

    public traceLine(): Line {
        const lineColor: number = this.isAllValid() ? BLUE : RED;
        const lineMaterial: LineBasicMaterial = new LineBasicMaterial({ color: lineColor });
        const lineGeometry: Geometry = new Geometry();

        lineGeometry.vertices.push(this._beginPoint.node.position);
        lineGeometry.vertices.push(this._endPoint.node.position);

        return new Line(lineGeometry, lineMaterial);
    }
}
