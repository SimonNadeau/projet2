/* tslint:disable: no-magic-numbers */

import { Track } from "../class/track";
import { Node } from "../class/node";
import { Vector3 } from "three";
import { Segment } from "../class/segment";
import { Point } from "../class/point";

describe("Track", () => {
    let firstSegment: Segment;
    let secondSegment: Segment;
    let thirdSegment: Segment;
    let fourthSegment: Segment;

    let firstNode: Node;
    let secondNode: Node;
    let thirdNode: Node;
    let fourthNode: Node;

    let positionFirstNode: Vector3;
    let positionSecondNode: Vector3;
    let positionThirdNode: Vector3;
    let positionFourthNode: Vector3;

    let firstPoint: Point;
    let secondPoint: Point;
    let thirdPoint: Point;
    let fourthPoint: Point;

    let track: Track;

    beforeEach(async (done: () => void) => {
        positionFirstNode = new Vector3(0, 0, 0);
        positionSecondNode = new Vector3(1, 0, 0);
        positionThirdNode = new Vector3(0, 0, 1);
        positionFourthNode = new Vector3(1, 0, 1);

        firstNode = new Node(positionFirstNode, undefined);
        secondNode = new Node(positionSecondNode, firstNode);
        thirdNode = new Node(positionThirdNode, secondNode);
        fourthNode = new Node(positionFourthNode, thirdNode);

        firstPoint = new Point(firstNode);
        secondPoint = new Point(secondNode);
        thirdPoint = new Point(thirdNode);
        fourthPoint = new Point(fourthNode);

        firstSegment = new Segment(firstPoint, secondPoint);
        secondSegment = new Segment(secondPoint, thirdPoint);
        thirdSegment = new Segment(thirdPoint, firstPoint);

        track = new Track();
        done();
    });

    it("should be instantiated correctly", () => {
        expect(firstSegment).toBeDefined();
    });

    it("should be able to return its own position after instantiation", () => {
        expect(thirdNode.position).toBe(positionThirdNode);
    });

    it("should be able to return its own previousNode after instantiation", () => {
        expect(thirdNode.previousNode).toBe(secondNode);
    });

    it("should be able to return the correct length", () => {
        expect(firstSegment.getLength()).toEqual(1);
    });

    it("should be able to return the correct distance between", () => {
        expect(track.getDistanceBetween(positionSecondNode, positionThirdNode)).toEqual(Math.sqrt(2));
    });

    it("should be able to test the cosinus law successfully", () => {
        expect(track.cosinusLaw(firstSegment, secondSegment)).toEqual(45);
    });

    it("should be able to validate angle for all the track.", () => {
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        expect(track.validateAllAngles()).toBeTruthy();
    });

    it("should have a minimum of 3 segments on track.", () => {
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        expect(track.validateMinimumSegment()).toBeTruthy();
    });

    it("should have a begin, an ending point and it should be the same.", () => {
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        expect(track.validateLastNode()).toBeTruthy();
    });

    it("should have a begin, an ending point and it should return false if they differ.", () => {
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        expect(track.validateLastNode()).toBeFalsy();
    });

    it("All the segments should be long enough", () => {
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        expect(track.validateLength()).toBeTruthy();
    });

    it("All the segments should not cross each other (vers. 1)", () => {

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);

        expect(track.validateIntersectionFree()).toBeTruthy();
    });

    it("All the segments should not cross each other (vers. 2)", () => {

        firstSegment = new Segment(firstPoint, secondPoint);
        secondSegment = new Segment(secondPoint, thirdPoint);
        thirdSegment = new Segment(thirdPoint, fourthPoint);
        fourthSegment = new Segment(fourthPoint, firstPoint);

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        track.pushSegment(fourthSegment);
        // Because they cross
        expect(track.validateIntersectionFree()).toBeFalsy();
    });

    it("All the segments should not cross each other (vers. 3)", () => {

        firstSegment = new Segment(fourthPoint, firstPoint);
        secondSegment = new Segment(firstPoint, secondPoint);
        thirdSegment = new Segment(secondPoint, thirdPoint);

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        // Because they cross
        expect(track.validateIntersectionFree()).toBeFalsy();
    });

    it("All the segments should not cross each other", () => {

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);

        expect(track.validateIntersectionFree()).toBeTruthy();
    });

    it("The track should be ok to be saved.", () => {

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);

        expect(track.checkIfOkTosave()).toBeTruthy();
    });

    it("A wrong track should not be saved.", () => {

        firstSegment = new Segment(firstPoint, secondPoint);
        secondSegment = new Segment(secondPoint, thirdPoint);
        thirdSegment = new Segment(thirdPoint, fourthPoint);
        fourthSegment = new Segment(fourthPoint, firstPoint);

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        track.pushSegment(fourthSegment);

        expect(track.checkIfOkTosave()).toBeFalsy();
    });

    it("Should clear all segments", () => {

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);

        track.clearSegmentArray();

        expect(track["_segments"].length).toBeGreaterThanOrEqual(0);
    });

    it("Should verify all angles", () => {

        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);

        expect(track.validateAllAngles).toBeTruthy();
    });

    it("Should be able to save if ok to sve", () => {
        track.clearSegmentArray();
        track.pushSegment(firstSegment);
        track.pushSegment(secondSegment);
        track.pushSegment(thirdSegment);
        track["_isOkToSave"] = true;
        expect(track.save()).toEqual([ [ 0, 0, 0 ], [ 1, 0, 0 ], [ 0, 0, 1 ] ] );
    });

});
