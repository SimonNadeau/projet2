/* tslint:disable: no-magic-numbers */

import { Collision } from "./collision";
import { Car } from "./car";
import { Engine } from "./engine";
import { Vector3, AudioListener } from "three";
import { PI_OVER_2 } from "../../constants";

const MS_BETWEEN_FRAMES: number = 2000;

class MockEngine extends Engine {
    public getDriveTorque(): number {
        return 10000;
    }
}

describe("Collision", () => {
    let collision: Collision;
    let car1: Car;
    let car2: Car;

    beforeEach(async (done: () => void) => {
        collision = new Collision();

        car1 = new Car(new MockEngine());
        car2 = new Car(new MockEngine());

        await car1.init(new AudioListener());
        await car2.init(new AudioListener());

        car1.isAcceleratorPressed = true;
        car1.update(MS_BETWEEN_FRAMES);
        car1.isAcceleratorPressed = false;

        done();

    });

    it("should be instantiable", () => {
        expect(collision).toBeDefined();
    });

    it("should be not in collision when instantiate", () => {
        expect(car1.isInCollision[1]).toBeFalsy();
        expect(car2.isInCollision[0]).toBeFalsy();
    });

    it("bumpers should be instantiated", () => {
        for (let i: number = 1; i <= 3; i++) {
            expect(car1.mesh.children[i]).toBeDefined();
            expect(car2.mesh.children[i]).toBeDefined();
        }
    });

    it("should move the bumper and update their position in real time", () => {
        collision["updateVirtualBumpers"](car1);
        collision["updateVirtualBumpers"](car2);
        const dist1: number = collision["distanceBetweenPoints"](car1, car2, 1, 1);
        const dist2: number = collision["distanceBetweenPoints"](car1, car2, 3, 3);
        const dist3: number = collision["distanceBetweenPoints"](car1, car2, 1, 3);

        expect(dist1).not.toEqual(0);
        expect(dist2).not.toEqual(0);
        expect(dist3).not.toEqual(dist1);

    });

    it("should not be in collision if a car is in front of the other", () => {
        collision["updateVirtualBumpers"](car1);
        collision["updateVirtualBumpers"](car2);
        expect(collision["detectCollisions"](car1, car2).collisionDetected).toBeFalsy();
    });

    it("should be in collision if a car's front is into the back of the other", () => {
        car2.isAcceleratorPressed = true;
        car2.update(1700);
        car2.isAcceleratorPressed = false;

        collision["updateVirtualBumpers"](car1);
        collision["updateVirtualBumpers"](car2);

        expect(collision["detectCollisions"](car1, car2)).toEqual(
            {collisionDetected: true, firstCollisionPoint: 3, secondCollisionPoint: 1});
    });

    it("should swap speeds of cars and make them negative", () => {
        car1._speed = new Vector3(0, 0, 3);
        car2._speed = new Vector3(0, 0, 5);

        collision["reactToCollision"](car1, car2, {collisionDetected: true, firstCollisionPoint: 3, secondCollisionPoint: 1});

        expect(car1._speed.equals(new Vector3(0, 0, -5))).toBeTruthy();
        expect(car2._speed.equals(new Vector3(0, 0, -3))).toBeTruthy();
    });

    it("should react ok to 90 front collisions", () => {
        collision["rotateCarY"](car1, PI_OVER_2, 1);

        expect(Math.round(car1.mesh.getWorldDirection().x * 1000) / 1000).toEqual(Math.round(Math.sqrt(2) / 2 * 1000) / 1000);
        expect(Math.round(car1.mesh.getWorldDirection().z * 1000) / 1000).toEqual(Math.round(Math.sqrt(2) / 2 * 1000) / 1000);
    });

    it("should react ok to 90 back collisions", () => {
        collision["rotateCarY"](car1, PI_OVER_2, 3);

        expect(Math.round(car1.mesh.getWorldDirection().x * 1000) / 1000).toEqual(-Math.round(Math.sqrt(2) / 2 * 1000) / 1000);
        expect(Math.round(car1.mesh.getWorldDirection().z * 1000) / 1000).toEqual(Math.round(Math.sqrt(2) / 2 * 1000) / 1000);
    });

    it("should react ok to direct front collisions", () => {
        collision["rotateCarY"](car1, 0, 1);

        expect(car1.mesh.getWorldDirection().equals(new Vector3(0, 0, 1))).toBeTruthy();
    });

    it("should react ok to direct back collisions", () => {
        collision["rotateCarY"](car1, 0, 3);

        expect(car1.mesh.getWorldDirection().equals(new Vector3(0, 0, 1))).toBeTruthy();
    });
});
