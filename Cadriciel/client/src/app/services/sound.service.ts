import { Injectable } from "@angular/core";
import { PositionalAudio, AudioBuffer, AudioLoader, AudioListener } from "three";
import { Car } from "../race/car/car";

const ENGINE_PATH: string = "../../assets/sounds/engine.wav";
const COLLISION_PATH: string = "../../assets/sounds/collision.wav";
const START_PATH: string = "../../assets/sounds/start.mp3";
const LIMIT_PATH: string = "../../assets/sounds/limit.mp3";

@Injectable()
export class SoundService {

    private _audioLoader: AudioLoader;

    public constructor() {
        this._audioLoader = new AudioLoader();
    }

    private load (soundPath: string, positionalAudio: PositionalAudio, looping: boolean, basicVolume: number): void {
        this._audioLoader.load(soundPath, ( buffer: AudioBuffer ) => {
            positionalAudio.setBuffer( buffer );
            positionalAudio.setLoop(looping);
            positionalAudio.setVolume(basicVolume);
            positionalAudio.play();
            }
                             , null, null);
    }

    public initializeCar(car: Car): void {
        this.load(ENGINE_PATH, car.engineAudio, true, 0);
        this.load(COLLISION_PATH, car.crashAudio, false, 0);
        this.load(LIMIT_PATH, car.limitAudio, false, 0);
    }

    public initializeStart(): void {
        this.load(START_PATH, new PositionalAudio(new AudioListener()), false, 1);
    }
}
