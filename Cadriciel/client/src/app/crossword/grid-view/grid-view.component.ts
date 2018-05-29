import { Component, HostListener, Output, EventEmitter, Input } from "@angular/core";
import { Space } from "../interface/space";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { GridService } from "../../services/grid.service";
import { CrosswordService } from "../../services/crossword.service";
import { FocusService } from "../../services/focus.service";
import { Word } from "../../../../../common/communication/word";
import { FindWordService } from "../../services/find-word.service";

const ASCII_A_UPPER_CASE: number = 65;
const ASCII_Z_UPPER_CASE: number = 90;
const ASCII_A_LOWER_CASE: number = 97;
const ASCII_Z_LOWER_CASE: number = 122;
const BACKSPACE_CODE: number = 8;
const EMPTY_SQUARE: string = "#";

const enum HTMLClassName {
  void = "void",
  space = "space",
  selected = "selected",
  found = "found",
  otherSelected = "otherSelected",
  doubleSelected = "doubleSelected",
  foundByOther = "foundByOther",
  doubleFound = "doubleFound"
}

const IS_UNSELECTED_OF_OTHER: boolean = true;
const END_GAME: boolean = true;
@Component({
  selector: "app-grid-view",
  templateUrl: "./grid-view.component.html",
  styleUrls: ["./grid-view.component.css"],
})

export class GridViewComponent {

  @Output() public selectEmitter: EventEmitter<string>;
  @Output() public wordFoundEmitter: EventEmitter<string[]>;
  @Output() public endGameEmitter: EventEmitter<boolean>;
  @Input() public gridGenerated: boolean;

  public spaceTempChar: string;

  public constructor( private crosswordService: CrosswordService,
                      private gridService: GridService,
                      private selectionService: SelectWordsAndCluesService,
                      private focusService: FocusService,
                      private findWordService: FindWordService ) {

      this.spaceTempChar = "";
      this.selectEmitter = new EventEmitter<string>();
      this.wordFoundEmitter = new EventEmitter<string[]>();
      this.endGameEmitter = new EventEmitter<boolean>();
      this.gridGenerated = false;
    }

  public giveSquareClass(space: Space): string {
    if (space.expectedChar === EMPTY_SQUARE) {
      return HTMLClassName.void;
    } else if (!space.isSelected && !space.isSelectedByOther && !space.isFilled) {
      return HTMLClassName.space;
    } else if (!space.isFilled) {
      return this.giveSeletedClass(space);
    } else {
      return this.giveFoundClass(space);
    }

  }

  private giveSeletedClass(space: Space): string {
    if (space.isSelected && !space.isSelectedByOther && !space.isFilled) {

      return HTMLClassName.selected;
    } else if (!space.isSelected && space.isSelectedByOther && !space.isFilled) {

      return HTMLClassName.otherSelected;
    }

    return HTMLClassName.doubleSelected;
  }

  private giveFoundClass(space: Space): string {
    if (space.isFilled && !space.foundByStatus.another && space.foundByStatus.yourself) {

      return HTMLClassName.found;
    } else if (space.isFilled && space.foundByStatus.another && !space.foundByStatus.yourself) {

      return HTMLClassName.foundByOther;
    }

    return HTMLClassName.doubleFound;
  }

  public isEmpty(space: Space): boolean {
    return (space.expectedChar === EMPTY_SQUARE);
  }

  public select(space: Space): void {
    const word: Word = this.selectionService.selectWordAndClueAt(space);
    this.selectEmitter.emit(this.selectionService.selectedWord);
    if (space.isFilled) {
      this.focusService.setNextFocus(this.crosswordService.findWordOfSpace(space));
    } else {
      this.gridService.focusI = word.positionI;
      this.gridService.focusJ = word.positionJ;
    }
  }

  public clickInside($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  @HostListener("document:click", ["$event"])
  public clickedOutSide($event: Event): void {
    this.selectionService.unselectAllSpaces(!IS_UNSELECTED_OF_OTHER);
  }

  public omitSpecialCharacter(event: KeyboardEvent): void {
    if (this.verifySpecialCharacter(event.keyCode)) {
      event.preventDefault() ;
    }
  }

  public verifySpecialCharacter(code: number): boolean {
    return !((code >= ASCII_A_LOWER_CASE && code <= ASCII_Z_LOWER_CASE) ||
        (code >= ASCII_A_UPPER_CASE && code <= ASCII_Z_UPPER_CASE) ||
        (code === BACKSPACE_CODE));
  }

  public fillBox(space: Space): string {
    if (space.isFilled) {
      return space.expectedChar ;
    } else if (!space.isSelected) {
      return " ";
    }

    return "";
  }

  public setSpaceTempChar(space: Space, spaceValue: string, event: KeyboardEvent, i: number, j: number): void {
    const ascii: number = spaceValue.toUpperCase().charCodeAt(0);
    if ((ascii >= ASCII_A_UPPER_CASE && ascii <= ASCII_Z_UPPER_CASE) || event.keyCode === BACKSPACE_CODE) {
      space.tempChar = spaceValue.toUpperCase();
      if (this.findWordService.verifyWordOf(space)) {
        this.wordFoundEmitter.emit(this.findWordService.arrayWordFound);
        this.verifyEndGame();
      }
      this.changeSpacesFocus(space, event, i, j);
    } else {
      event.preventDefault();
    }
  }

  private changeSpacesFocus(space: Space, event: KeyboardEvent, i: number, j: number): void {
    if (this.crosswordService.isSpaceGoingVertically(space)) {
      this.focusService.setFocus(space, true, event, i, j);
    } else {
      this.focusService.setFocus(space, false, event, i, j);
    }
  }

  private verifyEndGame(): void {
    if (this.findWordService.verifyAllWordFound()) {
      this.notifyEndGame();
    }
  }

  private notifyEndGame(): void {
    this.endGameEmitter.emit(END_GAME);
  }

}
