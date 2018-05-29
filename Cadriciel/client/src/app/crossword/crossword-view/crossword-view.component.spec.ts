/* tslint:disable: no-magic-numbers */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CrosswordViewComponent } from "./crossword-view.component";
import { GameConfigurationComponent } from "../game-configuration/game-configuration.component";
import { RelevantInformationViewComponent } from "../relevant-information-view/relevant-information-view.component";
import { CluesViewComponent } from "../clues-view/clues-view.component";
import { GridViewComponent } from "../grid-view/grid-view.component";
import { APP_BASE_HREF } from "@angular/common";
import { CrosswordService } from "../../services/crossword.service";
import { RequestServerService } from "../../services/request-server.service";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { ConfigurationDifficultyComponent } from "../game-configuration/configuration-difficulty/configuration-difficulty.component";
import { ConfigurationGameModeComponent } from "../game-configuration/configuration-game-mode/configuration-game-mode.component";
import { ConfigurationLobbyComponent } from "../game-configuration/configuration-lobby/configuration-lobby.component";
import { ConfigurationWaitingRoomComponent } from "../game-configuration/configuration-waiting-room/configuration-waiting-room.component";
import { SocketIoService, SOCKETS_CALLS } from "../../socketIO/socket-io.service";
import { Configuration } from "../interface/configuration";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { FocusDirective } from "../../focus.directive";
import { CluesService } from "../../services/clues.service";
import { GridService } from "../../services/grid.service";
import { GenerateGridService } from "../../services/generate-grid.service";
import { FocusService } from "../../services/focus.service";
import * as ioClient from "socket.io-client";
import { GameInformation } from "../interface/gameInformation";
import { GridInfo } from "../../../../../common/communication/gridInfo";
import * as MOCK from "../mock/mock";
import { FindWordService } from "../../services/find-word.service";
import { EndMenuViewComponent } from "../end-menu-view/end-menu-view.component";

const CONFIG_BASE: number = 2;
const MOCK_CONFIG: Configuration = {
  difficulty: undefined,
  gameMode: undefined,
  lobbyOption: undefined,
  playerName: undefined
};
const SOCKET_URL: string = "http://localhost:3000";
interface Room {
  id: string;
  game: GameInformation;
}

describe("CrosswordViewComponent", () => {
  let component: CrosswordViewComponent;
  let fixture: ComponentFixture<CrosswordViewComponent>;

  MOCK_CONFIG.difficulty = CONFIG_BASE;
  MOCK_CONFIG.gameMode = CONFIG_BASE;
  MOCK_CONFIG.lobbyOption =  CONFIG_BASE;
  MOCK_CONFIG.playerName = "mock";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CrosswordViewComponent,
        GameConfigurationComponent,
        RelevantInformationViewComponent,
        CluesViewComponent,
        GridViewComponent,
        ConfigurationDifficultyComponent,
        ConfigurationGameModeComponent,
        ConfigurationLobbyComponent,
        ConfigurationWaitingRoomComponent,
        FocusDirective,
        EndMenuViewComponent
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        CrosswordService,
        RequestServerService,
        SocketIoService,
        SelectWordsAndCluesService,
        CluesService, GridService,
        GenerateGridService, FocusService,
        FindWordService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    })
      .compileComponents()
      .then(/* do nothing */)
      .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrosswordViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should start a multiplayer game only when 2 player on in the room", (done: Function) => {
    component.configMenu.sockets.initSocket();
    MOCK_CONFIG.difficulty = 4;
    component.configurationChoose = MOCK_CONFIG;
    expect( component["_socketEvents"].checkIfMaxPlayer()).toEqual(false);
    component["_socketEvents"].on(SOCKETS_CALLS.playerEnterRoom, () => {
      let client: SocketIOClient.Socket;
      client = ioClient(SOCKET_URL);
      client.on(SOCKETS_CALLS.connected, (rooms: Room[]) => {
        for (const room of rooms) {
          if (room.game.roomName === "mock") {
            client.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
            component["_socketEvents"].on(SOCKETS_CALLS.playerJoin, () => {
              expect( component["_socketEvents"].checkIfMaxPlayer()).toEqual(true);
              done();
            });
          }
        }
      });
    });
  });

  it("If in a multiplayer game should load the same grid for the two clients", (done: Function) => {
    const expectedInfo: GridInfo = {grid: [[]], table: [] };
    component.configMenu.sockets.initSocket();
    MOCK_CONFIG.difficulty = 4;
    component["_configurationChoose"] = MOCK_CONFIG;
    component.configurationChoose = MOCK_CONFIG;
    component["_socketEvents"].on(SOCKETS_CALLS.playerEnterRoom, () => {
      let client: SocketIOClient.Socket;
      client = ioClient(SOCKET_URL);
      client.on(SOCKETS_CALLS.connected, (rooms: Room[]) => {
        for (const room of rooms) {
          if (room.game.roomName === "mock") {
            client.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
            component["_socketEvents"].on(SOCKETS_CALLS.initializeGame, (objCrossword: GridInfo) => {
              expect(objCrossword).toEqual(expectedInfo);
            });
            client.on(SOCKETS_CALLS.initializeGame, (objCrossword: GridInfo) => {
              expect(objCrossword).toEqual(expectedInfo);
              done();
            });
            component["_socketEvents"].on(SOCKETS_CALLS.initializeGame, (objCrossword: GridInfo) => {
              expect(objCrossword).toEqual(expectedInfo);
              done();
            });
          }
        }
      });
    });
  });

  it("If in a multiplayer game should see who find the word", (done: Function) => {
    component["generateGridService"].setCrossword(MOCK.MOCK_GRID_INFO);
    component["_socketEvents"].initSocket();
    component["_configurationChoose"] = MOCK_CONFIG;
    component["_socketEvents"].enterRoom(MOCK_CONFIG);
    component["_socketEvents"].on(SOCKETS_CALLS.playerEnterRoom, () => {
      const client: SocketIOClient.Socket = ioClient(SOCKET_URL);
      client.on(SOCKETS_CALLS.connected,  (rooms: Room[]) => {
        for (const room of rooms) {
          if (room.game.roomName === "mock") {
            client.emit(SOCKETS_CALLS.joinRoom, room.id, "player2");
            client.emit(SOCKETS_CALLS.wordFound, "hello", "player2" );
            component["_socketEvents"].on(SOCKETS_CALLS.wordFound, (word: string) => {
              component["findWordService"].setFound(component["findWordService"].findWordByString(word), true);

              expect(component["findWordService"].verifyWordOf(
                component["findWordService"].getSpacesOf((component["findWordService"].findWordByString(word)))[0])
              ).toEqual(true);

              expect(component["findWordService"].getSpacesOf((component["findWordService"]
                .findWordByString(word)))[0].foundByStatus.another).toEqual(true);

              done();
            });
          }
        }
      });
    });
  });

  describe("Fin de partie", () => {
    it("After a game is finish, should be able to restart a game with same configuration", (done: Function) => {
      MOCK_CONFIG.gameMode = 1;
      MOCK_CONFIG.difficulty = 4;
      component["_configurationChoose"] = MOCK_CONFIG;
      component.configurationChoose = MOCK_CONFIG;
      component.updateCrossword(MOCK.MOCK_GRID_INFO);

      const oldConfigurationChoose: Configuration = component["_configurationChoose"];

      component.resetGame();

      expect(component["_configurationChoose"]).toEqual(oldConfigurationChoose);
      expect(component.relevantInfo.playersInfo[0].score).toEqual(0);
      done();
    });

    it("Should know if all the words are found and signal game is finish", () => {
      MOCK_CONFIG.gameMode = 1;
      MOCK_CONFIG.difficulty = 4;
      component["_configurationChoose"] = MOCK_CONFIG;
      component.configurationChoose = MOCK_CONFIG;
      component.updateCrossword(MOCK.MOCK_GRID_INFO);

      component["gridView"]["gridService"].content[0][0].tempChar = "H".toUpperCase();
      component["gridView"]["gridService"].content[0][1].tempChar = "E".toUpperCase();
      component["gridView"]["gridService"].content[0][2].tempChar = "L".toUpperCase();
      component["gridView"]["gridService"].content[0][3].tempChar = "L".toUpperCase();
      component["gridView"]["gridService"].content[0][4].tempChar = "O".toUpperCase();

      component["findWordService"].verifyWordOf(component["gridView"]["gridService"].content[0][4]);
      expect(component["gridView"]["gridService"].content[0][0].isFilled).toEqual(true);

      expect(component["findWordService"].verifyAllWordFound()).toEqual(true);

      component["gridView"].endGameEmitter.emit(true);

      expect(component["_endGame"]).toEqual(true);
    });

  });

});
