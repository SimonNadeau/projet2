import { Node } from "../class/node";
import { Vector3 } from "three";

describe("Node", () => {
    let firstNode: Node;
    let secondNode: Node;
    let thirdNode: Node;
    let positionFirstNode: Vector3;
    let positionSecondNode: Vector3;
    let positionThirdNode: Vector3;

    beforeEach(async (done: () => void) => {
        positionFirstNode = new Vector3(0, 0, 0);
        positionSecondNode = new Vector3(1, 0, 0);
        positionThirdNode = new Vector3(1, 1, 1);
        firstNode = new Node(positionFirstNode, undefined);
        secondNode = new Node(positionSecondNode, firstNode);
        thirdNode = new Node(positionThirdNode, secondNode);
        done();
    });

    it("should be instantiated correctly with second parameter set to undefined", () => {
        expect(firstNode).toBeDefined();
    });

    it("should be instantiated correctly when passing all parameters", () => {
        expect(secondNode).toBeDefined();
    });

    it("should be able to return its own position after instantiation", () => {
        expect(thirdNode.position).toBe(positionThirdNode);
    });

    it("should be able to return its own previousNode after instantiation", () => {
        expect(thirdNode.previousNode).toBe(secondNode);
    });

    it("should be able to access any previous Node", () => {
        expect(thirdNode.previousNode.previousNode.position).toBe(positionFirstNode);
    });
});
