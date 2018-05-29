import { TestBed, inject } from "@angular/core/testing";
import { SocketIoService } from "./socket-io.service";
import { SOCKETS_CALLS } from "../../../../common/communication/socketCalls";
import { GameInformation } from "../crossword/interface/gameInformation";
import * as ioClient from "socket.io-client";

const SOCKET_URL: string = "http://localhost:3000";
const MOCK_WORD: string = "mockRoom";
const options: SocketIOClient.ConnectOpts = {
    transports: ["websocket"]
  };

interface Room {
    id: string;
    game: GameInformation;
}

describe("SocketIoService", () => {
  let client: SocketIOClient.Socket;
  let client1: SocketIOClient.Socket;
  let client2: SocketIOClient.Socket;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketIoService]
    });
    client = ioClient(SOCKET_URL);
  });

  it("should be created", inject([SocketIoService], (service: SocketIoService) => {
    expect(service).toBeTruthy();
  }));

  describe("connect", () => {
    it("should connect socket", async (done: Function) => {
      client.on(SOCKETS_CALLS.connected, () => {
        client.disconnect();
        done();
      });
    });
  });

  describe("Joining Room", () => {
    it("should connect socket and join a Room", async (done: Function) => {
      const socketGameInfo: GameInformation = {
        roomName: "mockRoom",
        difficulty: 1,
        gameMode: 1,
        players: [{name: "mockName",
                   score: 0}]
      };
      client.on(SOCKETS_CALLS.connected, () => {
        client.emit(SOCKETS_CALLS.createRoom, socketGameInfo);
      });
      client.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
        client.disconnect();
        done();
      });
    });
  });
  describe("Word selected and found", () => {
    // tslint:disable-next-line:max-func-body-length
    it("should share the word that was seleted by another client", async(done: Function) => {
      client1 = ioClient.connect(SOCKET_URL, options);
      const socketGameInfo: GameInformation = {
        roomName: "mock",
        difficulty: 1,
        gameMode: 1,
        players: [{name: "mock",
                   score: 0}]
      };
      client1.on(SOCKETS_CALLS.connected, () => {
        client1.emit(SOCKETS_CALLS.createRoom, socketGameInfo);
      });

      client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
          client2 = ioClient.connect(SOCKET_URL, options);
          client1.emit(SOCKETS_CALLS.wordSelected, (MOCK_WORD));
          client2.on(SOCKETS_CALLS.connected, (rooms: Room[]) => {
            for (const room of rooms) {
              if (room.game.roomName === "mock") {
                client2.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
              }
            }
          });
          client2.on(SOCKETS_CALLS.wordSelected, (word: string) => {
              client1.disconnect();
              client2.disconnect();
              done();
          });
      });
    });

    // tslint:disable-next-line:max-func-body-length
    it("should share the word that was found by another client", async (done: Function) => {
      client1 = ioClient.connect(SOCKET_URL, options);
      const socketGameInfo: GameInformation = {
        roomName: "mock",
        difficulty: 1,
        gameMode: 1,
        players: [{
          name: "mock",
          score: 0
        }]
      };
      client1.on(SOCKETS_CALLS.connected, () => {
        client1.emit(SOCKETS_CALLS.createRoom, socketGameInfo);
      });

      client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
        client2 = ioClient.connect(SOCKET_URL, options);
        client1.emit(SOCKETS_CALLS.wordFound, (MOCK_WORD));
        client2.on(SOCKETS_CALLS.connected, (rooms: Room[]) => {
          for (const room of rooms) {
            if (room.game.roomName === "mock") {
              client2.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
            }
          }
        });
        client2.on(SOCKETS_CALLS.wordFound, (word: string) => {
          client1.disconnect();
          client2.disconnect();
          if (word === MOCK_WORD) {
            done();
          }
        });
      });
    });
    });
});
