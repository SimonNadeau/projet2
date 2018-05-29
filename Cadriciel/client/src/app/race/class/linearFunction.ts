import { Node } from "./node";
import { Vector2 } from "three";

export class LinearFunction {
    private _node1: Node;
    private _node2: Node;
    private _slope: number;
    private _cst: number;

    public getSlope(): number {
        return this._slope;
    }

    public getCst(): number {
        return this._cst;
    }

    public getNode1(): Node {
        return this._node1;
    }

    public getNode2(): Node {
        return this._node2;
    }

    public constructor(node1: Node, node2: Node) {
        this._node1 = node1;
        this._node2 = node2;
        this._slope = this.slopeCalculator();
        this._cst = this.cstCalculator();
    }

    private slopeCalculator(): number {
        return (this._node1.position.z - this._node2.position.z) / (this._node1.position.x - this._node2.position.x);
    }

    private cstCalculator(): number {
        return this._node1.position.z - (this._slope * this._node1.position.x);
    }

    public isParallelWith(secondFct: LinearFunction): boolean {
        return this._slope === secondFct.getSlope();
    }

    public intersection(secondFct: LinearFunction): Vector2 {
        if (this._slope !== secondFct.getSlope()) {
            const x: number = (secondFct.getCst() - this._cst) / (this._slope - secondFct.getSlope());
            const y: number = (this._slope * x) + this._cst;

            return new Vector2(x, y);
        } else {

            return null;
        }
    }

    public shareNode(secondFct: LinearFunction): boolean {
        return this.getNode1().position.equals(secondFct.getNode1().position) ||
            this.getNode1().position.equals(secondFct.getNode2().position) ||
            this.getNode2().position.equals(secondFct.getNode1().position) ||
            this.getNode2().position.equals(secondFct.getNode2().position);
    }

    public isOnSegment(secondFct: LinearFunction): boolean {
        const intersection: Vector2 = this.intersection(secondFct);

        if (intersection == null || this.shareNode(secondFct)) {
            return false;
        }

        return this.inBetween(intersection.x, this._node1.position.x, this._node2.position.x)
            && this.inBetween(intersection.x, secondFct._node1.position.x, secondFct._node2.position.x);
    }

    private inBetween(comparedNumber: number, firstNumber: number, secondNumber: number): boolean {
        if ((Math.min(comparedNumber, firstNumber, secondNumber) === comparedNumber)
            || (Math.max(comparedNumber, firstNumber, secondNumber) === comparedNumber)) {
                return false;
        }

        return true;
    }
}
