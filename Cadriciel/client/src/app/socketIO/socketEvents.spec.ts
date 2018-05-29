import { TestBed, inject } from "@angular/core/testing";
import { SocketIoService } from "./socket-io.service";
import { SOCKETS_CALLS } from "../../../../common/communication/socketCalls";
import { Player, GameInformation } from "../crossword/interface/gameInformation";
import {SocketEvents} from "./socketEvents";
import { Configuration } from "../crossword/interface/configuration";

const MOCK_NOM: string = "mockPlayer";
const NEW_PLAYER: Player = {
  name: MOCK_NOM,
  score: 0,
};
const MOCK_CONFIG: Configuration = {
    difficulty: 0,
    gameMode: 0,
    lobbyOption: 1,
    playerName: "undefined"
};

describe("SocketEvents", () => {
  const socket: SocketEvents = new SocketEvents();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketIoService]
    });
    socket.initSocket();
  });

  it("should be created", inject([SocketIoService], (service: SocketIoService) => {
    expect(service).toBeTruthy();
  }));

  describe("Start Game", () => {
    it("should emit when ready to start game", (done: Function) => {
      socket.enterRoom(MOCK_CONFIG);
      socket.enterRoom(MOCK_CONFIG);
      socket.on<string>(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
        socket.socketGameInfo.players.push(NEW_PLAYER);
        if (socket.checkIfMaxPlayer()) {
          socket.emit<GameInformation>(SOCKETS_CALLS.readyToPlay, socket["_socketGameInfo"]);
        }
      });
      socket.on<void>(SOCKETS_CALLS.startGame, () => {
        done();
      });
    });
  });

});
