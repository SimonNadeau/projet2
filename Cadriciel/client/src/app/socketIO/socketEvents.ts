import { SocketIoService, SOCKETS_CALLS } from "./socket-io.service";
import { GameInformation, Player } from "../crossword/interface/gameInformation";
import { Configuration } from "../crossword/interface/configuration";
import { InvalidGameTypeError } from "../../../../common/error/invalidGameTypeError";

const MOCK_ROOM: string = "mockRoom";
const MAXIMUM_NUMBER_PLAYER: number = 2;
const INITIAL_SCORE: number = 0;

export class SocketEvents extends SocketIoService {

    private _socketGameInfo: GameInformation;
    private _isRoomHost: boolean;

    public constructor() {
      super();
      this._socketGameInfo = {
          roomName: MOCK_ROOM,
          difficulty: undefined,
          gameMode: undefined,
          players: []
      };
      this._isRoomHost = false;
    }

    public get socketGameInfo(): GameInformation {
        return this._socketGameInfo;
    }

    public initSocket(): void {

        this.connect();

        this.on(SOCKETS_CALLS.playerJoin, (data: string) => {
          if (this._socketGameInfo.players.length < MAXIMUM_NUMBER_PLAYER) {
            const NEW_PLAYER: Player = {
              name: data,
              score: INITIAL_SCORE,
            };
            this._socketGameInfo.players.push(NEW_PLAYER);
            this.emit(SOCKETS_CALLS.readyToPlay, this._socketGameInfo);
          } else {
            this.emit(SOCKETS_CALLS.playerRejected, data);
          }
        });

        this.on(SOCKETS_CALLS.startGame, (gameData: GameInformation) => {
          this._socketGameInfo.players = gameData.players;
          this._socketGameInfo.difficulty = gameData.difficulty;
        });
    }

    public enterRoom(configuration: Configuration): void {
        this._isRoomHost = true;
        this._socketGameInfo.difficulty =  configuration.difficulty;
        this._socketGameInfo.gameMode  = configuration.gameMode;
        const NEW_PLAYER: Player = {
          name: configuration.playerName,
          score: INITIAL_SCORE,
        };
        this._socketGameInfo.players.push(NEW_PLAYER);

        this.socket.emit(SOCKETS_CALLS.createRoom, this._socketGameInfo);
    }

    public joinRoom(roomId: string, playerName: string): void {
      this.socket.emit(SOCKETS_CALLS.joinRoom, roomId, playerName);
  }

    public checkIfMaxPlayer(): boolean {
        return this._socketGameInfo.players.length >= MAXIMUM_NUMBER_PLAYER;
    }

    public sendWordSelected(word: string): void {
      this.try( () => this.emit(SOCKETS_CALLS.wordSelected, word));
    }

    public sendWordFound(word: string, playerName: string): void {
      this.try( () => this.socket.emit(SOCKETS_CALLS.wordFound, word, playerName));
    }

    public get isRoomHost(): boolean {
      return this._isRoomHost;
    }

    public resetPlayersScore(): void {
      for (const player of this._socketGameInfo.players) {
        player.score = 0;
      }
    }

    private try(ft: Function): void {
      try {
        if (this.socket === undefined) {
          throw new InvalidGameTypeError();
        }
        ft();
      } catch (e) {
        if (e.name !== InvalidGameTypeError.name) {
          console.error(e);
        }
      }
    }

 }
