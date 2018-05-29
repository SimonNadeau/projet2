import { Component, Output , EventEmitter } from "@angular/core";
import { GameInformation } from "../../interface/gameInformation";
import { Difficulty, LobbyOptions } from "../../interface/configuration";

interface Room {
  id: string;
  game: GameInformation;
}
interface LoginInfo {
  id: string;
  name: string;
}

const BTN_UNLOCK: string = "button";
const BTN_LOCK: string = "buttonNotAvailable";
const EMPTY: string = "";
const RED_INPUT_TEXT: string = "inputTextRed";

const enum DifficultyText {
  easy = "Easy",
  medium = "Medium",
  hard = "Hard"
}

const enum ColorClass {
  easy = "easyGame",
  medium = "mediumGame",
  hard = "hardGame"
}

@Component({
  selector: "app-configuration-lobby",
  templateUrl: "./configuration-lobby.component.html",
  styleUrls: ["./configuration-lobby.component.css"]
})
export class ConfigurationLobbyComponent {

  @Output() public notifyLobbyOption: EventEmitter<LobbyOptions>;
  @Output() public notifyPlayerName: EventEmitter<string>;
  @Output() public notifyJoinRoom: EventEmitter<LoginInfo>;

  private _nameChoosed: boolean;
  private _name: string;
  private _rooms: Room[];
  private _redInput: boolean;

  public constructor() {
    this.notifyLobbyOption = new EventEmitter<LobbyOptions>();
    this.notifyPlayerName = new EventEmitter<string>();
    this.notifyJoinRoom = new EventEmitter<LoginInfo>();
    this._nameChoosed = false;
    this._redInput = false;
  }

  private updateBtnStatus(text: string): void {
     this._nameChoosed = !(text === undefined || text === EMPTY);
  }

  public set rooms(roomList: Room[]) {
      this._rooms = roomList;
  }
  public get rooms(): Room[] {
    return this._rooms;
}

  public emitOption(option: LobbyOptions): void  {
    if (!this._nameChoosed) {
      this._redInput = true;
    } else {
      this.notifyLobbyOption.emit(option);
    }
  }

  public joinGame(room: Room): void {
    if ( this._nameChoosed && this._name !== room.game.roomName) {
      this.notifyJoinRoom.emit({id: room.id, name: this._name});
    } else {
      this._redInput = true;
    }
  }

  public set playerName(name: string) {
    this._name  = name;
    this.notifyPlayerName.emit(name);
    this.updateBtnStatus(name);
  }

  public giveButtonClass(): string {
    return (this._nameChoosed) ? BTN_UNLOCK : BTN_LOCK;
  }

  public giveRoomColor(room: Room): string {
    if (room.game.difficulty === Difficulty.medium) {
      return ColorClass.medium;
    } else if (room.game.difficulty === Difficulty.hard) {
      return ColorClass.hard;
    }

    return ColorClass.easy;
  }

  public getGameDifficulty(diff: Difficulty): string {

    if (diff === Difficulty.easy) {
      return DifficultyText.easy;
    } else if (diff === Difficulty.medium) {
      return DifficultyText.medium;
    }

    return DifficultyText.hard;
  }

  public displayRedText(): string {
    if (this._redInput) {
      return RED_INPUT_TEXT;
    }

    return EMPTY;
  }

}
