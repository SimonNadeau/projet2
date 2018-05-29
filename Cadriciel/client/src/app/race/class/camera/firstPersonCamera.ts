import { Camera } from "./camera";
import { PerspectiveCamera, Vector3 } from "three";
import { Car } from "../../car/car";

const FAR_CLIPPING_PLANE: number = 50000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INIT_Y_AXE: number = 0;

const CAMERA_CAR_HEIGTH: number = 1.9;
const LOOKAT_DISTANCE: number = 5;

export class FirstPersonCamera implements Camera {
    private camera: PerspectiveCamera;

    public constructor(private aspect: number, private car: Car) {
        this.camera =  new PerspectiveCamera( FIELD_OF_VIEW, this.aspect, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE );
    }

    public initialized(): void {
        this.setPositionAndLookAt();
    }

    public getCamera(): PerspectiveCamera {
        return this.camera;
    }

    public updateCamera(): void {
        this.setPositionAndLookAt();
    }

    public updateMatrix(): void {
        this.camera.updateProjectionMatrix();
    }

    public setPosition(): void {
        const x: number = this.car.pos.x;
        const z: number = this.car.pos.z;
        this.camera.position.set(x, CAMERA_CAR_HEIGTH, z);
    }

    public setLookAt(): void {
        const x: number = this.car.pos.x + this.car.direction.x * LOOKAT_DISTANCE;
        const z: number = this.car.pos.z + this.car.direction.z * LOOKAT_DISTANCE;

        this.camera.lookAt(new Vector3(x, INIT_Y_AXE, z));
    }

    public zoomIn(): void {}

    public zoomOut(): void {}

    private setPositionAndLookAt(): void {
        this.setPosition();
        this.setLookAt();
    }
}
