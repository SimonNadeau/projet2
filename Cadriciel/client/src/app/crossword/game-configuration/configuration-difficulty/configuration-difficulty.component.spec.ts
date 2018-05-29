import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationDifficultyComponent } from "./configuration-difficulty.component";
import { Difficulty } from "../../interface/configuration";

import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("ConfigurationDifficultyComponent", () => {
  let component: ConfigurationDifficultyComponent;
  let fixture: ComponentFixture<ConfigurationDifficultyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationDifficultyComponent ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationDifficultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit a difficulty if a button is click", () => {
    spyOn(component.notifyDiffuclty, "emit");

    const button: DebugElement = fixture.debugElement.query(By.css("#easyButton"));
    button.triggerEventHandler("click", {});

    fixture.detectChanges();

    expect(component.notifyDiffuclty.emit).toHaveBeenCalledWith(Difficulty.easy);

  });
});
