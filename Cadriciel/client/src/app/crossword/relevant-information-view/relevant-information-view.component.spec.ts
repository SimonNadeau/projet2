/* tslint:disable: no-magic-numbers */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RelevantInformationViewComponent } from "./relevant-information-view.component";
import { GameMode, Difficulty } from "../interface/configuration";
import { Player } from "../interface/gameInformation";

const NEW_PLAYER: Player = {
  name: "Player",
  score: 0,
};
const SINGLEPLAYER_TEXT: string = "Single Player";
const MULTIPLAYER_TEXT: string = "Multiplayer";
const EASY_TEXT: string = "Easy";

describe("RelevantInformationViewComponent", () => {
  let component: RelevantInformationViewComponent;
  let fixture: ComponentFixture<RelevantInformationViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RelevantInformationViewComponent]
    })
      .compileComponents()
      .then(/* do nothing */)
      .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevantInformationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load the correct information for sinlge player game", () => {
    component["_gameInformation"].difficulty = Difficulty.easy;
    component["_gameInformation"].gameMode = GameMode.single;
    expect(component.gameDifficulty).toEqual(EASY_TEXT);
    expect(component.gameMode).toEqual(SINGLEPLAYER_TEXT);
  });

  it("should load the correct information for multiplayer game", () => {
    component["_gameInformation"].difficulty = Difficulty.easy;
    component["_gameInformation"].gameMode = GameMode.multi;
    component["_gameInformation"].players = [NEW_PLAYER, NEW_PLAYER];
    expect(component.gameDifficulty).toEqual(EASY_TEXT);
    expect(component.gameMode).toEqual(MULTIPLAYER_TEXT);
    expect(component.playersInfo.length).toBeGreaterThanOrEqual(1);
  });

});
