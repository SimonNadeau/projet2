import { Raycaster, Object3D, Vector3, Intersection } from "three";

const RAYCAST_LEFT: number = 5;
const RAYCAST_RIGHT: number = 6;

export class Raycast {

    private _raycasterLeft: Raycaster;
    private _raycasterRight: Raycaster;

    public constructor() {
        this._raycasterLeft = new Raycaster();
        this._raycasterRight = new Raycaster();
    }

    public get raycasterLeft(): Raycaster {
        return this._raycasterLeft;
    }
    public get raycasterRight(): Raycaster {
        return this._raycasterRight;
    }

    public setAllRaycaster(mesh: Object3D): void {
        this._raycasterLeft.set(mesh.children[RAYCAST_LEFT].getWorldPosition(), new Vector3(0, -1, 0));
        this._raycasterRight.set(mesh.children[RAYCAST_RIGHT].getWorldPosition(), new Vector3(0, -1, 0));
    }
    public intersection(raycaster: Raycaster, object: Object3D[]): Intersection[] {
        return raycaster.intersectObjects(object);
    }
}
