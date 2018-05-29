import { Component, Output, EventEmitter } from "@angular/core";
import { GameMode } from "../../interface/configuration";

@Component({
  selector: "app-configuration-game-mode",
  templateUrl: "./configuration-game-mode.component.html",
  styleUrls: ["./configuration-game-mode.component.css"]
})
export class ConfigurationGameModeComponent {

  @Output() public notifyGameMode: EventEmitter<GameMode>;

  public constructor() {
    this.notifyGameMode = new EventEmitter<GameMode>();

  }

  public chooseGameMode(modeID: number): void {
    if ( modeID === GameMode.single) {
      this.sendGameMode(GameMode.single);
    } else if ( modeID === GameMode.multi) {
      this.sendGameMode(GameMode.multi);
    }
  }

  private sendGameMode (mode: GameMode): void {
    this.notifyGameMode.emit(mode);
  }

}
