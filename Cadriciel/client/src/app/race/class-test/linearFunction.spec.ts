/* tslint:disable: no-magic-numbers */

import { Node } from "../class/node";
import { Vector3} from "three";
import { LinearFunction } from "../class/linearFunction";

describe("LinearFunction", () => {
    let node: Node;
    let prevNode: Node;
    let positionNode: Vector3;
    let positionPrevNode: Vector3;
    let linearFunction: LinearFunction;
    let L1: LinearFunction;

    let secNode: Node;
    let secPrevNode: Node;
    let secPositionNode: Vector3;
    let secPositionPrevNode: Vector3;
    let secLinearFunction: LinearFunction;
    let L2: LinearFunction;

    beforeEach(async (done: () => void) => {
        positionPrevNode = new Vector3(0, 0, 0);
        positionNode = new Vector3(1, 0, 1);
        prevNode = new Node(positionPrevNode, undefined);
        node = new Node(positionNode, prevNode);
        linearFunction = new LinearFunction(prevNode, node);

        secPositionPrevNode = new Vector3(0, 0, 2);
        secPositionNode = new Vector3(1, 0, 0);
        secPrevNode = new Node(secPositionPrevNode, undefined);
        secNode = new Node(secPositionNode, secPrevNode);
        secLinearFunction = new LinearFunction(secPrevNode, secNode);
        done();
    });

    it("should be instantiated correctly", () => {
        expect(linearFunction).toBeDefined();
    });

    it("should be able to return the correct first slope", () => {
        expect(linearFunction.getSlope()).toBe(1);
    });

    it("should be able to return a correct second slope", () => {
        expect(secLinearFunction.getSlope()).toBe(-2);
    });

    it("should be able to return the right first constant", () => {
        expect(linearFunction.getCst()).toBe(0);
    });

    it("should be able to return the right constant", () => {
        expect(secLinearFunction.getCst()).toBe(2);
    });

    it("should be able to return the intersection", () => {
        expect(linearFunction.intersection(secLinearFunction).x).toBe(2 / 3);
        expect(linearFunction.intersection(secLinearFunction).y).toBe(2 / 3);
    });

    it("should be able to detect parallel lines", () => {
        secPositionPrevNode = new Vector3(1, 0, 0);
        secPositionNode = new Vector3(0, 0, -1);
        secPrevNode = new Node(secPositionPrevNode, undefined);
        secNode = new Node(secPositionNode, secPrevNode);
        secLinearFunction = new LinearFunction(secPrevNode, secNode);

        expect(linearFunction.isParallelWith(secLinearFunction)).toBe(true);
    });

    it("should be able to detect not parallel lines", () => {
        expect(linearFunction.isParallelWith(secLinearFunction)).toBe(false);
    });

    it("should be able to detect the intersection point on the segment", () => {
       expect(linearFunction.isOnSegment(secLinearFunction)).toBe(true);
    });

    it("A shared node should not be in intersection.", () => {
        positionPrevNode = new Vector3(0, 0, 0);
        positionNode = new Vector3(1, 0, 1);
        prevNode = new Node(positionPrevNode, undefined);
        node = new Node(positionNode, prevNode);
        L1 = new LinearFunction(prevNode, node);

        secPositionPrevNode = new Vector3(0, 0, 2);
        secPositionNode = new Vector3(0, 0, 0);
        secPrevNode = new Node(secPositionPrevNode, undefined);
        secNode = new Node(secPositionNode, secPrevNode);
        L2 = new LinearFunction(secPrevNode, secNode);
        expect(L1.isOnSegment(L2)).toBeFalsy();
     });

    it("should be able to detect the intersection point is not on the segment with parallel lines", () => {
        const thirdPrevNode: Node = new Node( new Vector3(-1, 0, 5), undefined);
        const thirdNode: Node = new Node( new Vector3(0, 0, 3), thirdPrevNode);

        expect(linearFunction.isOnSegment(new LinearFunction(thirdPrevNode, thirdNode))).toBe(false);
     });
});
