// import { GameMode } from "../game-configuration/configuration-game-mode/configuration-game-mode.component";
// import { Difficulty } from "../game-configuration/configuration-difficulty/configuration-difficulty.component";
// import { LobbyOptions } from "../game-configuration/configuration-lobby/configuration-lobby.component";

export interface Configuration {
    gameMode: GameMode;
    difficulty: Difficulty;
    lobbyOption: LobbyOptions;
    playerName: string;
}

export const enum LobbyOptions {
    unkown = 0,
    join = 1,
    create = 2
}

export const enum GameMode {
    unkown = 0,
    single = 1,
    multi = 2
}

export enum Difficulty {
    easy = 0,
    medium = 1,
    hard = 2
}
