/* tslint:disable: no-magic-numbers */

import { Point } from "../class/point";
import { Node } from "../class/node";
import { Vector3} from "three";

describe("Point", () => {
    let firstPoint: Point;

    let firstNode: Node;

    let positionFirstPoint: Vector3;

    beforeEach(async (done: () => void) => {
        positionFirstPoint = new Vector3(0, 0, 0);

        firstNode = new Node(positionFirstPoint, undefined);
        firstPoint = new Point(firstNode);

        done();
    });

    it("should be instantiated correctly when passing all parameters", () => {
        expect(firstPoint).toBeDefined();
    });

    it("should be able to return the position of the Points", () => {
        expect(firstPoint.node.position).toBe(positionFirstPoint);
    });

    it("should calculate the segment length correctly", () => {
        firstPoint.moveTo(new Vector3(2, 3, 4));
        expect(firstPoint.node.position.x).toBe(2);
        expect(firstPoint.node.position.y).toBe(3);
        expect(firstPoint.node.position.z).toBe(4);
    });

    it("First Point should be different then the others", () => {
        firstPoint.moveTo(new Vector3(2, 3, 4));
        expect(firstPoint.meshPoint.name).toEqual("startNode");

        const positionSecondPoint: Vector3 = new Vector3(0, 1, 0);
        const secondNode: Node = new Node(positionSecondPoint, firstNode);
        const secondPoint: Point  = new Point(secondNode);

        expect(secondPoint.meshPoint.name).toEqual("node");
    });
});
