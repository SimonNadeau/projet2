import { Car } from "../car/car";
import { CameraState } from "../class/camera/cameraState";

import { SteeringHandler, STEERINGCODES } from "./steering-handler";
import { ViewHandler, VIEWCODES } from "./view-handler";
import { ModeHandler, MODECODES } from "./mode-handler";
import { RenderService } from "../../render-service/render.service";

export class KeyHandler {

    private _steeringHandler: SteeringHandler;
    private _viewHandler: ViewHandler;
    private _modeHandler: ModeHandler;

    public constructor(car: Car, cameras: CameraState, render: RenderService) {
        this._steeringHandler = new SteeringHandler(car);
        this._viewHandler = new ViewHandler(cameras);
        this._modeHandler = new ModeHandler(render);
    }

    public handleKeyDown(event: KeyboardEvent): void {
        if (STEERINGCODES.includes(event.keyCode)) {
            this._steeringHandler.handleKeyDown(event.keyCode);
        }
        if (VIEWCODES.includes(event.keyCode)) {
            this._viewHandler.handleKeyDown(event.keyCode);
        }
        if (MODECODES.includes(event.keyCode)) {
            this._modeHandler.handleKeyDown(event.keyCode);
        }
    }

    public handleKeyUp(event: KeyboardEvent): void {
        if (STEERINGCODES.includes(event.keyCode)) {
            this._steeringHandler.handleKeyUp(event.keyCode);
        }
    }
}
