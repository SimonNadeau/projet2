import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationGameModeComponent } from "./configuration-game-mode.component";
import { GameMode } from "../../interface/configuration";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("ConfigurationGameModeComponent", () => {
  let component: ConfigurationGameModeComponent;
  let fixture: ComponentFixture<ConfigurationGameModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationGameModeComponent ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationGameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit a game mode if a button is click", () => {
    spyOn(component.notifyGameMode, "emit");

    const button: DebugElement = fixture.debugElement.query(By.css("#singleButton"));
    button.triggerEventHandler("click", {});

    fixture.detectChanges();

    expect(component.notifyGameMode.emit).toHaveBeenCalledWith(GameMode.single);

  });
});
