import { TypingHandler } from "./typing-handler";
import { RenderService } from "../../render-service/render.service";

const NIGHT_MODE_KEY: number = 78;      // N
const TOGGLE_LIGHTS_KEY: number = 76;   // L

export const MODECODES: number[] = [NIGHT_MODE_KEY, TOGGLE_LIGHTS_KEY];

export class ModeHandler implements TypingHandler {

    public constructor(private render: RenderService) {}

    public handleKeyDown(eventCode: number): void {
        switch (eventCode) {
            case NIGHT_MODE_KEY:
                this.render.light.ambientLight.intensity = this.render.light.ambientIntensity();
                this.render.light.isSpotsOn = this.render.light.isNightMode;
                this.setSpots();
                this.render.scene.children.pop();
                this.render.loader.isNightMode = !this.render.loader.isNightMode;
                this.render.scene.add(this.render.loader.loadSkyBox());
                break;
            case TOGGLE_LIGHTS_KEY:
                this.render.light.toggleSpots();
                this.setSpots();
                break;
            default:
                break;
        }
    }

    public handleKeyUp(eventCode: number): void {
    }

    private setSpots(): void {
        this.render.car.light.spotLight.intensity = this.render.light.spotIntensity();
        this.render.virtualCars.virtualPlayers.forEach((vPlayer) => {
            vPlayer.light.spotLight.intensity = this.render.light.spotIntensity();
        });
    }
}
