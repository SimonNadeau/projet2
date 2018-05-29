import { Component } from "@angular/core";
import { GameInformation, Player } from "../interface/gameInformation";
import { GameMode, Difficulty } from "../interface/configuration";
import { InvalidPlayerError } from "../../../../../common/error/invalidPlayerError";

const SINGLEPLAYER_TEXT: string = "Single Player";
const MULTIPLAYER_TEXT: string = "Multiplayer";
const EASY_TEXT: string = "Easy";
const MEDIUM_TEXT: string = "Medium";
const HARD_TEXT: string = "Hard";

@Component({
  selector: "app-relevant-information-view",
  templateUrl: "./relevant-information-view.component.html",
  styleUrls: ["./relevant-information-view.component.css"]
})
export class RelevantInformationViewComponent {

  private _gameInformation: GameInformation;

  public constructor() {
    this._gameInformation = {
      roomName: undefined,
      difficulty: undefined,
      gameMode: undefined,
      players: []
    };
   }

  public get gameMode(): string {
    if (this._gameInformation.gameMode === GameMode.single) {
      return SINGLEPLAYER_TEXT;
    }

    return MULTIPLAYER_TEXT;
  }

  public get playersInfo(): Player[] {
    return this._gameInformation.players;
  }

  public get gameDifficulty(): string {

    if (this._gameInformation.difficulty === Difficulty.easy) {
      return EASY_TEXT;
    } else if (this._gameInformation.difficulty === Difficulty.medium) {
      return MEDIUM_TEXT;
    }

    return HARD_TEXT;
  }

  public updateAPlayerScore(name: string): void {
    this._gameInformation.players[(this.findPlayerByName(name, 0))].score += 1;
  }

  public updateGameInformation(newInformation: GameInformation): void {
    this._gameInformation = newInformation;
  }

  private findPlayerByName(name: string, index: number): number {
    if (index >= this._gameInformation.players.length) {
      throw new InvalidPlayerError();
    }

    if (this._gameInformation.players[index].name === name) {
      return index;
    }

    return this.findPlayerByName(name, index + 1);
  }

}
