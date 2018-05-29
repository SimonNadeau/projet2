import { PlaneGeometry, Mesh, MeshPhongMaterial, Vector2, Vector3,
        Texture, TextureLoader, RepeatWrapping, CircleGeometry, BoxGeometry, MultiMaterial } from "three";
import { PI_OVER_2 } from "../../constants";

export const TRACK_WIDTH: number = 20;
const STARTING_LINE_WIDTH: number = 1;
const SIX: number = 6;
const STARTLINE_Y_TEX: number = 1 / SIX;
const STARTLINE_X_TEX: number = 2.5;
const FLOOR_ROTATION: number = 3;
const FLOOR_REPEATER: number = 3;
const CIRCLE_REPETER: number = 100;
const FIRST_NODE_POSITION: number = 0;
const SECOND_NODE_POSITION: number = 1;

const GRAY: number = 0x808080;

const POST_SIDE: number = 1;
const POST_HEIGTH: number = 5;

const SPONSOR_PANEL_HEIGHT: number = 5;

const Z_INTERSECTION_TRANSLATION: number = -0.005;
const Z_TRACK_TRANSLATION: number = -0.004;
const Z_START_LINE_TRANSLATION: number = -0.003;

export const STARTING_LINE_NAME: string = "starting line";

export class TrackGenerator {

    public constructor(private _trackNode: Vector3[]) {}

    public get trackNodes(): Vector3[] {
        return this._trackNode;
    }

    public get startingLinePosition(): Vector3 {
        return this.middlePoints(this._trackNode[0], this._trackNode[1]);
    }

    public get firstPlaneDirection(): Vector3 {
        const firstPoint: Vector3 = this._trackNode[FIRST_NODE_POSITION];
        const secondPoint: Vector3 = this._trackNode[SECOND_NODE_POSITION];

        return (new Vector3()).subVectors(secondPoint, firstPoint);
    }

    public get initialAngle(): number {
        return this.rotationAngle(this.firstPlaneDirection);
    }

    private isPair(currentNumber: number): boolean {
        return (currentNumber % 2) === 0;
    }

    private middlePoints( firstPoint: Vector3, secondPoint: Vector3): Vector3 {
        return (new Vector3()).addVectors(firstPoint, secondPoint).divideScalar(2);
    }

    private textureLengthRepeter(trackLength: number): number {
        return (FLOOR_REPEATER * trackLength) / TRACK_WIDTH;
    }

    private generateTexture(x: number, y: number, path: string): Texture {
        const texture: Texture = new TextureLoader().load( path );
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set( x, y );

        return texture;
    }

    public generateTrack(): Mesh[] {
        const planeArray: Mesh[] = Array<Mesh>();

        for (let i: number = 0; i < this._trackNode.length; i++) {
            const firstPoint: Vector3 = this._trackNode[i];
            const secondPoint: Vector3 = (i === this._trackNode.length - 1) ? this._trackNode[FIRST_NODE_POSITION] : this._trackNode[i + 1];

            const plane: Mesh = this.generatePlane(firstPoint, secondPoint);

            if (this.isPair(i)) {
                plane.translateZ(Z_TRACK_TRANSLATION);
            }
            planeArray.push(plane);
        }

        return planeArray;
    }

    private generatePlane( firstPoint: Vector3, secondPoint: Vector3): Mesh {
        const trackLength: number = this.calcSegmentLenght(firstPoint, secondPoint);

        const yRepeter: number = this.textureLengthRepeter(trackLength);
        const path: string = "../../assets/camero/floor.jpg";

        const plane: PlaneGeometry = new PlaneGeometry( TRACK_WIDTH, trackLength, 0, 0 );
        const material: MeshPhongMaterial = new MeshPhongMaterial( {   map: this.generateTexture(FLOOR_REPEATER, yRepeter, path) } ) ;
        const track: Mesh = new Mesh( plane, material);

        track.name = "track";
        track.rotateX(PI_OVER_2 * FLOOR_ROTATION);
        const delta: Vector3 = (new Vector3).subVectors(secondPoint, firstPoint);

        track.translateX(this.middlePoints( firstPoint, secondPoint).x);
        track.translateY(this.middlePoints( firstPoint, secondPoint).z);
        track.rotateZ(this.rotationAngle(delta));

        return track;
    }

    public generateIntersection(): Mesh[] {
        const intersectionArray: Mesh[] = Array<Mesh>();

        for (const node of this._trackNode) {
            const circle: CircleGeometry = new CircleGeometry(TRACK_WIDTH / 2, CIRCLE_REPETER, 0);
            const path: string = "../../assets/camero/floor.jpg";
            const material: MeshPhongMaterial = new MeshPhongMaterial({ map: this.generateTexture(FLOOR_REPEATER, FLOOR_REPEATER, path) });
            const intersection: Mesh = new Mesh( circle, material);

            intersection.name = "intersection";
            intersection.rotateX(PI_OVER_2 * FLOOR_ROTATION);
            intersection.translateZ(Z_INTERSECTION_TRANSLATION);
            intersection.translateX(node.x);
            intersection.translateY(node.z);
            intersectionArray.push(intersection);
        }

        return intersectionArray;
    }

    public generateStartingLine(): Mesh {
        const firstPlaneMiddle: Vector3 = this.middlePoints(this._trackNode[0], this._trackNode[1]);

        const plane: PlaneGeometry = new PlaneGeometry( TRACK_WIDTH, STARTING_LINE_WIDTH, 0, 0 );
        const path: string = "../../assets/camero/raceFlag.jpg";
        const material: MeshPhongMaterial = new MeshPhongMaterial({map: this.generateTexture(STARTLINE_X_TEX, STARTLINE_Y_TEX, path)});
        const startingLine: Mesh = new Mesh( plane, material);

        startingLine.name = STARTING_LINE_NAME;
        startingLine.rotateX(PI_OVER_2 * FLOOR_ROTATION);
        startingLine.translateX(firstPlaneMiddle.x);
        startingLine.translateY(firstPlaneMiddle.z);
        startingLine.translateZ(Z_START_LINE_TRANSLATION);
        startingLine.rotateZ(this.rotationAngle(this.firstPlaneDirection));

        return startingLine;
    }

    private generateBox(width: number, depth: number, height: number, translateCoord: Vector3, color: number): Mesh {
        const firstPlaneMiddle: Vector3 = this.middlePoints(this._trackNode[0], this._trackNode[1]);

        const geometry: BoxGeometry = new BoxGeometry( width, depth, height);
        const material: MeshPhongMaterial = new MeshPhongMaterial( {color: color} );
        const post: Mesh = new Mesh( geometry, material );

        post.rotateX(PI_OVER_2 * FLOOR_ROTATION);
        post.translateX(firstPlaneMiddle.x);
        post.translateY(firstPlaneMiddle.z);
        post.translateZ(Z_START_LINE_TRANSLATION);
        post.rotateZ(this.rotationAngle(this.firstPlaneDirection));

        post.translateX(translateCoord.x);
        post.translateY(translateCoord.y);
        post.translateZ(translateCoord.z);

        post.name = "post";

        return post;
    }

    public generatePosts(): Mesh[] {
        const postArray: Mesh[] = Array<Mesh>();

        const xTranslation: number = (TRACK_WIDTH / 2) + POST_SIDE / 2;
        const topPostYTranslation: number = POST_HEIGTH - POST_SIDE / 2;

        postArray.push(this.generateBox(POST_SIDE, POST_SIDE, POST_HEIGTH, new Vector3(xTranslation, 0, POST_HEIGTH / 2), GRAY));
        postArray.push(this.generateBox(POST_SIDE, POST_SIDE, POST_HEIGTH, new Vector3(- xTranslation, 0, POST_HEIGTH / 2), GRAY));
        postArray.push(this.generateBox(TRACK_WIDTH, POST_SIDE, POST_SIDE, new Vector3(0, 0, topPostYTranslation), GRAY));

        return postArray;
    }

    private materialGenerator(path: string): MeshPhongMaterial {
        return new MeshPhongMaterial( { map: this.generateTexture(1, 1, path) } );
    }

    private materialRepeterGenerator(x: number, y: number, path: string): MeshPhongMaterial {
        return new MeshPhongMaterial( { map: this.generateTexture(x, y, path) } );
    }

    public generateSponsor(): Mesh {
        const material: MeshPhongMaterial[] = [
            this.materialGenerator(" "),
            this.materialGenerator(" "),
            this.materialGenerator(" "),
            this.materialRepeterGenerator(1, 1, "../../assets/camero/Pirelli.png"),
            this.materialGenerator(" "),
            this.materialGenerator(" "),
        ];
        const geometry: BoxGeometry = new BoxGeometry( TRACK_WIDTH, POST_SIDE, SPONSOR_PANEL_HEIGHT);
        const sponsor: Mesh = new Mesh( geometry, new MultiMaterial( material) );

        const firstPlaneMiddle: Vector3 = this.middlePoints(this.trackNodes[0], this.trackNodes[1]);

        sponsor.rotateX(PI_OVER_2 * FLOOR_ROTATION);
        sponsor.translateX(firstPlaneMiddle.x);
        sponsor.translateY(firstPlaneMiddle.z);
        sponsor.translateZ(Z_START_LINE_TRANSLATION);
        sponsor.rotateZ(this.rotationAngle(this.firstPlaneDirection));

        sponsor.translateZ(SPONSOR_PANEL_HEIGHT / 2 + POST_HEIGTH);

        sponsor.name = "sponsor";

        return sponsor;
    }

    private calcSegmentLenght(firstVec: Vector3, secondVect: Vector3): number {
        return (new Vector2(firstVec.x - secondVect.x, firstVec.z - secondVect.z)).length();
    }

    private rotationAngle(trackDirection: Vector3): number {
        const originalTrackDirection: Vector3 = new Vector3(0, 0, 1);
        const angle: number = Math.acos(trackDirection.dot(originalTrackDirection) /
                                    (trackDirection.length() * originalTrackDirection.length()));
        if (trackDirection.x > 0) {
            return -angle;
        } else {
            return angle;
        }
    }
}
