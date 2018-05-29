/* tslint:disable: no-magic-numbers */

import { CollisionHandler, BumperSide } from "./collisionHandler";
import { BoundsBumpers } from "./boundsBumpers";
import { Points, Vector3, AudioListener } from "three";
import { TWO } from "../../constants";
import { Car } from "./car";
import { RenderService } from "../../render-service/render.service";

describe("Outside Bounds", () => {
    let cH: CollisionHandler;
    let bB: BoundsBumpers;

    beforeEach(() => {
        cH = new CollisionHandler(new RenderService());
        bB = new BoundsBumpers();
    });

    it("should be instantiated", () => {
        expect(cH).toBeDefined();
    });

    it("should be able to add the bumper with the right name in the right order", () => {
        const points: Array<Points> = bB.add();
        expect(points[0].name).toEqual("Bumper Left");
        expect(points[1].name).toEqual("Bumper Right");
    });

    it("should be able to add the bumper positions in the right order", () => {
        const points: Array<Points> = bB.add();
        expect(points[0].position.equals(new Vector3(-0.5, TWO, -1.7))).toBeTruthy();
        expect(points[1].position.equals(new Vector3(0.5, TWO, -1.7))).toBeTruthy();
    });

    it("should be able to see if the car is outside or not", async (done: () => void) => {
        const car: Car = new Car();
        await car.init(new AudioListener());
        done();
        expect(car.getIsOutside(BumperSide.Left)).toBeFalsy();
        expect(car.getIsOutside(BumperSide.Right)).toBeFalsy();
    });

    it("should be able to set if the car is outside or not", async (done: () => void) => {
        const car: Car = new Car();
        await car.init(new AudioListener());
        done();
        car.toggleIsOutside(BumperSide.Left);
        expect(car.getIsOutside(BumperSide.Left)).toBeTruthy();
        car.toggleIsOutside(BumperSide.Left);
        expect(car.getIsOutside(BumperSide.Left)).toBeFalsy();
        expect(car.getIsOutside(BumperSide.Right)).toBeFalsy();
    });

});
