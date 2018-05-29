import { Injectable } from "@angular/core";
import { Space } from "../crossword/interface/space";
import { RequestServerService } from "../services/request-server.service";
import { CluesService } from "./clues.service";
import { GridService } from "./grid.service";
import { Word } from "../../../../common/communication/word";

@Injectable()
export class CrosswordService {

  public constructor( protected requestServer: RequestServerService,
                      protected cluesService: CluesService,
                      protected gridService: GridService) {
  }

  private getOrientedWordOf(space: Space, isVertical: boolean): Word {
    for (const word of this.cluesService.words) {
      if (word.vertical === isVertical) {
        if (this.areBind(word, space)) {
          return word;
        }
      }
    }

    return undefined;
  }

  public getSpacesOf(word: Word): Space[] {
    const spaces: Space[] = [];
    const start: number = (word.vertical) ? word.positionJ : word.positionI;
    const end: number = start + word.size;

    for (let i: number = start ; i < end ; i++) {
      const space: Space = word.vertical  ? this.gridService.content[i][word.positionI]
                                                  : this.gridService.content[word.positionJ][i];
      spaces.push(space);
    }

    return spaces;
  }

  public getVerticalWordOf(space: Space): Word {
    return this.getOrientedWordOf(space, true);
  }

  public getHorizontalWordOf(space: Space): Word {
    return this.getOrientedWordOf(space, false);
  }

  public findWordOfSpace(space: Space ): Word {
    if (this.isSpaceGoingVertically(space)) {
      return this.getVerticalWordOf(space);
    } else if (this.getHorizontalWordOf(space) !== undefined) {
      return this.getHorizontalWordOf(space);
    }

    return undefined;
  }

  public findWordByString(word: string): Word {
    for (const clue of this.cluesService.clues) {
      if (clue.word.content === word) {
        return clue.word;
      }
    }

    return undefined;
  }

  public areBind(word: Word, space: Space): boolean {
    for (const tmpSpace of this.getSpacesOf(word)) {
      if (tmpSpace === space) {
        return true;
      }
    }

    return false;
  }

  public isSpaceGoingVertically(space: Space): boolean {
    return this.cluesService.getClueOf(this.getVerticalWordOf(space)) !== undefined &&
           this.cluesService.getClueOf(this.getVerticalWordOf(space)).isSelected;
  }
}
