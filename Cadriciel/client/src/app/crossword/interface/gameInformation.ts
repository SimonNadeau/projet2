import { GameMode, Difficulty } from "../interface/configuration";

export interface Player {
    name: string;
    score: number;
}

export interface GameInformation {
    roomName: string;
    difficulty: Difficulty;
    gameMode: GameMode;
    players: Array<Player> ;
}
