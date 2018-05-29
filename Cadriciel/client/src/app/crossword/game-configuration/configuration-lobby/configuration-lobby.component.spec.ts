import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationLobbyComponent } from "./configuration-lobby.component";
import { LobbyOptions } from "../../interface/configuration";
import { GameInformation } from "../../interface/gameInformation";
import { SOCKETS_CALLS } from "../../../socketIO/socket-io.service";
import * as ioClient from "socket.io-client";

const SOCKET_URL: string = "http://localhost:3000";
const options: SocketIOClient.ConnectOpts = {
    transports: ["websocket"]
  };
interface Room {
    id: string;
    game: GameInformation;
  }

describe("ConfigurationLobbyComponent", () => {
  let component: ConfigurationLobbyComponent;
  let fixture: ComponentFixture<ConfigurationLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationLobbyComponent ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));

    component = new ConfigurationLobbyComponent();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit a join room if a join button is click and a name is enter", () => {
    let client: SocketIOClient.Socket;
    client = ioClient.connect(SOCKET_URL, options);

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
    client.on(SOCKETS_CALLS.playerEnterRoom, () => {
      component.playerName = "playerName";
      const mockRoom: Room = {
        id:  "jje32",
        game: socketGameInfo
      };
      component.joinGame(mockRoom);
      expect(component["_redInput"]).toEqual(false);
      client.disconnect();
    });

  });

  it("should emit a lobby option if a create button is click and a name is enter", () => {
    component.emitOption(LobbyOptions.create);
    expect(component["_redInput"]).toEqual(true);
    component = new ConfigurationLobbyComponent();
    component.playerName = "playerName";
    expect(component["_redInput"]).toEqual(false);

  });
});
