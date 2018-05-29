import { Vector3, Matrix4, Object3D, ObjectLoader, Quaternion, SpotLight, PositionalAudio, AudioListener } from "three";
import { Engine, DEFAULT_MAX_RPM } from "./engine";
import { MS_TO_SECONDS, GRAVITY, RAD_TO_DEG } from "../../constants";
import { Wheel } from "./wheel";
import { Light } from "../class/light";
import { Stopwatch } from "../class/timer/stopwatch";
import { Raycast } from "./Raycast";
import { VirtuaBumperCreator } from "./virtualBumperCreator";
import { BoundsBumpers } from "./boundsBumpers";
import { Results } from "../class/results";

export const DEFAULT_WHEELBASE: number = 2.78;
export const DEFAULT_MASS: number = 1515;
export const DEFAULT_DRAG_COEFFICIENT: number = 0.35;
export const MAX_SPEED: number = 65;
export const SOUND_INTENSITY_FACTOR: number = 20;

const MAXIMUM_STEERING_ANGLE: number = 0.3;
const INITIAL_WEIGHT_DISTRIBUTION: number = 0.5;
const MINIMUM_SPEED: number = 0.05;
const NUMBER_REAR_WHEELS: number = 2;
const NUMBER_WHEELS: number = 4;

const MINIMUM_Z_SPEED: number = 0.05;
const MINIMUM_X_SPEED: number = 1;
const SPEED_X_RESISTANCE: number = 1.025;

const DISTANCE_BETWEEN_CARS: number = 5;
const INITIAL_ROTATION: number = 4;
const VERTICAL_TRANSLATION: number = 2.5;
const FOLLOWED_OBJECT_DISTANCE: number = -5;

const MULTIPLICATOR: number = 1000;

const CAR_TEXTURES: string[] = [ "../../assets/camero/camero-2010-low-poly.json",
                                 "../../assets/camero/camero-2010-low-poly-black.json",
                                 "../../assets/camero/camero-2010-low-poly-blue.json",
                                 "../../assets/camero/camero-2010-low-poly-green.json",
                                 "../../assets/camero/camero-2010-low-poly-red.json",
                                 "../../assets/camero/camero-2010-low-poly-red-white.json",
                                 "../../assets/camero/camero-2010-low-poly-white.json"];

export class Car extends Object3D {
    public isAcceleratorPressed: boolean;

    private readonly engine: Engine;
    private readonly mass: number;
    private readonly rearWheel: Wheel;
    private readonly wheelbase: number;
    private readonly dragCoefficient: number;

    public _speed: Vector3;
    private isBraking: boolean;
    public mesh: Object3D;
    private steeringWheelDirection: number;
    private weightRear: number;
    private _isOutside: {left: boolean, right: boolean};
    private _raycasts: Raycast;
    public _boundsBumpers: BoundsBumpers;
    private _virtualBumperCreator: VirtuaBumperCreator;
    public _directionAngle: number;
    public _spawnPosition: Vector3;
    public lap: number;
    public lapsTime: Stopwatch;
    public results: Results[];
    public onStartingLine: boolean;
    public onTrack: boolean;
    public _name: string;
    public light: Light;
    public isInCollision: boolean[];
    public engineAudio: PositionalAudio;
    public crashAudio: PositionalAudio;
    public limitAudio: PositionalAudio;

    public get speed(): Vector3 {
        return this._speed.clone();
    }
    public get currentGear(): number {
        return this.engine.currentGear;
    }
    public get rpm(): number {
        return this.engine.rpm;
    }
    public get angle(): number {
        return this.mesh.rotation.y * RAD_TO_DEG;
    }
    public get pos(): Vector3 {
        return this.mesh.position;
    }
    public getIsOutside(bumper: number): boolean {
        if (bumper === 0) {
            return this._isOutside.left;
        } else {
            return this._isOutside.right;
        }
    }
    public toggleIsOutside(bumper: number): void {
        if (bumper === 0) {
            this._isOutside.left = !this._isOutside.left;
        } else {
            this._isOutside.right = !this._isOutside.right;
        }
    }

    public get direction(): Vector3 {
        const rotationMatrix: Matrix4 = new Matrix4();
        const carDirection: Vector3 = new Vector3(0, 0, -1);

        rotationMatrix.extractRotation(this.mesh.matrix);
        carDirection.applyMatrix4(rotationMatrix);

        return carDirection;
    }

    public get engineSoundIntensity(): number {
        return this.engine.rpm / DEFAULT_MAX_RPM + 1;
    }

    public constructor(
        engine: Engine = new Engine(),
        rearWheel: Wheel = new Wheel(),
        wheelbase: number = DEFAULT_WHEELBASE,
        mass: number = DEFAULT_MASS,
        dragCoefficient: number = DEFAULT_DRAG_COEFFICIENT) {
        super();

        if (wheelbase <= 0) {
            console.error("Wheelbase should be greater than 0.");
            wheelbase = DEFAULT_WHEELBASE;
        }

        if (mass <= 0) {
            console.error("Mass should be greater than 0.");
            mass = DEFAULT_MASS;
        }

        if (dragCoefficient <= 0) {
            console.error("Drag coefficient should be greater than 0.");
            dragCoefficient = DEFAULT_DRAG_COEFFICIENT;
        }
        this.engine = engine;
        this.rearWheel = rearWheel;
        this.wheelbase = wheelbase;
        this.mass = mass;
        this.dragCoefficient = dragCoefficient;
        this.initializeDefaultAttributes();
    }

    private initializeDefaultAttributes(): void {
        this._raycasts = new Raycast();
        this._boundsBumpers = new BoundsBumpers();
        this.isBraking = false;
        this.steeringWheelDirection = 0;
        this.weightRear = INITIAL_WEIGHT_DISTRIBUTION;
        this._speed = new Vector3(0, 0, 0);
        this._spawnPosition = new Vector3(0, 0, 0);
        this.lap = 1;
        this.lapsTime = new Stopwatch(); this.results = []; this.onTrack = false; this._name = "You";
        this.light = new Light();
        this._isOutside = {left: false, right: false};
        this.isInCollision = new Array<boolean>(false, false, false, false);
    }

    private async load(): Promise<Object3D> {
        const random: number = Math.floor((Math.random() * MULTIPLICATOR) % (CAR_TEXTURES.length));

        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(CAR_TEXTURES[random], (object) => {
                resolve(object);
            });
        });
    }

    public async init(audioListener: AudioListener): Promise<void> {
        this.mesh = await this.load();
        this._virtualBumperCreator = new VirtuaBumperCreator();
        this._virtualBumperCreator.createVirtualBumpers(this.mesh);
        const spotlight: SpotLight = this.light.generateSpots(new Vector3(0 , 1, -1));
        const objectToFollow: Object3D = new Object3D();
        objectToFollow.position.set(0, 0, FOLLOWED_OBJECT_DISTANCE);
        this.mesh.add(objectToFollow);
        this._boundsBumpers.add().forEach((bumper) => {
            this.mesh.add(bumper);
        });

        spotlight.target = objectToFollow;
        this.mesh.add(spotlight);
        this.initialyzeAudio(audioListener);
        this.add(this.mesh);

        this._raycasts.setAllRaycaster(this.mesh);
    }

    private initialyzeAudio(audioListener: AudioListener): void {
        this.engineAudio = new PositionalAudio(audioListener);
        this.crashAudio = new PositionalAudio(audioListener);
        this.limitAudio = new PositionalAudio(audioListener);

        this.mesh.add(this.engineAudio);
        this.mesh.add(this.crashAudio);
        this.mesh.add(this.limitAudio);
    }

    public placeCarOnGrid(gridPlace: number): void {
        this.mesh.translate(this._spawnPosition.length(), (this._spawnPosition).clone().normalize());

        const row: number = Math.floor(gridPlace / 2 );
        const column: number = gridPlace % 2;
        const factor: number = column === 0 ? -1 : 1;

        this.carDirection(this._directionAngle);
        this.mesh.translateOnAxis(this.direction, - (row + 1) * DISTANCE_BETWEEN_CARS );
        this.mesh.translateOnAxis(this.direction.cross(new Vector3(0, 1, 0)), (factor) * VERTICAL_TRANSLATION);
    }

    public carDirection(carAngle: number): void {
        this.mesh.rotateY(carAngle);
    }
    public steerLeft(): void {
        this.steeringWheelDirection = MAXIMUM_STEERING_ANGLE;
    }
    public steerRight(): void {
        this.steeringWheelDirection = -MAXIMUM_STEERING_ANGLE;
    }
    public releaseSteering(): void {
        this.steeringWheelDirection = 0;
    }
    public releaseBrakes(): void {
        this.isBraking = false;
    }
    public brake(): void {
        this.isBraking = true;
    }
    public get raycasts(): Raycast {
        return this._raycasts;
    }

    public update(deltaTime: number): void {
        deltaTime = deltaTime / MS_TO_SECONDS;

        // Move to car coordinates
        const rotationMatrix: Matrix4 = new Matrix4();
        rotationMatrix.extractRotation(this.mesh.matrix);
        const rotationQuaternion: Quaternion = new Quaternion();
        rotationQuaternion.setFromRotationMatrix(rotationMatrix);
        this._speed.applyMatrix4(rotationMatrix);

        // Physics calculations
        this.physicsUpdate(deltaTime);

        // Move back to world coordinates
        this._speed = this.speed.applyQuaternion(rotationQuaternion.inverse());
        this._speed.x /= SPEED_X_RESISTANCE;
        if (Math.abs(this._speed.x) < MINIMUM_X_SPEED) {
            this._speed.x = 0;
        }

        // Angular rotation of the car
        const R: number = DEFAULT_WHEELBASE / Math.sin(this.steeringWheelDirection * (1 - (this._speed.length() / MAX_SPEED)) * deltaTime);
        const omega: number = (this._speed.length() / R);
        this.mesh.rotateY(omega);

        // Set all the raycasters
        this._raycasts.setAllRaycaster(this.mesh);

        this.engineAudio.setPlaybackRate(this.engineSoundIntensity);
        this.engineAudio.setVolume(SOUND_INTENSITY_FACTOR * (this.engineSoundIntensity - 1));
    }

    public addResultFrom(timer: Stopwatch, name: string): void {
        const result: Results =  {} as Results;
        result._name = name;
        result._minutes = timer.getFormattedMinutes();
        result._seconds = timer.getFormattedSeconds();
        result._hundredth = timer.getFormattedHundredth();
        this.results.push(result);
    }

    public placeCar(position: Vector3): void {
        this.mesh.rotateY(INITIAL_ROTATION);
        this.mesh.translateX(position.x);
        this.mesh.translateY(position.z);
    }

    private physicsUpdate(deltaTime: number): void {
        this.rearWheel.angularVelocity += this.getAngularAcceleration() * deltaTime;
        this.engine.update(this._speed.length(), this.rearWheel.radius);
        this.weightRear = this.getWeightDistribution();
        this._speed.add(this.getDeltaSpeed(deltaTime));
        this._speed.setLength(((this._speed.length() <= MINIMUM_SPEED) || !this.isGoingForward()) ? 0 : this._speed.length());
        this.mesh.position.add(this.getDeltaPosition(deltaTime));
        this.rearWheel.update(this._speed.length());
    }

    private getWeightDistribution(): number {
        const acceleration: number = this.getAcceleration().length();
        /* tslint:disable:no-magic-numbers */
        const distribution: number =
            this.mass + (1 / this.wheelbase) * this.mass * acceleration / 2;

        return Math.min(Math.max(0.25, distribution), 0.75);
        /* tslint:enable:no-magic-numbers */
    }

    private getLongitudinalForce(): Vector3 {
        const resultingForce: Vector3 = new Vector3();

        if (this._speed.length() >= MINIMUM_SPEED) {
            const dragForce: Vector3 = this.getDragForce();
            const rollingResistance: Vector3 = this.getRollingResistance();
            resultingForce.add(dragForce).add(rollingResistance);
        }

        if (this.isAcceleratorPressed) {
            const tractionForce: number = this.getTractionForce();
            const accelerationForce: Vector3 = this.direction;
            accelerationForce.multiplyScalar(tractionForce);
            resultingForce.add(accelerationForce);
        } else if (this.isBraking && this.isGoingForward()) {
            const brakeForce: Vector3 = this.getBrakeForce();
            resultingForce.add(brakeForce);
        }

        return resultingForce;
    }

    private getRollingResistance(): Vector3 {
        const tirePressure: number = 1;
        // formula taken from: https://www.engineeringtoolbox.com/rolling-friction-resistance-d_1303.html

        // tslint:disable-next-line:no-magic-numbers
        const rollingCoefficient: number = (1 / tirePressure) * (Math.pow(this.speed.length() * 3.6 / 100, 2) * 0.0095 + 0.01) + 0.005;

        return this.direction.multiplyScalar(rollingCoefficient * this.mass * GRAVITY);
    }

    private getDragForce(): Vector3 {
        const carSurface: number = 3;
        const airDensity: number = 1.2;
        const resistance: Vector3 = this.direction;
        resistance.multiplyScalar(airDensity * carSurface * -this.dragCoefficient * this.speed.length() * this.speed.length());

        return resistance;
    }

    private getTractionForce(): number {
        const force: number = this.getEngineForce();
        const maxForce: number =
            this.rearWheel.frictionCoefficient * this.mass * GRAVITY * this.weightRear * NUMBER_REAR_WHEELS / NUMBER_WHEELS;

        return -Math.min(force, maxForce);
    }

    private getAngularAcceleration(): number {
        return this.getTotalTorque() / (this.rearWheel.inertia * NUMBER_REAR_WHEELS);
    }
    private getBrakeForce(): Vector3 {
        return this.direction.multiplyScalar(this.rearWheel.frictionCoefficient * this.mass * GRAVITY);
    }
    private getBrakeTorque(): number {
        return this.getBrakeForce().length() * this.rearWheel.radius;
    }
    private getTractionTorque(): number {
        return this.getTractionForce() * this.rearWheel.radius;
    }
    private getTotalTorque(): number {
        return this.getTractionTorque() * NUMBER_REAR_WHEELS + this.getBrakeTorque();
    }
    private getEngineForce(): number {
        return this.engine.getDriveTorque() / this.rearWheel.radius;
    }
    private getAcceleration(): Vector3 {
        return this.getLongitudinalForce().divideScalar(this.mass);
    }
    private getDeltaSpeed(deltaTime: number): Vector3 {
        return this.getAcceleration().multiplyScalar(deltaTime);
    }
    private getDeltaPosition(deltaTime: number): Vector3 {
        return this.speed.multiplyScalar(deltaTime);
    }
    private isGoingForward(): boolean {
        return this.speed.normalize().dot(this.direction) > MINIMUM_Z_SPEED;
    }
}
