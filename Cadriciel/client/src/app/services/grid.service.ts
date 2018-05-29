import { Injectable } from "@angular/core";
import { Grid } from "../crossword/grid-view/grid";
import { Space } from "../crossword/interface/space";

const INIT_FOCUS: number = -1;

@Injectable()
export class GridService {

  private _grid: Grid;
  public focusI: number;
  public focusJ: number;

  public constructor() {
    this._grid = new Grid([[undefined]]);
    this.focusI = this.focusJ = INIT_FOCUS;
  }

  public set grid(array: string[][]) {
    this._grid.setGrid(array);
  }

  public initIndexes(): void {
    let index: number = 1;
    for (const array of this._grid.content) {
      for (let l: number = 0 ; l < this._grid.content.length ; l++) {
        if (array[l].isFirst) {
          array[l].index = index;
          index++;
        }
      }
    }
  }

  public get content(): Space[][] {
    return this._grid.content;
  }

  public verify(space: Space): boolean {
    return (space.expectedChar === space.tempChar);
  }

}
