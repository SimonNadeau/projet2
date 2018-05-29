/* tslint:disable: no-magic-numbers */

import { CameraState } from "../../class/camera/cameraState";
import { Car } from "../../car/car";
import { OrthographicCamera, PerspectiveCamera } from "three";

describe("CameraState", () => {
    let cameras: CameraState;
    let car: Car;

    beforeEach(async (done: () => void) => {
        car = new Car();
        cameras = new CameraState(1, car, null);
        done();
    });

    it("should be defined", () => {
        expect(cameras).toBeDefined();
    });

    it("first state should be 0", () => {
        expect(cameras.state).toEqual(0);
    });

    it("should switch from state 0 to state 1", async () => {
        cameras.nextCamera();
        expect(cameras.state).toEqual(1);
    });

    it("should switch from state 1 to state 2", async () => {
        cameras.nextCamera();
        expect(cameras.state).toEqual(1);
    });

    it("should switch from state 2 to state 0", async () => {
        for (let i: number = 0; i < 3; i++) {
            cameras.nextCamera();
        }
        expect(cameras.state).toEqual(0);
    });

    it("first state camera should be a perspective camera", () => {
        expect(cameras.currentCamera().getCamera() instanceof PerspectiveCamera).toBeTruthy();
    });

    it("third state camera should be an orthographic camera", async () => {
        for (let i: number = 0; i < 2; i++) {
            cameras.nextCamera();
        }
        expect(cameras.currentCamera() instanceof OrthographicCamera).toBeTruthy();
    });

    it("Camera should be defined", () => {
        expect(cameras.currentCamera).toBeDefined();
    });
});
