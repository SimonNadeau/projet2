import { VirtualPlayer } from "./virtualPlayer";

import { Vector3, AudioListener } from "three";

export const NUMBER_OF_VIRTUAL_CARS: number = 3;

export class VirtualPlayersHandler {
    public virtualPlayers: VirtualPlayer[];

    public constructor(tmpPoints: Array<Vector3>, initialAngle: number) {
        this.virtualPlayers = new Array<VirtualPlayer>();
        for (let i: number = 0; i < NUMBER_OF_VIRTUAL_CARS; i++) {
            this.virtualPlayers.push(new VirtualPlayer(tmpPoints, initialAngle, i + 1));
        }
    }

    public placeCar(startingPosition: Vector3, filledSpace: number, angle: number): void {
        let currentSpace: number = 0;
        this.virtualPlayers.forEach((vPlayer) => {
            vPlayer._spawnPosition = new Vector3(startingPosition.x, startingPosition.y, -startingPosition.z);
            vPlayer._directionAngle = angle;
            if (currentSpace === filledSpace) {
                currentSpace++;
            }
            vPlayer.placeCarOnGrid(currentSpace++);
        });
    }

    public update(timeSinceLastFrame: number): void {
        this.virtualPlayers.forEach((vPlayer) => {
            vPlayer.update(timeSinceLastFrame);
        });
    }

    public updateTime(): void {
        this.virtualPlayers.forEach((vPlayer) => {
            vPlayer.lapsTime.update();
        });
    }

    public async init(audioListener: AudioListener): Promise<void> {
        for (const vPlayer of this.virtualPlayers) {
            await vPlayer.init(audioListener);
        }
    }
}
