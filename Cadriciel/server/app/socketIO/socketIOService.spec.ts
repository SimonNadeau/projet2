// import { expect } from "chai";
import chai = require("chai");
import ChaiHttp = require("chai-http");
import { SOCKETS_CALLS } from "../../../common/communication/socketCalls";
import * as ioClient from "socket.io-client";

chai.use(ChaiHttp);
const URL: string = "http://localhost:3000";
const MOCK_WORD: string = "mockRoom";
const options: SocketIOClient.ConnectOpts = {
    transports: ["websocket"]
};

interface GameInformation {
    roomName: string;
    difficulty: number;
    gameMode: number;
    players: [{ name: string; score: number; }];
}
interface Room {
    id: string;
    game: GameInformation;
}

describe("Socket.io Service", () => {

    let client1: SocketIOClient.Socket;
    let client2: SocketIOClient.Socket;

    const MOCK_INFO: GameInformation = {
        roomName: "mock",
        difficulty: 1,
        gameMode: 1,
        players: [{ name: "mock", score: 0 }]
    };

    let rooms: Room[];

    beforeEach(async (done: () => void) => {
        client1 = ioClient.connect(URL, options);
        client1.on(SOCKETS_CALLS.connected, () => {
            client1.emit(SOCKETS_CALLS.createRoom, MOCK_INFO);
        });
        done();
    });
    it("Should connect a client correctly and receive message", (done: Function) => {
        client1.on(SOCKETS_CALLS.connected, (msg: string) => {
            client1.disconnect();
            done();
        });
    });

    it("should connect socket and join a Room", (done: Function) => {

        client1.on(SOCKETS_CALLS.connected, () => {
            client1.emit(SOCKETS_CALLS.createRoom, MOCK_INFO);
        });
        client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
            client1.disconnect();
            done();
        });
    });

    it("should share the word that was seleted by another client", (done: Function) => {

        client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
            client1.emit(SOCKETS_CALLS.wordSelected, (MOCK_WORD));
            client2 = ioClient.connect(URL, options);
            client2.on(SOCKETS_CALLS.connected, (roomList: Room[]) => {
                rooms = roomList;
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

    it("should share the word that was found by another client", (done: Function) => {

        client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
            client1.emit(SOCKETS_CALLS.wordFound, (MOCK_WORD));
            client2 = ioClient.connect(URL, options);
            client2.on(SOCKETS_CALLS.connected, (roomList: Room[]) => {
                rooms = roomList;
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

    it("should notify the second client if the disconnect", (done: Function) => {

        client1.on(SOCKETS_CALLS.playerEnterRoom, (data: string) => {
            client1.emit(SOCKETS_CALLS.wordFound, (MOCK_WORD));
            client2 = ioClient.connect(URL, options);
            client2.on(SOCKETS_CALLS.connected, (roomList: Room[]) => {
                rooms = roomList;
                for (const room of rooms) {
                    if (room.game.roomName === "mock") {
                        client2.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
                    }
                }
            });
            client2.on(SOCKETS_CALLS.playerDisconnect, () => {
                client2.disconnect();
                done();
            });

        });
        client1.on(SOCKETS_CALLS.playerJoin, () => {
            client1.disconnect();
        });
    });

});
