import { Component, HostListener, Output, EventEmitter } from "@angular/core";
import { Clue } from "../interface/clue";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { GridService } from "../../services/grid.service";
import { CluesService } from "../../services/clues.service";
import { FocusService } from "../../services/focus.service";

const IS_UNSELECTED_OF_OTHER: boolean = true;
const enum ClassName {
  normal = "clue",
  seleted = "selected-clue",
  found = "found",
  foundByOther = "foundOther"
}
const IN_CHEAT_MODE: boolean = true;

@Component({
  selector: "app-clues",
  templateUrl: "./clues-view.component.html",
  styleUrls: ["./clues-view.component.css"]
})
export class CluesViewComponent {

  @Output() public selectEmitter: EventEmitter<string>;
  private _inCheatMode: boolean;

  public constructor( protected gridService: GridService,
                      protected cluesService: CluesService,
                      private selectionService: SelectWordsAndCluesService,
                      private focusService: FocusService ) {
                        this.selectEmitter  = new EventEmitter<string>();
                        this._inCheatMode = false;
                      }

  public isVertical(clue: Clue): boolean {
    return clue.word.vertical;
  }

  public select(clue: Clue): void {
    if (!clue.isSelected) {
      this.selectionService.unselectAllClues();
      this.selectionService.unselectAllSpaces(!IS_UNSELECTED_OF_OTHER);
      this.cluesService.toggleSelectedStatus(clue);
      this.selectionService.clearAndSelectSpacesOf(clue.word);
      this.selectEmitter.emit(clue.word.content);
    } else {
      this.selectionService.unselectAllSpaces(!IS_UNSELECTED_OF_OTHER);
      this.cluesService.toggleSelectedStatus(clue);
    }
    this.focusService.setNextFocus(clue.word);
  }

  public clickInside($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener("document:click", ["$event"])
  public clickedOutSide($event: Event): void {
    this.selectionService.unselectAllSpaces(!IS_UNSELECTED_OF_OTHER);
  }

  public changeToCheatMode(): void {
    if (!this._inCheatMode) {
      this.cluesService.cheatMode();
      this._inCheatMode = IN_CHEAT_MODE;
    } else {
      this.cluesService.normalMode();
      this._inCheatMode = !IN_CHEAT_MODE;
    }
  }

  public giveClueClass(clue: Clue): string {
    if (clue.isSelected) {
      return ClassName.seleted;
    } else if (clue.isFound.byYourself) {
      return ClassName.found;
    } else if (clue.isFound.byAnother) {
      return ClassName.foundByOther;
    } else {
      return ClassName.normal;
    }
  }

  public wasFound(clue: Clue): boolean {
    return (clue.isFound.byYourself || clue.isFound.byAnother);
  }
}
