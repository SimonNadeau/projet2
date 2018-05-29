import { ThirdPersonCamera } from "../../class/camera/thirdPersonCamera";
import { Car } from "../../car/car";
import { Vector3, PerspectiveCamera, AudioListener } from "three";
import { Engine } from "../../car/engine";

const MIN_ZOOM_FACTOR: number = 0.4;
const MAX_ZOOM_FACTOR: number = 3;
const INCREMENT_FACTOR: number = 1.015;

const CAMERA_POSITION_Y_PERSPECTIVE: number = 5;
const CAMERA_DISTANCE: number = 8;

const BIG_NUMBER: number = 1000;
const BIGGER_NUMBER: number = 10000;

const MS_BETWEEN_FRAMES: number = 16.6667;

const OVER_ZOOM_FACTOR: number = 10;
const BELOW_ZOOM_FACTOR: number = 0;

class MockEngine extends Engine {
    public getDriveTorque(): number {
        return BIGGER_NUMBER;
    }
}

describe("ThirdPersonCamera", () => {
    let camera: ThirdPersonCamera;
    let car: Car;

    beforeEach(async (done: () => void) => {
        car = new Car(new MockEngine());
        await car.init(new AudioListener());

        camera = new ThirdPersonCamera(1, car);
        car._spawnPosition = new Vector3(1, 0, 0);
        camera.initialized();

        car.isAcceleratorPressed = true;
        car.update(MS_BETWEEN_FRAMES);
        car.isAcceleratorPressed = false;
        done();
    });

    it("should be defined", () => {
        expect(camera).toBeDefined();
    });

    it("should be a Perspective camera", () => {
        expect(camera.getCamera() instanceof PerspectiveCamera).toBeTruthy();
    });

    it("Should be at initial position", () => {
        expect(camera.getCamera().position.x).toBe(0);
        expect(camera.getCamera().position.y).toBe(CAMERA_POSITION_Y_PERSPECTIVE);
        expect(camera.getCamera().position.z).toBeCloseTo(CAMERA_DISTANCE);
    });

    it("should follow the car", () => {

        car.isAcceleratorPressed = true;

        expect(camera.getCamera().position.x).toBeCloseTo(car.pos.x  - (car.direction.x * CAMERA_DISTANCE));
        expect(camera.getCamera().position.y).toBeCloseTo(CAMERA_POSITION_Y_PERSPECTIVE);
        expect(camera.getCamera().position.z).toBeCloseTo(car.pos.z  - (car.direction.z * CAMERA_DISTANCE));

    });

    it("Should stay at minimum zoom if zoom in is pressed and zoom height is already to his minimum value", () => {
        camera.zoomFactor = BELOW_ZOOM_FACTOR;
        camera.zoomIn();
        expect(camera.zoomFactor).toBe(MIN_ZOOM_FACTOR);
    });

    it("Should stay at maximum zoom if zoom out is pressed and zoom height is already to his maximum value", () => {
        camera.zoomFactor = OVER_ZOOM_FACTOR;
        camera.zoomOut();
        expect(camera.zoomFactor).toBe(MAX_ZOOM_FACTOR);
    });

    it("Should zoom once if the function is only call once", () => {
        const initialZoomFactor: number = 1;
        camera.zoomFactor = initialZoomFactor;
        camera.zoomIn();
        expect(camera.zoomFactor).toBe(initialZoomFactor / INCREMENT_FACTOR);
    });

    it("Should unzoom once if the function is only call once", () => {
        const initialZoomFactor: number = 1;
        camera.zoomFactor = initialZoomFactor;
        camera.zoomOut();
        expect(camera.zoomFactor).toBe(initialZoomFactor * INCREMENT_FACTOR);
    });

    it("Should cuntinue zooming if key is pressed", () => {
        camera.zoomFactor = 1;
        for (let i: number = 0; i < BIG_NUMBER; i++) {
            camera.zoomIn();
        }
        expect(camera.zoomFactor).toBe(MIN_ZOOM_FACTOR);
    });

    it("Should cuntinue unzooming if key is pressed", () => {
        camera.zoomFactor = 1;
        for (let i: number = 0; i < BIG_NUMBER; i++) {
            camera.zoomOut();
        }
        expect(camera.zoomFactor).toBe(MAX_ZOOM_FACTOR);
    });
});
