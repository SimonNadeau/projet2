import { TrackGenerator } from "../class/trackGenerator";
import { Vector3, Mesh } from "three";

const STARTING_LINE_X: number = -0.5;
const STARTING_LINE_Y: number = 0.5;

const SECOND_SEGMENT_X: number = 0;
const SECOND_SEGMENT_Y: number = 0.5;

const LAST_SEGMENT_X: number = -0.5;
const LAST_SEGMENT_Y: number = 0;

describe("Track Generator", () => {

    let positionFirstNode: Vector3;
    let positionSecondNode: Vector3;
    let positionThirdNode: Vector3;
    const arrayVec3: Vector3[] = new Array<Vector3>();

    let track: TrackGenerator;

    positionFirstNode = new Vector3(-1, 0, 0);
    positionSecondNode = new Vector3(0, 0, -1);
    positionThirdNode = new Vector3(0, 0, 0);
    arrayVec3.push(positionFirstNode);
    arrayVec3.push(positionSecondNode);
    arrayVec3.push(positionThirdNode);

    track = new TrackGenerator(arrayVec3);

    const planeTrack: Mesh[] = track.generateTrack();

    const intersections: Mesh[] = track.generateIntersection();

    const startingLine: Mesh = track.generateStartingLine();

    it("Track should be instantiated correctly", () => {
        expect(track).toBeDefined();
    });

    it("Starting line should be at the right place", () => {
        expect(startingLine.position.x).toEqual(STARTING_LINE_X);
        expect(startingLine.position.z).toEqual(STARTING_LINE_Y);
    });

    it("Should have an intersection on each points", () => {

        expect(intersections[0].position.x).toBeCloseTo(-1);
        expect(intersections[0].position.z).toBeCloseTo(0);

        expect(intersections[1].position.x).toBeCloseTo(0);
        expect(intersections[1].position.z).toBeCloseTo(1);

        expect(intersections[2].position.x).toBeCloseTo(0);
        expect(intersections[2].position.z).toBeCloseTo(0);
    });

    it("Sould have the same amount of intersection Mesh than the intersection array", () => {
        expect(intersections.length).toEqual(arrayVec3.length);
    });

    it("Should generate the last track plane", () => {
        expect(planeTrack[planeTrack.length - 1].position.x).toBeCloseTo(LAST_SEGMENT_X);
        expect(planeTrack[planeTrack.length - 1].position.z).toBeCloseTo(LAST_SEGMENT_Y);

    });

    it("Should generate all the track planes", () => {
        expect(planeTrack[0].position.x).toBeCloseTo(STARTING_LINE_X);
        expect(planeTrack[0].position.z).toBeCloseTo(STARTING_LINE_Y);

        expect(planeTrack[1].position.x).toBeCloseTo(SECOND_SEGMENT_X);
        expect(planeTrack[1].position.z).toBeCloseTo(SECOND_SEGMENT_Y);

        expect(planeTrack[2].position.x).toBeCloseTo(LAST_SEGMENT_X);
        expect(planeTrack[2].position.z).toBeCloseTo(LAST_SEGMENT_Y);
    });

    it("First track plane direction should be right", () => {
        const firstPlaneTrackDirection: Vector3 = new Vector3().subVectors(positionSecondNode, positionFirstNode);
        expect(firstPlaneTrackDirection.x).toBeCloseTo(1);
        expect(-firstPlaneTrackDirection.z).toBeCloseTo(1);
    });
});
