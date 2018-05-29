import { TypingHandler } from "./typing-handler";
import { CameraState } from "../class/camera/cameraState";

const ZOOM_IN_KEYCODE: number = 187;             // +
const ZOOM_OUT_KEYCODE: number = 189;            // -

const CAMERA_CYCLE_KEYCODE: number = 67;       // C

export const VIEWCODES: number[] = [ZOOM_IN_KEYCODE, ZOOM_OUT_KEYCODE, CAMERA_CYCLE_KEYCODE];

export class ViewHandler implements TypingHandler {

    public constructor(private _cameras: CameraState) {}

    public handleKeyDown(eventCode: number): void {
        switch (eventCode) {
            case ZOOM_IN_KEYCODE:
                this._cameras.zoomIn();
                break;
            case ZOOM_OUT_KEYCODE:
                this._cameras.zoomOut();
                break;
            case CAMERA_CYCLE_KEYCODE:
                this._cameras.nextCamera();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(eventCode: number): void {}
}
