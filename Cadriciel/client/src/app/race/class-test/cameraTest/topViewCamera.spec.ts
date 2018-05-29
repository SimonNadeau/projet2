import { TopViewCamera } from "../../class/camera/topViewCamera";
import { Car } from "../../car/car";
import { Vector3, OrthographicCamera, AudioListener } from "three";
import { Engine } from "../../car/engine";

const MIN_ZOOM_FACTOR: number = 0.4;
const MAX_ZOOM_FACTOR: number = 3;
const INCREMENT_FACTOR: number = 1.015;

const BIG_NUMBER: number = 1000;

const OVER_ZOOM_FACTOR: number = 10;
const BELOW_ZOOM_FACTOR: number = 0;

const MS_BETWEEN_FRAMES: number = 16.6667;

const CAMERA_HEIGHT: number = 250;

const DRIVE_TORQUE: number = 10000;

class MockEngine extends Engine {
    public getDriveTorque(): number {
        return DRIVE_TORQUE;
    }
}

describe("TopViewCamera", () => {
    let camera: TopViewCamera;
    let car: Car;

    beforeEach(async (done: () => void) => {
        car = new Car(new MockEngine());

        await car.init(new AudioListener());
        camera = new TopViewCamera(car);
        camera.initialized();
        car._spawnPosition = new Vector3(1, 0, 0);

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        done();
    });

    it("should be defined", () => {
        expect(camera).toBeDefined();
    });

    it("should be an Orthogonal camera", () => {
        expect(camera.getCamera() instanceof OrthographicCamera).toBeTruthy();
    });

    it("should be at the same initial position", () => {
        expect(camera.getCamera().position.x).toBe(0);
        expect(camera.getCamera().position.y).toEqual(CAMERA_HEIGHT);
        expect(camera.getCamera().position.z).toEqual(0);
    });

    it("should follow the car", () => {
        car.isAcceleratorPressed = true;
        for (let i: number = 0; i < BIG_NUMBER; i++) {
            car.update(MS_BETWEEN_FRAMES);
            camera.updateCamera();
        }

        expect(camera.getCamera().position.x).toBe(car.pos.x);
        expect(camera.getCamera().position.z).toEqual(car.pos.z);
    });

    it("Should stay at minimum zoom if zoom in is pressed and zoom height is already to his minimum zoom value", () => {
        camera.getCamera().zoom = BELOW_ZOOM_FACTOR;
        camera.zoomIn();
        expect(camera.getCamera().zoom).toBe(MAX_ZOOM_FACTOR);
    });

    it("Should stay at maximum zoom if zoom out is pressed and zoom height is already to his maximum zoom value", () => {
        camera.getCamera().zoom = OVER_ZOOM_FACTOR;
        camera.zoomOut();
        expect(camera.getCamera().zoom).toBe(MIN_ZOOM_FACTOR);
    });

    it("Should zoom once if the function is only call once", () => {
        const initialZoomFactor: number = 1;
        camera.getCamera().zoom = initialZoomFactor;
        camera.zoomIn();
        expect(camera.getCamera().zoom).toBe(initialZoomFactor * INCREMENT_FACTOR);
    });

    it("Should unzoom once if the function is only call once", () => {
        const initialZoomFactor: number = 1;
        camera.getCamera().zoom = initialZoomFactor;
        camera.zoomOut();
        expect(camera.getCamera().zoom).toBe(initialZoomFactor / INCREMENT_FACTOR);
    });

    it("Should cuntinue zooming if key is pressed", () => {
        camera.getCamera().zoom = 1;
        for (let i: number = 0; i < BIG_NUMBER; i++) {
            camera.zoomIn();
        }
        expect(camera.getCamera().zoom).toBe(MAX_ZOOM_FACTOR);
    });

    it("Should cuntinue unzooming if key is pressed", () => {
        camera.getCamera().zoom = 1;
        for (let i: number = 0; i < BIG_NUMBER; i++) {
            camera.zoomOut();
        }
        expect(camera.getCamera().zoom).toBe(MIN_ZOOM_FACTOR);
    });
});
