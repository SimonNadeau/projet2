import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { Intersection, Raycaster, Line,
    WebGLRenderer, Scene, AmbientLight, MeshBasicMaterial, Mesh, PlaneGeometry,
    Vector2, Vector3, Object3D, TextureLoader} from "three";
import { PI_OVER_2, FLOOR_NAME } from "../../constants";
import { Node } from "../class/node";
import { Point } from "../class/point";
import { Segment } from "../class/segment";
import { Track, MINIMUM_SEGMENTS } from "../class/track";
import { TrackEditorCamera } from "../class/camera/trackEditorCamera";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const PLANE_DIMENSION: number = 2;
const FLOOR_ROTATION: number = 3;
const MINIMUM_DRAG_DISTANCE: number = 0.000000000000000001;
const STARTING_POINT: string = "startPoint";
const POINT: string = "point";

@Injectable()
export class TrackEditorRenderService {
    protected renderer: WebGLRenderer;
    protected stats: Stats;
    protected lastDate: number;
    private camera: TrackEditorCamera;
    private container: HTMLDivElement;
    private scene: THREE.Scene;
    private raycaster: Raycaster;
    private _mouse: Vector2;
    private _endTrack: boolean;
    private _firstPoint: Point;
    private dragElement: Intersection;
    public track: Track;
    public clickAction: boolean;

    public constructor() {
        this.clickAction = true;
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        document.addEventListener("contextmenu", (e) => { e.preventDefault(); }, false);

        this._endTrack = false;

        await this.createScene();
        this.startRenderingLoop();
    }

    protected async createScene(): Promise<void> {
        this.scene = new Scene();
        this.camera = new TrackEditorCamera();
        this.camera.initialized();

        this.raycaster = new Raycaster();
        this.track = new Track();
        this._mouse = new Vector2();

        const floor: Mesh = this.floorGenerator();

        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.scene.add( floor );
    }

    private floorGenerator(): Mesh {
        const loader: TextureLoader = new TextureLoader();
        const plane: PlaneGeometry = new PlaneGeometry( PLANE_DIMENSION, PLANE_DIMENSION, 0, 0 );
        const material: MeshBasicMaterial = new MeshBasicMaterial( {  map: loader.load("../../assets/camero/gazon.jpg")} ) ;
        const floor: Mesh = new Mesh( plane, material);

        floor.translate(1, new Vector3(0, -1, 0));

        floor.name = FLOOR_NAME;

        floor.rotateX(PI_OVER_2 * FLOOR_ROTATION);

        return floor;
    }

    public loadTrack(positions: Array<Array<number>>): void {
        const positionVectors: Array<Vector3> = new Array<Vector3>();
        positions.forEach((array) => {
            positionVectors.push(new Vector3(array[0], array[1], array[2]));
        });
        for (const node of positionVectors) {
            this.addNode(node);
        }
        this.finishTrack();
        this.updateLines();
    }

    private checkObjIntersection(mouse: Vector2): Intersection[] {
      this.raycaster.setFromCamera(mouse, this.camera.getCamera());

      return this.raycaster.intersectObjects(this.scene.children);
    }

    private checkFloorIntersection(mouse: Vector2): Intersection[] {
        this.raycaster.setFromCamera(mouse, this.camera.getCamera());

        return this.raycaster.intersectObject(this.scene.getObjectByName(FLOOR_NAME), true);
    }

    public addNode(position: Vector3): void {
        let addedMesh: Mesh; let newNode: Node; let newPoint: Point;

        if (this._firstPoint === undefined) {
            newNode = new Node(position, null);
            this._firstPoint = new Point(newNode);
            addedMesh = this._firstPoint.meshPoint;
            addedMesh.name = STARTING_POINT;

        } else {
            if (this.track.segmentArray.length === 0) {
                newNode = new Node( position, this._firstPoint.node);
                newPoint = new Point(newNode);
                this.track.pushSegment(new Segment(this._firstPoint, newPoint));
            } else {
                newNode = new Node( position, this.track.segmentArray[this.track.segmentArray.length - 1].endPoint.node);
                newPoint = new Point(newNode);
                this.track.pushSegment(new Segment(this.track.segmentArray[this.track.segmentArray.length - 1].endPoint, newPoint));
            }

            this.scene.add( this.track.segmentArray[this.track.segmentArray.length - 1].traceLine());
            addedMesh = newPoint.meshPoint;
            addedMesh.name = POINT;
        }

        this.track.pushId(addedMesh.id);
        this.scene.add(addedMesh);

    }

    public onClick( event: MouseEvent ): void {
        if (event.which === 1) {
            this.updateMouse(event);

            const intersects: Intersection[] = this.checkFloorIntersection(this._mouse);

            if ((intersects.length > 0) && !this._endTrack) {
                this.addNode(new Vector3(intersects[0].point.x, 0, intersects[0].point.z));
            }
        }
        this.updateLines();
    }

    private okToFinish(click: boolean): boolean {
        const intersects: Intersection[] = this.checkObjIntersection(this._mouse);

        return click && !this._endTrack && intersects.length > 0
            && this.track.segmentArray.length >= MINIMUM_SEGMENTS - 1
            && intersects[0].object.name === STARTING_POINT;
    }

    public mouseUp(event: MouseEvent, click: boolean): void {
        if (event.which === 1) {
            if (this.okToFinish(click)) {
                    this.finishTrack();
            }
        }
    }

    public undoLastNode(event: MouseEvent): void {
        if (this.numberOfPoints > 1) {
            this.track.segmentArray.pop();
            this.popLastLines();

            if (this._endTrack) {
                this._endTrack = false;
            } else {
                this.track.meshIdArray.pop();
            }
        } else {
            const popedObject: Object3D = this.scene.children.pop();
            if (popedObject.name === FLOOR_NAME) {
                this.scene.add(popedObject);
            }
            this.deleteFirstPoint();
            this.track.meshIdArray.pop();
        }
        this.updateLines();
    }

    private popLastLines(): void {
        if (this.track.meshIdArray.length > 0) {
            this.scene.children.pop();
            if (!this._endTrack) {
                this.scene.children.pop();
            }
        }
    }

    public updateMouse(event: MouseEvent): void {
        this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this._mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }

    public finishTrack(): void {
        if (!this._endTrack) {
            const beginPoint: Point = this.track.segmentArray[this.track.segmentArray.length - 1].endPoint;
            const endPoint: Point = this.track.segmentArray[0].beginPoint;

            const segment: Segment = new Segment(beginPoint, endPoint);

            this.track.pushSegment(segment);
            this.scene.add(segment.traceLine());
            this._endTrack = true;
        }
    }

    protected getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    protected startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth , this.container.clientHeight);

        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    protected render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera.getCamera());
    }

    public onResize(): void {
        this.camera.updateMatrix();
        this.renderer.setSize(this.container.clientWidth , this.container.clientHeight);
    }

    private calculSegmentArrayIndex(meshId: number): number {
        for (let i: number = 0; i < this.track.meshIdArray.length; i++) {
            if (this.track.meshIdArray[i] === meshId) {
                return i - 1;
            }
        }

        return undefined;
    }

    public deleteTrack(): void {
        const maxIterations: number = Math.floor(Math.log2(this.numberOfPoints)) + 2;
        for (let i: number = 0; i < maxIterations; i++) {
            this.scene.children.forEach((object): void => {
                if (!(object instanceof AmbientLight) && object.name !== FLOOR_NAME) {
                    this.scene.remove(object);
                }
            });
        }
    }

    public deleteFirstPoint(): void {
        this._firstPoint = undefined;
    }

    public openTrack(): void {
        this._endTrack = false;
    }

    private get numberOfPoints(): number {
        const emptyLength: number = 2;
        const onePointLength: number = 3;

        if (this._endTrack) {
            return (this.scene.children.length - 2) / 2;
        } else {
            if (this.scene.children.length === emptyLength) {
                return 0;
            } else if (this.scene.children.length === onePointLength) {
                return 1;
            } else {
                return (this.scene.children.length - 1) / 2;
            }
        }
    }

    private updateLines(): void {

        // Sauvegarde des éléments précédents
        const meshArray: Mesh[] = [];
        this.scene.children.forEach((object): void => {
            if (object instanceof Mesh && object.name !== FLOOR_NAME) {
                meshArray.push(object);
            }
        });
        // Supprimer tout ce qui se trouve sur le floor.
        this.deleteTrack();

        // Réajout de tout les éléments mis à jour.
        const lineArray: Line[] = this.track.updateTrack();
        for (let i: number = 0; i < lineArray.length; i++) {
            this.scene.add(meshArray[i]);
            this.scene.add(lineArray[i]);
        }

        if (!this._endTrack) {
            this.scene.add(meshArray[meshArray.length - 1]);
        }
    }

    public saveDragElement(): void {
        if (this.isOkToDrag()) {
            this.dragElement = this.checkObjIntersection(this._mouse)[0];
        }
    }

    public clearDragElement(): void {
        this.dragElement = undefined;
    }

    private isOkToDrag(): boolean {
        const intersects: Intersection[] = this.checkObjIntersection(this._mouse);

        return (intersects.length > 0) && ((intersects[0].object.name === POINT) || (intersects[0].object.name === STARTING_POINT));
    }

    public drag(event: MouseEvent): void {
        const lastMousePosX: number = this._mouse.x;
        const lastMousePosY: number = this._mouse.y;

        this.updateMouse(event);
        this.updateLines();

        if (lastMousePosX - this._mouse.x > MINIMUM_DRAG_DISTANCE || lastMousePosY - this._mouse.y > MINIMUM_DRAG_DISTANCE) {
            this.clickAction = false;
        }

        this.dragElement.object.translateX(this._mouse.x - lastMousePosX);
        this.dragElement.object.translateY(this._mouse.y - lastMousePosY);

        const selectedMeshID: number = this.dragElement.object.id;
        const newPosition: Vector3 = new Vector3(this.dragElement.object.position.x, 0, this.dragElement.object.position.z);

        if (this.track.segmentArray.length === 0) {
            this._firstPoint.node.position = newPosition;
        } else {
            const index: number = this.calculSegmentArrayIndex(selectedMeshID);
            if (this.dragElement.object.name === STARTING_POINT) {
                this.track.segmentArray[index + 1].beginPoint.node.position = newPosition;
            } else if (this.dragElement.object.name === POINT) {
                this.track.segmentArray[index].endPoint.node.position = newPosition;
            }
        }
    }
}
