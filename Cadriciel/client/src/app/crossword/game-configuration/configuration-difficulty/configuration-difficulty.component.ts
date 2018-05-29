import { Component, Output, EventEmitter } from "@angular/core";
import { Difficulty } from "../../interface/configuration";

@Component({
  selector: "app-configuration-difficulty",
  templateUrl: "./configuration-difficulty.component.html",
  styleUrls: ["./configuration-difficulty.component.css"]
})
export class ConfigurationDifficultyComponent {

  @Output() public notifyDiffuclty: EventEmitter<Difficulty>;

  public constructor() {
    this.notifyDiffuclty = new EventEmitter<Difficulty>();
  }

  public onClick(difficulty: Difficulty): void {
    this.notifyDiffuclty.emit(difficulty);
  }

}
