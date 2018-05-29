import { Vector3 } from "three";

export class Node {

    public get previousNode(): Node {
        return this._previousNode;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public set position( position: Vector3 ) {
        this._position = position;
    }

    public constructor( private _position: Vector3, private _previousNode: Node ) {}
}
