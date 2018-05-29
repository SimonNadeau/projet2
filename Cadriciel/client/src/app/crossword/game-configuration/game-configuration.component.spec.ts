/* tslint:disable: no-magic-numbers */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GameConfigurationComponent } from "./game-configuration.component";
import { ConfigurationDifficultyComponent } from "../game-configuration/configuration-difficulty/configuration-difficulty.component";
import { ConfigurationGameModeComponent } from "../game-configuration/configuration-game-mode/configuration-game-mode.component";
import { ConfigurationLobbyComponent } from "../game-configuration/configuration-lobby/configuration-lobby.component";
import { ConfigurationWaitingRoomComponent } from "../game-configuration/configuration-waiting-room/configuration-waiting-room.component";
import { SocketIoService } from "../../socketIO/socket-io.service";
import { GameMode, Difficulty, LobbyOptions } from "../interface/configuration";

describe("ConfigurationPartieComponent", () => {
  let component: GameConfigurationComponent;
  let fixture: ComponentFixture<GameConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameConfigurationComponent,
        ConfigurationDifficultyComponent,
        ConfigurationGameModeComponent,
        ConfigurationLobbyComponent,
        ConfigurationWaitingRoomComponent
      ],
      imports: [

      ],
      providers: [
        SocketIoService,
      ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));

    component = new GameConfigurationComponent();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should correctly setting the game mode and change to the correct view depending on the choice ", async() => {
    component["_menuState"] = 1;
    component.gameMode = GameMode.single;
    expect(component["_menuState"]).toEqual(2);
  });

  it("should correctly setting the lobby options and change to the correct view depending on the choice ", () => {
    component["_menuState"] = 3;
    component.playerName = "mockName";
    component.lobbyOption = LobbyOptions.create;
    expect(component["_menuState"]).toEqual(2);
    component.playerName = "mockName";
    component.lobbyOption = LobbyOptions.join;
    expect(component["_menuState"]).toEqual(0);

  });

  it("should emit the configuration", () => {
      spyOn(component.notifyConfiguration, "emit");
      component.gameMode = GameMode.single;
      component.difficulty = Difficulty.easy;
      expect(component.notifyConfiguration.emit).toHaveBeenCalledWith(component["_configuration"]);
  });
  it("should emit if ready to play", () => {
    spyOn(component.notifyIsReadyToPlay, "emit");
    component.gameMode = GameMode.single;
    component.difficulty = Difficulty.easy;
    expect(component.notifyIsReadyToPlay.emit).toHaveBeenCalledWith(true);

  });
});
