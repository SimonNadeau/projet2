import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndMenuViewComponent } from "./end-menu-view.component";
import { Configuration } from "../interface/configuration";
import { SOCKETS_CALLS } from "../../socketIO/socket-io.service";
import * as ioClient from "socket.io-client";
import { GameInformation } from "../interface/gameInformation";
import { SocketEvents } from "../../socketIO/socketEvents";

interface Room {
  id: string;
  game: GameInformation;
}

const MOCK_CONFIG: Configuration = {
  difficulty: 1,
  gameMode: 2,
  lobbyOption: 2,
  playerName: "mockName"
};
const SOCKET_URL: string = "http://localhost:3000";

describe("EndMenuViewComponent", () => {
  let component: EndMenuViewComponent;
  let fixture: ComponentFixture<EndMenuViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndMenuViewComponent ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndMenuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have different message for the winner and the loser", () => {
    const WIN_MESSAGE: string = "You won!";
    const LOST_MESSAGE: string = "You lost...";

    component.gameMode = 2;
    component.wonGame = true;
    component.ngOnInit();
    expect(component["_message"]).toEqual(WIN_MESSAGE);

    component.wonGame = false;
    component.ngOnInit();
    expect(component["_message"]).toEqual(LOST_MESSAGE);

  });

  // tslint:disable-next-line:max-func-body-length
  it("In a multiplayer, players should wait for both confirmation to play again", (done: Function) => {
    spyOn(component.playAgainEmitter, "emit");
    MOCK_CONFIG.difficulty = 0;
    component.ngOnInit();
    component["_socketEvents"]  = new SocketEvents();
    component["_socketEvents"].initSocket();
    component["_socketEvents"].enterRoom(MOCK_CONFIG);
    component["_socketEvents"].on(SOCKETS_CALLS.playerEnterRoom, () => {
      let client: SocketIOClient.Socket;
      client = ioClient(SOCKET_URL);
      client.on(SOCKETS_CALLS.connected, (rooms: Room[]) => {
        for (const room of rooms) {
          if (room.game.roomName === "mockName") {
            client.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
            component["_socketEvents"].on(SOCKETS_CALLS.playerJoin, () => {
              component.playAgainClick();
              expect(component["_isWaiting"]).toEqual(true);
              client.emit(SOCKETS_CALLS.playAgain);
              component.ngOnInit();
              component["_socketEvents"].on(SOCKETS_CALLS.playAgain, () => {
                expect(component["_isWaiting"]).toEqual(false);
                expect(component.playAgainEmitter.emit).toHaveBeenCalledWith(true);
                client.disconnect();
                component["_socketEvents"].disconnect();
                done();
              });
            });
          }
        }
      });
    });

  });
});
