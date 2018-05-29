import { Injectable } from "@angular/core";
import { Clue } from "../crossword/interface/clue";
import { Space } from "../crossword/interface/space";
import { CrosswordService } from "./crossword.service";
import { Word } from "../../../../common/communication/word";

const SELECT_BY_OTHER: boolean = true;
const IS_UNSELECTED_OF_OTHER: boolean = true;

@Injectable()
export class SelectWordsAndCluesService extends CrosswordService {

  private _selectedWord: Word = undefined;

  public get selectedWord(): string {
    return this._selectedWord.content;
  }

  public unselectAllClues(): void {
    for (const clue of this.cluesService.clues) {
      clue.isSelected = false;
    }
  }

  public unselectAllSpaces(unselectOfOther: boolean): void {
    for (const array of this.gridService.content) {
      for (let i: number = 0 ; i < this.gridService.content.length ; i++) {
        (unselectOfOther) ? array[i].isSelectedByOther = false  : array[i].isSelected = false;
      }
    }
  }

  public selectClue(clue: Clue): void {
    this.unselectAllClues();
    clue.isSelected = true;
  }

  public clearAndSelectSpacesOf(word: Word): void {
    this.unselectAllSpaces(!IS_UNSELECTED_OF_OTHER);
    this.selectSpacesOf(word, !SELECT_BY_OTHER);
    this._selectedWord = word;
  }

  private selectSpacesOf(word: Word, selectByOther: boolean): void {
    for (const space of this.getSpacesOf(word)) {
      (selectByOther) ? space.isSelectedByOther = selectByOther :   space.isSelected = true;
    }
  }

  public findAndSelectWord(word: string): void {
    this.unselectAllSpaces(IS_UNSELECTED_OF_OTHER);
    this.selectSpacesOf(this.findWordByString(word), SELECT_BY_OTHER);
  }

  public selectWordAndClueAt(space: Space): Word {
    const verticalClue: Clue = this.cluesService.getClueOf(this.getVerticalWordOf(space));
    const horizontalClue: Clue = this.cluesService.getClueOf(this.getHorizontalWordOf(space));

    const clueToSelected: Clue = this.identifyClueToSelect(horizontalClue, verticalClue);

    if (clueToSelected !== undefined) {
      this.clearAndSelectSpacesOf(clueToSelected.word);
      this.selectClue(clueToSelected);

      return clueToSelected.word;
    }

    return undefined;
  }

  private identifyClueToSelect(horizontalClue: Clue, verticalClue: Clue): Clue {
    if (horizontalClue !== undefined) {
      return (horizontalClue.isSelected && verticalClue !== undefined) ? verticalClue : horizontalClue;
    } else {
      return verticalClue;
    }
  }
}
