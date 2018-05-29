import { Camera } from "./camera";
import { PerspectiveCamera } from "three";
import { Car } from "../../car/car";

const FAR_CLIPPING_PLANE: number = 50000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;

const CAMERA_POSITION_Y_PERSPECTIVE: number = 5;
const CAMERA_DISTANCE: number = 8;

const MIN_ZOOM_FACTOR: number = 0.4;
const MAX_ZOOM_FACTOR: number = 3;
const INCREMENT_FACTOR: number = 1.015;

export class ThirdPersonCamera implements Camera {
    private camera: PerspectiveCamera;
    public zoomFactor: number = 1;

    public constructor(private aspect: number, private car: Car) {
        this.camera =  new PerspectiveCamera( FIELD_OF_VIEW, this.aspect, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE );
    }

    public initialized(): void {
        this.setPosition();
        this.setLookAt();
    }

    public getCamera(): PerspectiveCamera {
        return this.camera;
    }

    public updateCamera(): void {
        this.setPosition();
        this.camera.lookAt(this.car.pos);
    }

    public updateMatrix(): void {
        this.camera.updateProjectionMatrix();
    }

    public setPosition(): void {
        const x: number = this.car.pos.x  - this.zoomFactor * (this.car.direction.x * CAMERA_DISTANCE);
        const z: number = this.car.pos.z  - this.zoomFactor * (this.car.direction.z * CAMERA_DISTANCE);
        this.camera.position.set(x, this.zoomFactor * CAMERA_POSITION_Y_PERSPECTIVE, z);
    }

    public setLookAt(): void {
        this.camera.lookAt(this.car.position);
    }

    public zoomIn(): void {
        if (this.isInZoomRange(this.zoomFactor)) {
            if (this.zoomFactor !== MIN_ZOOM_FACTOR) {
                this.zoomFactor /= INCREMENT_FACTOR;
                this.setPosition();
            }
        } else {
            this.zoomFactor = MIN_ZOOM_FACTOR;
        }
    }

    public zoomOut(): void {
        if (this.isInZoomRange(this.zoomFactor)) {
            if (this.zoomFactor !== MAX_ZOOM_FACTOR) {
                this.zoomFactor *= INCREMENT_FACTOR;
                this.setPosition();
            }
        } else {
            this.zoomFactor = MAX_ZOOM_FACTOR;
        }
    }

    private isInZoomRange(factor: number): boolean {
        return (factor <= MAX_ZOOM_FACTOR) && (factor >= MIN_ZOOM_FACTOR);
    }
}
