import { Injectable } from "@angular/core";
import { CrosswordService } from "./crossword.service";
import { Space } from "../crossword/interface/space";
import { Word } from "../../../../common/communication/word";
const BACKSPACE_KEYCODE: number = 8;
const enum Direction {
  FORWARD = 1,
  BACKWARD = -1
}

@Injectable()

export class FocusService extends CrosswordService {

  public setFocus(space: Space, vertical: boolean, event: KeyboardEvent, i: number, j: number): void {
    let nextFocusI: number = this.getFocusI(space, event, i);
    let nextFocusJ: number = this.getFocusJ(space, event, j);

    if (vertical) {
      nextFocusJ = this.getNewFocus(space, nextFocusJ, event.keyCode === BACKSPACE_KEYCODE);
    } else {
      nextFocusI = this.getNewFocus(space, nextFocusI, event.keyCode === BACKSPACE_KEYCODE);
    }

    this.gridService.focusJ = nextFocusJ;
    this.gridService.focusI = nextFocusI;
  }

  public setNextFocus(word: Word): void {
    let nextFocusI: number = word.positionI;
    let nextFocusJ: number = word.positionJ;

    while (this.gridService.content[nextFocusJ][nextFocusI].isFilled) {
      if (word.vertical) {
        nextFocusJ++;
      } else {
        nextFocusI++;
      }
    }
    this.gridService.focusI = nextFocusI;
    this.gridService.focusJ = nextFocusJ;
  }

  private getFocusI(space: Space, event: KeyboardEvent, i: number): number {
    let focusI: number;
    if (this.isSpaceGoingVertically(space)) {
      return i;
    }

    return focusI = (event.keyCode === BACKSPACE_KEYCODE) ? --i : ++i ;
  }

  private getFocusJ(space: Space, event: KeyboardEvent, j: number): number {
    if (this.isSpaceGoingVertically(space)) {
      return (event.keyCode === BACKSPACE_KEYCODE) ? --j : ++j ;
    }

    return j;
  }

  public getNewFocus(space: Space, focus: number, backspace: boolean ): number {
    if (backspace) {
      if (!this.isFirstOfOwnWord(space)) {
        focus = this.adjustFocus(space, focus, Direction.BACKWARD);
      }
    } else {
     if (!this.isLastOfOwnWord(space)) {
        focus = this.adjustFocus(space, focus, Direction.FORWARD);
      }
    }

    return focus;
  }

  private adjustFocus(space: Space, focus: number, direction: Direction): number {
    let nextSpace: Space = this.getSpaceWithDirection(space, this.isSpaceGoingVertically(space), direction);
    while (nextSpace.isFilled) {
      focus += direction.valueOf();
      nextSpace = this.getSpaceWithDirection(nextSpace, this.isSpaceGoingVertically(space), direction);
    }

    return focus;
  }

  private getSpaceWithDirection(space: Space, vertical: boolean, movement: number): Space {

    for (let i: number = 0 ; i < this.gridService.content.length ; i++) {
      for (let j: number = 0 ; j < this.gridService.content.length ; j++) {
        if (this.gridService.content[j][i] === space) {
          return vertical ? this.gridService.content[j + movement][i] : this.gridService.content[j][i + movement];
        }
      }
    }

    return undefined;
  }

  public isLastOfOwnWord(space: Space): boolean {
    const spaces: Space[] = this.getSpacesOf(this.findWordOfSpace(space));

    return space === spaces[spaces.length - 1];
  }

  private isFirstOfOwnWord(space: Space): boolean {
    const spaces: Space[] = this.getSpacesOf(this.findWordOfSpace(space));

    return space === spaces[0];
  }
}
