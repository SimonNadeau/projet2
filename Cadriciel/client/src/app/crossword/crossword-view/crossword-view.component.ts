import { Component, ViewChild } from "@angular/core";
import { SOCKETS_CALLS } from "../../socketIO/socket-io.service";
import { GridViewComponent } from "../grid-view/grid-view.component";
import { CluesViewComponent } from "../clues-view/clues-view.component";
import { GridInfo } from "../../../../../common/communication/gridInfo";
import { Configuration, GameMode, LobbyOptions } from "../interface/configuration";
import { RelevantInformationViewComponent } from "../relevant-information-view/relevant-information-view.component";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { GameConfigurationComponent } from "../game-configuration/game-configuration.component";
import { GenerateGridService } from "../../services/generate-grid.service";
import { GameInformation, Player } from "../interface/gameInformation";
import { SocketEvents } from "../../socketIO/socketEvents";
import { FindWordService } from "../../services/find-word.service";

const NEW_PLAYER: Player = {
  name: "Player",
  score: 0,
};
const FIND_BY_OTHER: boolean = true;

const END_GAME: boolean = true;
const TITLE_TEXT: string = "Crossword";
const PLAYER_DISCONNECT_ALERT: string = "Player disconnect";
@Component({
  selector: "app-crossword-view",
  templateUrl: "./crossword-view.component.html",
  styleUrls: ["./crossword-view.component.css"]
})
export class CrosswordViewComponent {

  @ViewChild(GridViewComponent) public gridView: GridViewComponent;
  @ViewChild(CluesViewComponent) public clueView: CluesViewComponent;
  @ViewChild(RelevantInformationViewComponent) public relevantInfo: RelevantInformationViewComponent;
  @ViewChild(GameConfigurationComponent) public configMenu: GameConfigurationComponent;

  public title: string;
  private _configurationChoose: Configuration;
  private _gameIsConfig: boolean;
  private _endGame: boolean;
  private _socketEvents: SocketEvents;
  public gridGenerated: boolean;
  public isWinner: boolean;

  public constructor( private findWordService: FindWordService,
                      private selectionService: SelectWordsAndCluesService,
                      private generateGridService: GenerateGridService) {
    this.title = TITLE_TEXT;
    this._gameIsConfig = false;
    this._endGame = false;
    this.isWinner = true;
    this.gridGenerated = false;
    this._socketEvents = new SocketEvents ();
  }

  private listenForSocketsEvents(): void {

    this._socketEvents.on(SOCKETS_CALLS.startGame, () => {
      this.startGame(this._socketEvents.checkIfMaxPlayer());
    });

    this._socketEvents.on(SOCKETS_CALLS.initializeGame, (objCrossword: GridInfo) => {
      this.generateGridService.gridGenerated = true;
      this.updateCrossword(objCrossword);
    });
    this._socketEvents.on(SOCKETS_CALLS.wordSelected, (word: string) => {
      this.selectionService.findAndSelectWord(word);
    });
    this._socketEvents.on(SOCKETS_CALLS.wordFound, (word: string) => {
      this.findWordService.setFound(this.findWordService.findWordByString(word), FIND_BY_OTHER);
    });
    this._socketEvents.on(SOCKETS_CALLS.updateScore, (name: string) => {
      this.relevantInfo.updateAPlayerScore(name);
    });
    this._socketEvents.on(SOCKETS_CALLS.playerJoin, () => {
      this._socketEvents.emit(SOCKETS_CALLS.initializeGame, this._configurationChoose.difficulty);
    });
    this.onEndGame();

    this._socketEvents.on(SOCKETS_CALLS.playerDisconnect, () => {
      alert(PLAYER_DISCONNECT_ALERT);
      this._socketEvents.disconnect();
      window.location.reload();
    });
  }

  private onEndGame(): void {
    this._socketEvents.on(SOCKETS_CALLS.endGame, (winner: Player) => {
      this._endGame = END_GAME;
      if (this._configurationChoose.playerName !== winner.name) {
        this.isWinner = false;
      }
    });
  }

  private connectToSocket(): void {
    this._socketEvents = this.configMenu.sockets;
    this.listenForSocketsEvents();
  }

  public startGame(status: boolean): void {
    this._gameIsConfig = status;
    this.updateRelevantInfoView();
  }

  private updateRelevantInfoView(): void {
    this.relevantInfo.updateGameInformation(this.gameInfo);
  }

  public updateCrossword(updatedCrossword: GridInfo): void {
    this.generateGridService.setCrossword(updatedCrossword);
    this.updateRelevantInfoView();
  }

  private get gameInfo(): GameInformation {
    if (this._configurationChoose.gameMode === GameMode.single) {

      return {
        roomName: undefined,
        difficulty: this._configurationChoose.difficulty,
        gameMode: this._configurationChoose.gameMode,
        players: [NEW_PLAYER]
      };
    }

    return this._socketEvents.socketGameInfo;
  }

  private get isInMutliplayerGame(): boolean {
    return this._configurationChoose.gameMode === GameMode.multi;
  }

  public set endGame(value: boolean) {
    if (this.isInMutliplayerGame) {
      const delay: number = 100;
      setTimeout( () => {
        this._socketEvents.emit(SOCKETS_CALLS.endGame, this.gameInfo.players); },
                  delay);
    } else {
      this._endGame = value;
    }
  }

  private resetPlayersScore(): void {
    if (this.isInMutliplayerGame) {
      this._socketEvents.resetPlayersScore();
    } else {
      this.gameInfo.players[0].score = 0;
    }
  }

  /* Functions only use in html and test */
  public set configurationChoose(config: Configuration) {
    this._configurationChoose = config;
    if ( this.isInMutliplayerGame) {
      this.connectToSocket();
      if (this._configurationChoose.lobbyOption !== LobbyOptions.join) {
        this._socketEvents.enterRoom(config);
      }
    } else {
      this.generateGridService.generateGrid(this._configurationChoose.difficulty);
    }
  }

  public updateScore(words: string[]): void {
    for (const word of words) {
      if (this.isInMutliplayerGame) {
          this._socketEvents.sendWordFound(word, this._configurationChoose.playerName);
      } else {
          this.relevantInfo.updateAPlayerScore(this.gameInfo.players[0].name);
      }
    }
  }

  public resetGame(): void {
    this.generateGridService.gridGenerated = false;
    this._endGame = !END_GAME;
    this.resetPlayersScore();
    this.isWinner = true;
    if (this.isInMutliplayerGame && this._socketEvents.isRoomHost) {
      this._socketEvents.emit(SOCKETS_CALLS.initializeGame, this._configurationChoose.difficulty);
    } else  if (!this.isInMutliplayerGame) {
      this.configurationChoose = this._configurationChoose;
    }
  }

  public get gameIsConfig(): boolean {
    return this._gameIsConfig;
  }

  public get socketEvents(): SocketEvents {
    if (this.isInMutliplayerGame && this._endGame) {
      return this._socketEvents;
    }

    return undefined;
  }

}
