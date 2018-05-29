import { Injectable } from "@angular/core";
import { Clue } from "../crossword/interface/clue";
import { Word } from "../../../../common/communication/word";
import { Space } from "../crossword/interface/space";

@Injectable()
export class CluesService {

  public clues: Clue[] = [];
  public words: Word[] = [];

  public setOneClue(_word: Word, space: Space): void {
    if (_word.positionI === space.positionI ) {
      if (_word.positionJ === space.positionJ) {
        const newClue: Clue = {
          index: space.index,
          definition: _word.definition,
          isSelected: false,
          isFound: {byYourself: false, byAnother: false},
          word: _word
        };
        this.clues.push(newClue);
      }
    }
  }

  public getClueOf(_word: Word): Clue {
    for (const clue of this.clues) {
      if (clue.word === _word) {
        return clue;
      }
    }

    return undefined;
  }

  public switchClueAsFound(word: Word, findByOther: boolean): void {
    (findByOther) ?
    this.getClueOf(word).isFound.byAnother = findByOther : this.getClueOf(word).isFound.byYourself = !findByOther;
  }

  public toggleSelectedStatus(clue: Clue): void {
    clue.isSelected  = !clue.isSelected;
  }

  public cheatMode(): void {
    for (const clue of this.clues) {
      clue.definition  = clue.word.content;
    }
  }

  public normalMode(): void {
    for (const clue of this.clues) {
      clue.definition = clue.word.definition;
    }
  }
}
