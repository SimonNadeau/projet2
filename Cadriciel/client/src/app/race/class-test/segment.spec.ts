/* tslint:disable: no-magic-numbers */

import { Point } from "../class/point";
import { Node } from "../class/node";
import { Segment } from "../class/segment";
import { Vector3} from "three";

describe("Segment", () => {
    let firstPoint: Point;
    let secondPoint: Point;

    let firstNode: Node;
    let secondNode: Node;

    let positionFirstNode: Vector3;
    let positionSecondNode: Vector3;
    let segment: Segment;

    beforeEach(async (done: () => void) => {
        positionFirstNode = new Vector3(0, 0, 0);
        positionSecondNode = new Vector3(1, 0, 1);

        firstNode = new Node(positionFirstNode, undefined);
        secondNode = new Node(positionSecondNode, firstNode);

        firstPoint = new Point(firstNode);
        secondPoint = new Point(secondNode);

        segment = new Segment(firstPoint, secondPoint);

        done();
    });

    it("should be instantiated correctly when passing all parameters", () => {
        expect(segment).toBeDefined();
    });

    it("should be able to return the position of his Points", () => {
        expect(segment.beginPoint.node.position.x).toBe(positionFirstNode.x);
        expect(segment.beginPoint.node.position.y).toBe(positionFirstNode.y);
        expect(segment.beginPoint.node.position.z).toBe(positionFirstNode.z);
    });

    it("should calculate the segment length correctly", () => {
        expect(segment.getLength()).toBe(Math.sqrt(2));
    });

    it("Should able to trace a line ", () => {
        expect(segment.traceLine()).toBeDefined();
    });
});
