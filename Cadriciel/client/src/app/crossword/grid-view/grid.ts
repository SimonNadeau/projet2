import { Space } from "../interface/space";

export class Grid {

    private _content: Space[][];

    public constructor(grid: string[][]) {
        this.setGrid(grid);
    }

    public setGrid(grid: string[][]): void {
        this._content = [];
        for (let row: number = 0; row < grid.length ; row++) {
            this._content[row] = [];
            for (let col: number = 0 ; col < grid.length ; col++) {
                this._content[row][col] = {
                    expectedChar: grid[row][col],
                    isSelected: false,
                    isSelectedByOther: false,
                    foundByStatus: {yourself: false, another: false},
                    positionI: col,
                    positionJ: row,
                    isFirst: false,
                    isLast: false,
                    isFilled: false,
                    index: undefined,
                    tempChar: undefined
                };
            }
        }
    }

    public get content(): Space[][] {
        return this._content;
    }
}
