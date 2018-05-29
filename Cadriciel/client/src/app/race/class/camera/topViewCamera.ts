import { OrthographicCamera } from "three";
import { Camera } from "./camera";
import { Car } from "../../car/car";

const TOP_VIEW_PLANE_VERTICAL: number = 30;
const TOP_VIEW_PLANE_HORIZONTAL: number = 18;

const INITIAL_CAMERA_POSITION_Y: number = 250;

const MIN_ZOOM_FACTOR: number = 0.4;
const MAX_ZOOM_FACTOR: number = 3;
const INCREMENT_FACTOR: number = 1.015;

export class TopViewCamera implements Camera {
    private camera: OrthographicCamera;

    public constructor(private car: Car) {
        this.camera = new OrthographicCamera(
            -TOP_VIEW_PLANE_VERTICAL,
            TOP_VIEW_PLANE_VERTICAL,
            TOP_VIEW_PLANE_HORIZONTAL,
            -TOP_VIEW_PLANE_HORIZONTAL
            );
    }

    public initialized(): void {
        this.camera.position.set(this.car.pos.x, INITIAL_CAMERA_POSITION_Y, this.car.pos.z);
    }

    public getCamera(): OrthographicCamera {
        return this.camera;
    }

    public updateCamera(): void {
        this.setPosition();
        this.setLookAt();
    }

    public updateMatrix(): void {
        this.camera.updateProjectionMatrix();
    }

    public setPosition(): void {
        this.camera.position.set(this.car.pos.x, INITIAL_CAMERA_POSITION_Y, this.car.pos.z);
    }

    public setLookAt(): void {
        this.camera.lookAt(this.car.pos);
    }

    public zoomIn(): void {
        if (this.isInZoomRange(this.camera.zoom)) {
            if (this.camera.zoom !== MAX_ZOOM_FACTOR) {
                this.camera.zoom *= INCREMENT_FACTOR;
                this.updateMatrix();
            }
        } else {
            this.camera.zoom = MAX_ZOOM_FACTOR;
        }
    }

    public zoomOut(): void {
        if (this.isInZoomRange(this.camera.zoom)) {
            if (this.camera.zoom !== MIN_ZOOM_FACTOR) {
                this.camera.zoom /= INCREMENT_FACTOR;
                this.updateMatrix();
            }
        } else {
            this.camera.zoom = MIN_ZOOM_FACTOR;
        }
    }

    private isInZoomRange(factor: number): boolean {
        return (factor <= MAX_ZOOM_FACTOR) && (factor >= MIN_ZOOM_FACTOR);
    }
}
