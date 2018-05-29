import { Injectable } from "@angular/core";
import Stats = require("stats.js");
import { WebGLRenderer, Scene, Mesh, Vector3, AudioListener } from "three";
import { Car } from "../race/car/car";
import { VirtualPlayersHandler, NUMBER_OF_VIRTUAL_CARS } from "../race/class/ai/virtualPlayersHandler";
import { CameraState } from "../race/class/camera/cameraState";
import { TrackGenerator } from "../race/class/trackGenerator";
import { KeyHandler } from "../race/event-handler/key-handler";
import { Loader } from "../race/class/loader";
import { Light } from "../race/class/light";
import { SoundService } from "../services/sound.service";
import { RaceState } from "../race/class/raceEvent/raceState";
import { FLOOR_NAME } from "../constants";

const ZERO_LENGTH: number = 0;
const MIDDLE_LENGTH: number = 0.1;
const LONG_LENGTH: number = 0.2;

const MULTIPLICATOR: number = 100;

const X: number = 0;
const Y: number = 1;
const Z: number = 2;

export const EDITOR_TO_GAME: number = 1000;
const PREVIEW_ZOOM: number = 0.001;

export const DEFAULT_TRACK: Array<Array<number>> = [[MIDDLE_LENGTH, ZERO_LENGTH, ZERO_LENGTH],
                                                    [MIDDLE_LENGTH, ZERO_LENGTH, MIDDLE_LENGTH],
                                                    [ZERO_LENGTH, ZERO_LENGTH, LONG_LENGTH],
                                                    [ZERO_LENGTH, ZERO_LENGTH, ZERO_LENGTH],
                                                    [MIDDLE_LENGTH, ZERO_LENGTH, ZERO_LENGTH]];

@Injectable()
export class RenderService {
    private _cameras: CameraState;
    private _container: HTMLDivElement;
    private _car: Car;
    private _renderer: WebGLRenderer;
    public scene: THREE.Scene;
    private _stats: Stats;
    private _virtualPlayersHandler: VirtualPlayersHandler;
    private _trackGen: TrackGenerator;
    private _listener: AudioListener;
    private _soundService: SoundService;
    public raceState: RaceState;
    public keyHandler: KeyHandler;
    public loader: Loader;
    public light: Light;

    public get car(): Car {
        return this._car;
    }

    public get virtualCars(): VirtualPlayersHandler {
        return this._virtualPlayersHandler;
    }

    public getAllCars(): Car[] {
        if ( this._virtualPlayersHandler === undefined) {
            return undefined;
        }
        const cars: Car[] = [];
        cars.push(this.car);
        this.virtualCars.virtualPlayers.forEach((vPlayer) => {
            cars.push(vPlayer);
        });

        return cars;
    }

    private toVector(positions: Array<Array<number>>): Vector3[] {
        const positionVectors: Array<Vector3> = new Array<Vector3>();
        positions.forEach((array) => {
            positionVectors.push(new Vector3(array[X] * EDITOR_TO_GAME, array[Y], array[Z] * -EDITOR_TO_GAME));
        });

        return positionVectors;
    }

    public constructor() {
        this._trackGen = new TrackGenerator(this.toVector(DEFAULT_TRACK));
        this._car = new Car();
        this.loader = new Loader();
        this.light = new Light();
        this._listener = new AudioListener();
        this._soundService = new SoundService();
        this.raceState = new RaceState(this);
    }

    public async initialize(container: HTMLDivElement, isInGameMode: boolean, selectedTrack: Array<Array<number>>): Promise<void> {
        if (container) {
            this._container = container;
        }
        await this.createScene(isInGameMode, selectedTrack).then(() => {
            this.initStats();
            this.startRenderingLoop();
        });
    }

    protected initStats(): void {
        this._stats = new Stats();
        this._stats.dom.style.position = "absolute";
        this._container.appendChild(this._stats.dom);
    }

    protected update(): void {
        this.raceState.update();

        this._cameras.updateCurrentCamera();
    }

    private clearPreview(): void {
        if (this.scene.children.length > 1) {
            while (this.scene.children[this.scene.children.length - 1].name !== FLOOR_NAME) {
                this.scene.children.pop();
            }
        }
    }

    public loadSelectedTrack(selectedTrack: Array<Array<number>>): void {
        this.clearPreview();
        this._trackGen = new TrackGenerator(this.toVector(selectedTrack));
        const trackArray: Mesh[] = this._trackGen.generateTrack();
        trackArray.forEach((currentplane) => {
            this.scene.add(currentplane);
        });

        const intersectionArray: Mesh[] = this._trackGen.generateIntersection();
        intersectionArray.forEach((currentIntersection) => {
            this.scene.add(currentIntersection);
        });

        this.scene.add(this._trackGen.generateStartingLine());

        const startStructureArray: Mesh[] = this._trackGen.generatePosts();
        startStructureArray.forEach((currentPost) => {
            this.scene.add(currentPost);
        });

        this.scene.add(this._trackGen.generateSponsor());
    }

    protected async createScene(isInGameMode: boolean, selectedTrack: Array<Array<number>>): Promise<void> {
        this.scene = new Scene();

        this._cameras = new CameraState(this.getAspectRatio(), this._car, this._listener);
        this._car.add(this._listener);
        this.scene.add(this.light.ambientLight);

        if (selectedTrack !== undefined) {
            this.loadSelectedTrack(selectedTrack);
        }
        await this.createCars(isInGameMode);

        this.loader.mesh().forEach((currentMesh) => {
            currentMesh.name = FLOOR_NAME;
            this.scene.add(currentMesh);
        });

        this.keyHandler = new KeyHandler(this._car, this._cameras, this);
    }

    public carGridPosition(): number {
        return Math.floor((Math.random() * MULTIPLICATOR) % (NUMBER_OF_VIRTUAL_CARS + 1));
    }

    private async createCars(isInGameMode: boolean): Promise<void> {
        this._car._spawnPosition = new Vector3(this._trackGen.startingLinePosition.x,
                                               this._trackGen.startingLinePosition.y,
                                               -this._trackGen.startingLinePosition.z);

        const carGridPosition: number = this.carGridPosition();

        this._car._directionAngle = this._trackGen.initialAngle;
        await this._car.init(this._listener);
        this._car.placeCarOnGrid(carGridPosition);
        this._soundService.initializeCar(this._car);

        this._virtualPlayersHandler = new VirtualPlayersHandler(this._trackGen.trackNodes, this._trackGen.initialAngle);
        await this._virtualPlayersHandler.init(this._listener);
        this._virtualPlayersHandler.placeCar(this._trackGen.startingLinePosition, carGridPosition, this._trackGen.initialAngle);

        if (isInGameMode) {
            this._cameras.initializeCurrentCamera();
            this.scene.add(this._car);
            this._virtualPlayersHandler.virtualPlayers.forEach((vPlayer) => {
                this._soundService.initializeCar(vPlayer);
                this.scene.add(vPlayer);
            });
            this.raceState.start();
        } else {
            this._cameras.initializedTrackEditorCamera();
            this._cameras.trackEditorCamera.getCamera().zoom = PREVIEW_ZOOM;
            this._cameras.updateProjectionMatrix();
        }
    }

    protected getAspectRatio(): number {
        return this._container.clientWidth / this._container.clientHeight;
    }

    protected startRenderingLoop(): void {
        this._renderer = new WebGLRenderer();
        this._renderer.setPixelRatio(devicePixelRatio);
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
        this._container.appendChild(this._renderer.domElement);
        this.render();
    }

    protected render(): void {
        requestAnimationFrame(() => this.render());
        this.update();
        this._renderer.render(this.scene, this._cameras.currentCamera().getCamera());
        this._stats.update();
    }

    public onResize(): void {
        this._cameras.updateProjectionMatrix();
        this._renderer.setSize(this._container.clientWidth, this._container.clientHeight);
    }

    public clearRender(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }
}
