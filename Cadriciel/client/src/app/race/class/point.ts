import { Node } from "./node";
import { Mesh, MeshBasicMaterial, CircleGeometry, TextureLoader, Vector3 } from "three";
import { PI_OVER_2 } from "../../constants";

const GREEN: number = 0x00FF11;
const CIRCLE_RADIUS: number = 0.015;
const CIRCLE_SEGMENT: number = 10;
const ROTATION_CONST: number = 3;

export class Point {
    private _meshPoint: Mesh;

    public get meshPoint(): Mesh {
        return this._meshPoint;
    }

    public constructor(public node: Node) {
        this._meshPoint = this.drawTrackNode(GREEN);
    }

    private drawTrackNode(colorId: number): Mesh {
        const loader: TextureLoader = new TextureLoader();
        const pointMaterial: MeshBasicMaterial = (this.node.previousNode === null) ?
            new MeshBasicMaterial( {  map: loader.load("../../assets/camero/raceFlag.jpg")} ) :
            new MeshBasicMaterial( { color: colorId } );

        const curMesh: Mesh = new Mesh( new CircleGeometry(CIRCLE_RADIUS, CIRCLE_SEGMENT), pointMaterial );

        const meshName: string = this.node.previousNode === undefined ? "startNode" : "node";
        curMesh.name = meshName;
        curMesh.rotateX(PI_OVER_2 * ROTATION_CONST);

        curMesh.position.x = this.node.position.x;
        curMesh.position.z = this.node.position.z;
        curMesh.position.y = 1;

        return curMesh;
    }

    public moveTo(newPosition: Vector3): void {
        this.node.position = newPosition;
    }
}
