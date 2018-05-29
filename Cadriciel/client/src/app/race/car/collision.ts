import { Vector3 } from "three";
import { Car, MAX_SPEED, SOUND_INTENSITY_FACTOR } from "./car";
import { PI_OVER_2 } from "../../constants";

const FRONT_TRANSLATION_DISTANCE: number = -0.98;
const BACK_TRANSLATION_DISTANCE: number = 0.78;
const TRANSLATION_DISTANCES: number[] = [FRONT_TRANSLATION_DISTANCE, 0, BACK_TRANSLATION_DISTANCE];

const VIRTUAL_BUMPER_RADIUS: number = 0.61;

const FIRST_CAR_SPEED: number = 0;
const SECOND_CAR_SPEED: number = 1;
const ANGLE_BETWEEN_CARS: number = 2;
const FRONT: number = 1;
const BACK: number = 3;

export interface CollisionDetection {
    collisionDetected: boolean;
    firstCollisionPoint: number;
    secondCollisionPoint: number;
}

export class Collision {

    public checkCollision(cars: Car[]): void {
        for (let i: number = 0; i < cars.length; i++) {
            for (let j: number = i; j < cars.length; j++) {
                if (i !== j) {
                    const collisionDetection: CollisionDetection = this.computeVirtualBumpers(cars[i], cars[j]);

                    if (!cars[i].isInCollision[j] && !cars[j].isInCollision[i]
                        && collisionDetection.collisionDetected) {
                            cars[i].isInCollision[j] = true;
                            cars[j].isInCollision[i] = true;
                            this.reactToCollision(cars[i], cars[j], collisionDetection);

                    } else if (!collisionDetection.collisionDetected) {
                        cars[i].isInCollision[j] = false;
                        cars[j].isInCollision[i] = false;
                    }
                }
            }
        }
    }

    private computeVirtualBumpers(firstCar: Car, secondCar: Car): CollisionDetection {
        this.updateVirtualBumpers(firstCar);
        this.updateVirtualBumpers(secondCar);
        const collisionDetection: CollisionDetection = this.detectCollisions(firstCar, secondCar);
        this.resetVirtualBumpers(firstCar);
        this.resetVirtualBumpers(secondCar);

        return collisionDetection;
    }

    private updateVirtualBumpers(car: Car): void {
        for (let point: number = 1; point < car.mesh.children.length; point++) {
            car.mesh.children[point].translateOnAxis(car.mesh.getWorldDirection(), TRANSLATION_DISTANCES[point - 1]);
        }
    }

    private resetVirtualBumpers(car: Car): void {
        for (let point: number = 1; point < car.mesh.children.length; point++) {
            car.mesh.children[point].translateOnAxis(car.mesh.getWorldDirection(), -TRANSLATION_DISTANCES[point - 1]);
        }
    }

    private extractCarDatas(firstCar: Car, secondCar: Car): number[] {
        const carDatas: number[] = new Array<number>();
        carDatas.push(firstCar._speed.length());
        carDatas.push(secondCar._speed.length());
        carDatas.push(this.getAngleBetweenCars(firstCar.mesh.getWorldDirection().multiplyScalar(-1),
                                               secondCar.mesh.getWorldDirection().multiplyScalar(-1)));

        return carDatas;
    }

    private reactToCollision(firstCar: Car, secondCar: Car, collisionDetection: CollisionDetection): void {
        const carDatas: number[] = this.extractCarDatas(firstCar, secondCar);

        this.addSounds(firstCar, secondCar, carDatas);
        this.swapCarSpeeds(firstCar, secondCar, carDatas);
        this.rotateCars(firstCar, secondCar, carDatas[ANGLE_BETWEEN_CARS], collisionDetection);
    }

    private playCollisionSound(car: Car, carDatas: number[]): void {
        car.crashAudio.setVolume(SOUND_INTENSITY_FACTOR * Math.abs(carDatas[FIRST_CAR_SPEED] - carDatas[SECOND_CAR_SPEED]) / (MAX_SPEED));
        car.crashAudio.play();
    }

    private addSounds(firstCar: Car, secondCar: Car, carDatas: number[]): void {
        this.playCollisionSound(firstCar, carDatas);
        this.playCollisionSound(secondCar, carDatas);
    }

    private getAngleBetweenCars(firstCarDirection: Vector3, secondCarDirection: Vector3): number {
        return (this.getWorldAngle(firstCarDirection) - this.getWorldAngle(secondCarDirection));
    }

    private getWorldAngle(carDirection: Vector3): number {
        const zAxisDirection: Vector3 = new Vector3(0, 0, 1);
        const angle: number = Math.acos(carDirection.dot(zAxisDirection) /
                                    (carDirection.length() * zAxisDirection.length()));
        if (carDirection.x > 0) {
            return -angle;
        } else {
            return angle;
        }
    }

    private swapCarSpeeds(firstCar: Car, secondCar: Car, carDatas: number[]): void {
        this.swapXSpeeds(firstCar, secondCar, carDatas);
        this.swapZSpeeds(firstCar, secondCar, carDatas);
    }

    private swapZSpeeds(firstCar: Car, secondCar: Car, carDatas: number[]): void {
        firstCar._speed.z = -carDatas[SECOND_CAR_SPEED] * Math.cos(carDatas[ANGLE_BETWEEN_CARS]);
        secondCar._speed.z = -carDatas[FIRST_CAR_SPEED] * Math.cos(carDatas[ANGLE_BETWEEN_CARS]);
    }

    private swapXSpeeds(firstCar: Car, secondCar: Car, carDatas: number[]): void {
        firstCar._speed.x = -carDatas[SECOND_CAR_SPEED] * Math.sin(carDatas[ANGLE_BETWEEN_CARS]);
        secondCar._speed.x = carDatas[FIRST_CAR_SPEED] * Math.sin(carDatas[ANGLE_BETWEEN_CARS]);
    }

    private rotateCars(firstCar: Car, secondCar: Car, angleBetweenCars: number, collisionDetection: CollisionDetection): void {
        this.rotateCarY(firstCar, angleBetweenCars, collisionDetection.firstCollisionPoint);
        this.rotateCarY(secondCar, -angleBetweenCars, collisionDetection.secondCollisionPoint);
    }

    private clampAngle(angle: number): number {
        if (Math.abs(angle) > Math.PI) {
            return (angle - Math.sign(angle) * 2 * Math.PI);
        } else {
            return angle;
        }
    }

    private rotateCarY(car: Car, angleBetweenCars: number, collisionPoint: number): void {
        const angle: number = this.clampAngle(angleBetweenCars);
        let rotationDirection: number = 0;

        if (collisionPoint === FRONT) {
            rotationDirection = 1;
        } else if (collisionPoint === BACK) {
            rotationDirection = -1;
        }

        if (rotationDirection !== 0) {
            if (angle >= -PI_OVER_2 && angle <= PI_OVER_2) {
                car.mesh.rotateY(rotationDirection * angle / 2);
            } else if (angle < -PI_OVER_2 || angle > PI_OVER_2) {
                car.mesh.rotateY(rotationDirection * (Math.sign(angle) * Math.PI - angle) / 2);
            }
        }
    }

    private detectCollisions(firstCar: Car, secondCar: Car): CollisionDetection {
        for (let firstPoint: number = 1; firstPoint < TRANSLATION_DISTANCES.length + 1; firstPoint++) {
            for (let secondPoint: number = 1; secondPoint < TRANSLATION_DISTANCES.length + 1; secondPoint++) {
                if (this.distanceBetweenPoints(firstCar, secondCar, firstPoint, secondPoint) < VIRTUAL_BUMPER_RADIUS * 2) {
                    return {collisionDetected: true, firstCollisionPoint: firstPoint, secondCollisionPoint: secondPoint};
                }
            }
        }

        return {collisionDetected: false, firstCollisionPoint: undefined, secondCollisionPoint: undefined};
    }

    private distanceBetweenPoints(firstCar: Car, secondCar: Car, firstPoint: number, secondPoint: number): number {
        return ((Math.sqrt(
            (firstCar.mesh.children[firstPoint].getWorldPosition().x - secondCar.mesh.children[secondPoint].getWorldPosition().x) ** 2
            + (firstCar.mesh.children[firstPoint].getWorldPosition().z - secondCar.mesh.children[secondPoint].getWorldPosition().z) ** 2)));
    }
}
