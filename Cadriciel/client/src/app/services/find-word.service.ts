import { Injectable } from "@angular/core";
import { CrosswordService } from "./crossword.service";
import { Word } from "../../../../common/communication/word";
import { Space } from "../crossword/interface/space";
import { UndefinedError } from "../../../../common/error/undefinedError";

const FIND_BY_OTHER: boolean = true;
const VOID_CHAR: string = "#";

@Injectable()
export class FindWordService extends CrosswordService {

  private _arrayWordFound: string[];

  public get arrayWordFound(): string[] {
    return this._arrayWordFound;
  }

  public verifyWordOf(currentSpace: Space): boolean {
    this._arrayWordFound = [];
    const _word: Word = this.findWordOfSpace(currentSpace);

    try {
      this.verifyIfVarUndefined(_word);
      for (const space of this.getSpacesOf(_word)) {
        if (!space.isFilled && !this.gridService.verify(space)) {

          return false;
        }
      }
    } catch (e) {
      if (e.name === UndefinedError.name) {
        return false;
      }
      console.error(e);
    }

    this.setFound(_word, !FIND_BY_OTHER);
    this.gridService.focusI = -1;
    this.gridService.focusJ = -1;

    this.insertWord(_word.content);

    return true;
  }

  public setFound(word: Word, findByStatus: boolean): void {
    for (const space of this.getSpacesOf(word)) {
      space.isFilled = true;
      this.toggleSpaceFound(findByStatus, space);
      (word.vertical) ?
        this.verifyOtherWordFound(this.getHorizontalWordOf(space), findByStatus) :
        this.verifyOtherWordFound(this.getVerticalWordOf(space), findByStatus);
      this.cluesService.switchClueAsFound(word, findByStatus);
    }
    word.isFound = true;

  }

  public verifyAllWordFound(): boolean {
    for (const row of this.gridService.content) {
      for (const col of row) {
        if (!col.isFilled && col.expectedChar !== VOID_CHAR) {
          return false;
        }
      }
    }

    return true;
  }

  private verifyOtherWordFound(word: Word, status: boolean): void {
    try {
      this.verifyIfVarUndefined(word);
      if (this.isWordSpacesFound(word) && !word.isFound) {
        if (!status) {
          this.cluesService.switchClueAsFound(word, status);
          for (const space of this.getSpacesOf(word)) {
            this.toggleSpaceFound(status, space);
          }
        }
        word.isFound = true;
        this.insertWord(word.content);
      }
    } catch (e) {
      if (e.name === UndefinedError.name) {
        return;
      }
      console.error(e);
    }

  }

  private toggleSpaceFound(status: boolean, space: Space): void {
    (status) ? space.foundByStatus.another = status : space.foundByStatus.yourself = !status;
  }

  private insertWord(word: string): void {
    try {
      this.verifyIfVarUndefined(word);
      this._arrayWordFound.push(word);
    } catch (e) {
      if (e.name === UndefinedError.name) {
        return;
      }
      console.error(e);
    }
  }

  private isWordSpacesFound(word: Word): boolean {
    for (const space of this.getSpacesOf(word)) {
      if (!space.isFilled) {
        return false;
      }
    }

    return true;
  }

  private verifyIfVarUndefined<T>(value: T): void {
    if (value === undefined) {
      throw new UndefinedError();
    }
  }

}
