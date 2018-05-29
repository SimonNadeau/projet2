import { injectable} from "inversify";
import * as socket from "socket.io";
import * as http from "http";
import { SOCKETS_CALLS } from "../../../common/communication/socketCalls";
import { GridInfo } from "../../../common/communication/gridInfo";
import { IDGenerator } from "./idGenerator";
import { WinnerFinder } from "./winnerFinder";
import { EmptyRoomsError } from "../../../common/error/emptyRoomsError";
import * as rq from "request-promise-native";

interface Player {
    name: string;
    score: number;
}

interface GameInformation {
    roomName: string;
    difficulty: number;
    gameMode: number;
    players: [Player] ;
}

interface Room {
    id: string;
    game: GameInformation;
}

const HOST_PLAYER_ID: number = 0;
const URL_GRID: string = "http://localhost:3000/generateGrid/";
@injectable()
export class ScoketIOService {

    private _io: SocketIO.Server;
    private _rooms: Room[];
    private _idGenerator: IDGenerator;
    private _winnerFinder: WinnerFinder;

    public constructor() {
        this._rooms = [];
        this. _idGenerator = new IDGenerator();
        this._winnerFinder = new WinnerFinder();
    }

    public initSockets(server: http.Server): void {
        this._rooms = [];
        this._io = socket(server);
    }

    public async listenSockets(): Promise<void> {
        this._io.on(SOCKETS_CALLS.connection, (newSocket: SocketIO.Socket) => {
            newSocket.emit(SOCKETS_CALLS.connected, this._rooms);
            this.listenForRoom(newSocket);
        });
    }

    private listenForRoom(newSocket: SocketIO.Socket): void {
        newSocket.on(SOCKETS_CALLS.createRoom, (gameInformation: GameInformation) => {
            const ROOM_ID: string = this._idGenerator.makeID();
            this.insertRoom(ROOM_ID, gameInformation);
            this.enterRoom(newSocket, ROOM_ID);
            this._io.sockets.in(ROOM_ID).emit(SOCKETS_CALLS.playerEnterRoom, "A Player has enter the room");

        });
        newSocket.on(SOCKETS_CALLS.joinRoom, (roomID: string, name: string) => {
            this.enterRoom(newSocket, roomID);
            this.emitPlayerJoinRoom(roomID, name);
            this.removeRoom(roomID, this._rooms[0]);
        });
    }

    private enterRoom(newSocket: SocketIO.Socket, ROOM_ID: string): void {
        newSocket.join(ROOM_ID);
        this.roomEvents(newSocket, ROOM_ID);
    }

    private emitPlayerJoinRoom(ROOM_ID: string, playerName: string): void {
        this._io.sockets.in(ROOM_ID).emit(SOCKETS_CALLS.playerEnterRoom, "A Player has enter the room");
        this._io.sockets.in(ROOM_ID).clients((err: Error, clients: SocketIO.Client) => {
            this._io.to(clients[HOST_PLAYER_ID]).emit(SOCKETS_CALLS.playerJoin, playerName);
        });
    }

    private insertRoom(ROOM_ID: string, gameInformation: GameInformation): void {
        gameInformation.roomName = gameInformation.players[HOST_PLAYER_ID].name;
        this._rooms.push({
            id: ROOM_ID,
            game: gameInformation
        });
    }
    private removeRoom(id: string, room: Room): void {
        try {
            if (this._rooms === undefined) {
                throw new EmptyRoomsError();
            }
            if (room.id === id) {
                this._rooms = this._rooms.filter((obj: Room) => obj !== room);
            } else {
                this.removeRoom(id, this._rooms[this._rooms.indexOf(room) + 1]);
            }
        } catch (error) {
            if (error.name === EmptyRoomsError.name) {
                console.error(error);
            }
        }
    }
    private roomEvents(newSocket: SocketIO.Socket, roomID: string): void  {
        this.listenForReadyToPlay(newSocket, roomID);
        this.listenForPlayerRejected(newSocket, roomID);
        this.listenForInitializeGame(newSocket, roomID);
        this.listenForWordSelected(newSocket, roomID);
        this.listentForWordFound(newSocket, roomID);
        this.listenForDisconnect(newSocket, roomID);
        this.listenForEndGame(newSocket, roomID);
        this.listentForPlayAgain(newSocket, roomID);

    }

    private listentForPlayAgain(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.playAgain, () => {
            newSocket.broadcast.to(room).emit(SOCKETS_CALLS.playAgain);
        });
    }

    private listenForEndGame(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.endGame, (players: Array<Player>) => {
            this._io.sockets.in(room).emit(SOCKETS_CALLS.endGame,  this._winnerFinder.findWinner(players));
        });
    }

    private listenForDisconnect(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.disconnect, () => {
            newSocket.broadcast.to(room).emit(SOCKETS_CALLS.playerDisconnect);
        });
    }

    private listentForWordFound(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.wordFound, (word: string, playerName: string ) => {
            newSocket.broadcast.to(room).emit(SOCKETS_CALLS.wordFound, word);
            this._io.sockets.in(room).emit(SOCKETS_CALLS.updateScore, playerName);
        });
    }

    private listenForWordSelected(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.wordSelected, (word: string) => {
           newSocket.broadcast.to(room).emit(SOCKETS_CALLS.wordSelected, word);
        });
    }

    private listenForInitializeGame(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.initializeGame, (data: number) => {

            const expectResponse: GridInfo = undefined;
            const options: rq.RequestPromiseOptions = {
                method: "POST",
                body: expectResponse,
                json: true
            };

            rq(URL_GRID + data.toString(), options)
            .then( (info: GridInfo) => {
                this._io.sockets.in(room).emit(SOCKETS_CALLS.initializeGame, info);
            })
            .catch((err: Error) => console.error(err));
        });
    }

    private listenForPlayerRejected(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.playerRejected, (data: string) => {
            newSocket.leave(room);
        });
    }

    private listenForReadyToPlay(newSocket: SocketIO.Socket, room: string): void {
        newSocket.on(SOCKETS_CALLS.readyToPlay, (data: GameInformation ) => {
            this._io.sockets.in(room).emit(SOCKETS_CALLS.startGame, data);
        });
    }
}
