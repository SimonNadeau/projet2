import { Component, Output, EventEmitter, ViewChild } from "@angular/core";
import { ConfigurationLobbyComponent } from "./configuration-lobby/configuration-lobby.component";
import { Configuration, GameMode, Difficulty, LobbyOptions } from "../interface/configuration";
import { SocketEvents } from "../../socketIO/socketEvents";
import { SOCKETS_CALLS } from "../../socketIO/socket-io.service";
import { GameInformation } from "../interface/gameInformation";

const READY_TO_PLAY: boolean = true;

interface Room {
  id: string;
  game: GameInformation;
}
interface LoginInfo {
  id: string;
  name: string;
}

const enum MenuStates {
  main,
  mode,
  difficulty,
  lobby,
  waiting
}

@Component({
  selector: "app-game-configuration",
  templateUrl: "./game-configuration.component.html",
  styleUrls: ["./game-configuration.component.css"]
})

export class GameConfigurationComponent {

  @ViewChild(ConfigurationLobbyComponent) public lobby: ConfigurationLobbyComponent;

  @Output() public notifyConfiguration: EventEmitter<Configuration>;
  @Output() public notifyIsReadyToPlay: EventEmitter<boolean>;

  private _configuration: Configuration;
  private _menuState: MenuStates;
  private _socketEvents: SocketEvents;

  public constructor() {
    this._menuState = MenuStates.mode;
    this._configuration = {
      difficulty: undefined,
      gameMode: undefined,
      lobbyOption: undefined,
      playerName: undefined
    };
    this.notifyConfiguration = new EventEmitter<Configuration>();
    this.notifyIsReadyToPlay = new EventEmitter<boolean>();
    this._socketEvents = new SocketEvents();

  }

  public get sockets(): SocketEvents {
    return this._socketEvents;
  }

  private set menuState(state: MenuStates) {
    this._menuState = state;
  }

  public compareMenuState(state: MenuStates): boolean {
    return this._menuState === state;
  }

  public set playerName(name: string) {
    this._configuration.playerName = name;
  }

  public set gameMode(mode: GameMode) {
    this._configuration.gameMode = mode;

    if (this._configuration.gameMode === GameMode.single) {
      this.menuState = MenuStates.difficulty;
    } else {
      this.menuState = MenuStates.lobby;
      this._socketEvents.initSocket();

      this._socketEvents.on(SOCKETS_CALLS.connected, (data: [Room]) => {
        this.lobby.rooms = data;
      });

    }
  }

  public set lobbyOption(option: LobbyOptions) {
    this._configuration.lobbyOption = option;

    ( this._configuration.lobbyOption === LobbyOptions.create) ?
      this.menuState = MenuStates.difficulty : this.menuState = MenuStates.main;
  }

  public joinSocketRoom(data: LoginInfo): void {
    this._socketEvents.joinRoom(data.id, data.name);
    this.menuState = MenuStates.main;
    this.lobbyOption = LobbyOptions.join;
    this.sendConfiguration();
  }

  public set difficulty(desiredDifficulty: Difficulty) {
    this._configuration.difficulty = desiredDifficulty;
    this.sendConfiguration();
    if (this._configuration.gameMode === GameMode.single) {
      this.sendIsReadyToPlay();
    } else if (this._configuration.gameMode === GameMode.multi) {
      this.menuState = MenuStates.waiting;
    }
  }

  private sendConfiguration(): void {
    this.notifyConfiguration.emit(this._configuration);
  }

  private sendIsReadyToPlay(): void {
    this.notifyIsReadyToPlay.emit(READY_TO_PLAY);
  }

}
