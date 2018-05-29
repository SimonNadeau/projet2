import { Camera } from "./camera";
import { OrthographicCamera, Vector3 } from "three";

const VERTICAL_PLANE: number = 1;
const HORIZONTAL_PLANE: number = 1;
const INIT_AXES: number = 0;

const CAMERA_POSITION_Y: number = 250;

export class TrackEditorCamera implements Camera {
    private camera: OrthographicCamera;

    public constructor() {
        this.camera =  new OrthographicCamera(
            -VERTICAL_PLANE,
            VERTICAL_PLANE,
            HORIZONTAL_PLANE,
            -HORIZONTAL_PLANE
        );
    }
    public initialized(): void {
        this.setPosition();
        this.setLookAt();
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
        this.camera.position.set(INIT_AXES, CAMERA_POSITION_Y , INIT_AXES);
    }

    public zoomIn(): void {}
    public zoomOut(): void {}

    public setLookAt(): void {
        this.camera.lookAt(new Vector3(INIT_AXES, INIT_AXES, INIT_AXES));
    }
}
