import { Points, Geometry, Vector3 } from "three";

const BUMPER_Z: number = -1.7;
const BUMPER_X: number = 0.5;
const BUMPER_LEFT_NAME: string = "Bumper Left";
const BUMPER_RIGHT_NAME: string = "Bumper Right";

export class BoundsBumpers {
    private _LeftPoints: Points;
    private _rightPoints: Points;

    public constructor() {
        this._LeftPoints = this.bumperInit(new Vector3(- BUMPER_X, 2, BUMPER_Z), BUMPER_LEFT_NAME);
        this._rightPoints = this.bumperInit(new Vector3(BUMPER_X, 2, BUMPER_Z), BUMPER_RIGHT_NAME);
    }
    public add(): Points[] {
        return [this._LeftPoints, this._rightPoints];
    }

    private bumperInit(vector: Vector3, name: string): Points {
        const geo: Geometry = new Geometry();
        geo.vertices.push(new Vector3(0, 0, 0));
        const bumper: Points = new Points(geo);
        bumper.translateX(vector.x);
        bumper.translateY(vector.y);
        bumper.translateZ(vector.z);
        bumper.visible = false;
        bumper.name = name;

        return bumper;
    }
}
