import { AmbientLight, SpotLight, Vector3 } from "three";

const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY_DAY: number = 0.5;
const AMBIENT_LIGHT_OPACITY_NIGHT: number = 0.3;
const DISTANCE: number = 50;
const ANGLE: number = 0.6;
const INTENSITY: number = 4;
const PENUMBRA: number = 0.7;

export class Light {
    public isNightMode: boolean = false;
    public isSpotsOn: boolean = false;
    private currentLightOpacity: number = AMBIENT_LIGHT_OPACITY_DAY;
    public ambientLight: AmbientLight;
    public spotLight: SpotLight;

    public constructor() {
        this.init();
    }

    private init(): void {
        this.ambientLight = new AmbientLight(WHITE, this.currentLightOpacity);
        this.ambientLight.name = "ambiantLight";

    }

    public ambientIntensity(): number {
        this.isNightMode = !this.isNightMode;

        return this.isNightMode ? AMBIENT_LIGHT_OPACITY_NIGHT : AMBIENT_LIGHT_OPACITY_DAY;
    }

    public toggleSpots(): void {
        this.isSpotsOn = !this.isSpotsOn;
    }

    public spotIntensity(): number {

        return this.isSpotsOn ? INTENSITY : 0;
    }

    public generateSpots(position: Vector3): SpotLight {
        this.spotLight = new SpotLight( WHITE, 0, DISTANCE, ANGLE, PENUMBRA );
        this.spotLight.position.set(position.x, position.y, position.z );
        this.spotLight.intensity = 0;
        this.spotLight.name = "spot";

        return this.spotLight;
    }
}
