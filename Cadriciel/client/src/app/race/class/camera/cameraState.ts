import { Car } from "./../../car/car";
import { ThirdPersonCamera } from "./thirdPersonCamera";
import { TopViewCamera } from "./topViewCamera";
import { FirstPersonCamera } from "./firstPersonCamera";
import { Camera } from "./camera";
import { TrackEditorCamera } from "./trackEditorCamera";
import { AudioListener } from "three";

const CAMERA_NUMBER: number = 3;

const THIRD_PERSON: number = 0;
const FIRST_PERSON: number = 1;
const TOP_VIEW: number = 2;
const EDITOR_VIEW: number = 3;
const INIT_STATE: number = 0;

export class CameraState {
    private _state: number;
    private _thirdPersonCamera: ThirdPersonCamera;
    private _topViewCamera: TopViewCamera;
    private _firstPersonCamera: FirstPersonCamera;
    private _trackEditorCamera: TrackEditorCamera;
    private _currentCamera: Camera;

    public get state(): number {
        return this._state;
    }

    public get thirdPersonCamera (): ThirdPersonCamera {
        return this._thirdPersonCamera;
    }

    public get topViewCamera (): TopViewCamera {
        return this._topViewCamera;
    }

    public get firstPersonCamera (): FirstPersonCamera {
        return this._firstPersonCamera;
    }

    public get trackEditorCamera (): TrackEditorCamera {
        return this._trackEditorCamera;
    }

    public constructor(private aspect: number, private car: Car, listener: AudioListener) {
        this._thirdPersonCamera = new ThirdPersonCamera(this.aspect, this.car);
        this._topViewCamera = new TopViewCamera(this.car);
        this._firstPersonCamera = new FirstPersonCamera(this.aspect, this.car);
        this._trackEditorCamera = new TrackEditorCamera();
        this._state = INIT_STATE;
        this._currentCamera = this._thirdPersonCamera;
        this.addAudioListener(listener);
    }

    public currentCamera(): Camera {
        return this._currentCamera;
    }

    public initializeCurrentCamera(): void {
        this._currentCamera.initialized();
    }

    public initializedTrackEditorCamera(): void {
        this._state = EDITOR_VIEW;
        this._currentCamera = this._trackEditorCamera;
        this._trackEditorCamera.initialized();
    }

    public updateCurrentCamera(): void {
        this._currentCamera.updateCamera();
    }

    public updateProjectionMatrix(): void {
        this._currentCamera.updateMatrix();
    }

    private nextCameraIndex(): number {
        this._state++;
        if (this._state >= CAMERA_NUMBER) {
            this._state = INIT_STATE;
        }

        return this._state;
    }

    public nextCamera(): void {
        this.nextCameraIndex();

        if (this.state === THIRD_PERSON) {
            this.switchToThirdPersonCamera();
        } else if (this.state === FIRST_PERSON) {
            this.switchToFirstPerson();
        } else if (this.state === TOP_VIEW) {
            this.switchToTopViewCamera();
        }
    }

    private addAudioListener(listener: AudioListener): void {
        this._thirdPersonCamera.getCamera().add( listener );
        this._topViewCamera.getCamera().add(listener);
        this._firstPersonCamera.getCamera().add(listener);
    }

    private switchToThirdPersonCamera(): void {
        this._currentCamera = this._thirdPersonCamera;
        this._thirdPersonCamera.initialized();
    }

    private switchToTopViewCamera(): void {
        this._currentCamera = this._topViewCamera;
        this._topViewCamera.initialized();
    }

    private switchToFirstPerson(): void {
        this._currentCamera = this._firstPersonCamera;
        this._firstPersonCamera.initialized();
    }

    public zoomIn(): void {
        this._currentCamera.zoomIn();
    }

    public zoomOut(): void {
        this._currentCamera.zoomOut();
    }
}
