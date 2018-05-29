import { Segment } from "./segment";
import { TrackInfo } from "./trackInfo";
import { Vector3, Line } from "three";
import { PI_OVER_2 } from "../../constants";
import { LinearFunction } from "./linearFunction";

const MIN_ANGLE: number = 45;
const TWO: number = 2;
const HALF_TURN: number = 180;
export const MINIMUM_SEGMENTS: number = 3;

export class Track {
    private _segments: Segment[];
    private _isOkToSave: boolean;
    private _trackInfo: TrackInfo;
    private _meshIdArray: number[];

    public get trackInfo(): TrackInfo {
        return this._trackInfo;
    }

    public get isOkToSave(): boolean {
        return this._isOkToSave;
    }

    public get segmentArray(): Segment[] {
        return this._segments;
    }

    public get meshIdArray(): number[] {
        return this._meshIdArray;
    }

    public constructor() {
        this._segments = new Array<Segment>();
        this._meshIdArray = new Array<number>();
    }

    public pushSegment(newSegment: Segment): void {
        this._segments.push(newSegment);
        this.validateAllAngles();
        this.validateIntersectionFree();
    }

    public popSegment(): void {
        this._segments.pop();
    }

    public pushId(newMeshId: number): void {
        this._meshIdArray.push(newMeshId);
    }

    private get lastSegment(): Segment {
        return this._segments[this._segments.length - 1];
    }

    public validateAllAngles(): boolean {
        let isValid: boolean = false;

        if (this._segments.length < MINIMUM_SEGMENTS - 1) {
            return false;
        }

        for (let i: number = 0; i < this._segments.length - 1; i++) {
            isValid = this.cosinusLaw(this._segments[i], this._segments[i + 1]) >= MIN_ANGLE;
            if (this._segments[i]._isAngleValid) {
                this._segments[i]._isAngleValid = isValid;
            }
            this._segments[i + 1]._isAngleValid = isValid;
        }

        if (this.lastSegment.endPoint.node.position === this._segments[0].beginPoint.node.position) {
            isValid = this.cosinusLaw(this.lastSegment, this._segments[0]) >= MIN_ANGLE;
            if (this.lastSegment._isAngleValid) {
                this.lastSegment._isAngleValid = isValid;
            }
            if (this._segments[1]._isAngleValid || (!this._segments[1]._isAngleValid && !this._segments[TWO]._isAngleValid)) {
                this._segments[0]._isAngleValid = isValid;
            }
        }

        if (this.lastSegment._isAngleValid && this._segments[1]._isAngleValid) {
            this._segments[0]._isAngleValid = isValid;
        }

        return isValid;
    }

    public validateLength(): boolean {
        let isValid: boolean = true;
        this._segments.forEach((segment) => {
            segment._isLengthValid = segment.isLongEnough();
            if (!segment.isAllValid()) {
                isValid = false;
            }
        });

        return isValid;
    }

    public validateMinimumSegment(): boolean {
        return this._segments.length >= MINIMUM_SEGMENTS;
    }

    public validateIntersectionFree(): boolean {
        let isIntersecting: boolean, returnBool: boolean = false;
        const intersections: boolean[] = new Array<boolean>(this.segmentArray.length);

        intersections.fill(true, 0, intersections.length);

        for (let i: number = 0; i < this.segmentArray.length; i++) {
            for (let j: number = i; j < this.segmentArray.length; j++) {
                const LF1: LinearFunction = new LinearFunction(this.segmentArray[i].beginPoint.node,
                                                               this.segmentArray[i].endPoint.node);
                const LF2: LinearFunction = new LinearFunction(this.segmentArray[j].beginPoint.node,
                                                               this.segmentArray[j].endPoint.node);
                isIntersecting = LF1.isOnSegment(LF2);

                if (isIntersecting) { returnBool = true; }

                if (intersections[i]) {
                    intersections[i] = !isIntersecting;
                }
                if (intersections[j]) {
                    intersections[j] = !isIntersecting;
                }
            }
        }

        for (let i: number = 0; i < this._segments.length; i++) {
            this._segments[i]._isIntersectFree = intersections[i];
        }

        return !returnBool;
    }

    public validateLastNode(): boolean {
        return this._segments[0].beginPoint.node.position === this.lastSegment.endPoint.node.position;
    }

    public updateTrack(): Line[] {
        const lineArray: Line[] = new Array<Line>();
        this._segments.forEach((segment: Segment): void => {
            this.validateAllAngles();
            this.validateIntersectionFree();
            lineArray.push(segment.traceLine());
        });

        return lineArray;
    }

    public checkIfOkTosave(): boolean {
        return this._isOkToSave = this.validateAllAngles()
            && this.validateLength()
            && this.validateMinimumSegment()
            && this.validateIntersectionFree()
            && this.validateLastNode();
    }

    public setBeginNodePosition(segmentIndex: number, newNodeposition: Vector3): void {
        this._segments[segmentIndex].beginPoint.node.position = newNodeposition;
    }

    public setEndNodePosition(segmentIndex: number, newNodeposition: Vector3): void {
        this._segments[segmentIndex].endPoint.node.position = newNodeposition;
    }

    public save(): Array<Array<number>> {
        if (!this._isOkToSave) {
            return [[]];
        }

        const coordinates: Array<Array<number>> = new Array<Array<number>>();

        this._segments.forEach((currentSegment): void => {
            const currentCoordinate: Array<number> = new Array<number>();
            currentCoordinate.push(currentSegment.beginPoint.node.position.x);
            currentCoordinate.push(currentSegment.beginPoint.node.position.y);
            currentCoordinate.push(currentSegment.beginPoint.node.position.z);
            coordinates.push(currentCoordinate);
        });

        return coordinates;
    }

    public isMeshANode(meshId: number): boolean {
        for (let i: number = 0; i < this._meshIdArray.length; i++) {
            if (this.meshIdArray[i] === meshId) {
                return true;
            }
        }

        return false;
    }

    private radToDeg(radAngle: number): number {
        return (radAngle * HALF_TURN) / (PI_OVER_2 * TWO);
    }

    public getDistanceBetween(firstPosition: Vector3, secondPosition: Vector3): number {
        const xDeltaSquare: number = (firstPosition.x - secondPosition.x) ** TWO;
        const yDeltaSquare: number = (firstPosition.y - secondPosition.y) ** TWO;
        const zDeltaSquare: number = (firstPosition.z - secondPosition.z) ** TWO;

        return Math.sqrt(xDeltaSquare + yDeltaSquare + zDeltaSquare);
    }

    public cosinusLaw(firstSegment: Segment, secondSegment: Segment): number {
        if ((firstSegment !== undefined) && (secondSegment !== undefined)) {
            const a: number = firstSegment.getLength();
            const b: number = secondSegment.getLength();
            const c: number = this.getDistanceBetween(firstSegment.beginPoint.node.position, secondSegment.endPoint.node.position);

            const a2: number = Math.pow(a, TWO);
            const b2: number = Math.pow(b, TWO);
            const c2: number = Math.pow(c, TWO);

            const numCosLaw: number = c2 - a2 - b2;
            const denumCosLaw: number = -TWO * a * b;

            return Math.round(this.radToDeg(Math.acos(numCosLaw / denumCosLaw)));
        } else {
            return null;
        }
    }

    public clearSegmentArray(): void {
        while (this.segmentArray.length > 0) {
            this.segmentArray.pop();
        }
    }

    public clearMeshIdArray(): void {
        while (this.meshIdArray.length > 0) {
            this.meshIdArray.pop();
        }
    }
}
