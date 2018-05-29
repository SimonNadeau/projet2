import { Position } from "./position";
import { Direction } from "./direction";
import { Tile, BLACK_TILE } from "./tile";
import { Space } from "./space";
import { Grid, SIZE } from "./grid";
import { getRandomValue } from "./random";

export class SpaceHandler {

    public constructor(private _grid: Grid) {}

    private generateTiles(position: Position, direction: Direction, word: string): Tile[] {
        const tiles: Tile[] = new Array<Tile>();
        for (let i: number = 0; i < word.length; i++) {
            const col: number = (direction === Direction.Across) ? position.col + i : position.col;
            const row: number = (direction === Direction.Down) ? position.row + i : position.row;

            tiles[i] = this.addTile({row: row, col: col},
                                    (this._grid.tiles[row][col].direction === Direction.None)
                                        ? direction : Direction.Both,
                                    word.charAt(i));
        }

        return tiles;
    }

    private addSpace(direction: Direction, position: Position, tiles: Tile[]): void {
        this._grid.spaces.push({
            direction: direction,
            position: position,
            tiles: tiles
        });
    }

    private addTile(position: Position, direction: Direction, character: string): Tile {
        return this._grid.tiles[position.row][position.col] = {
            position: position,
            direction: direction,
            character: character};
    }

    public generateSeedSpace(word: string): void {
        const direction: Direction = (getRandomValue(1)) ? Direction.Down : Direction.Across;
        let randomRow: number;
        let randomCol: number;
        if (direction === Direction.Across) {
            randomRow = getRandomValue(SIZE);
            randomCol = getRandomValue(SIZE - word.length);
        } else {
            randomRow = getRandomValue(SIZE - word.length);
            randomCol = getRandomValue(SIZE);
        }
        const position: Position = {row: randomRow, col: randomCol};

        this.generateSpaceFromWord(position, direction, word);
    }

    public generateSpaceFromWord(position: Position, direction: Direction, word: string): void {
        this.addSpace(direction, position, this.generateTiles(position, direction, word));
    }

    public removeLastSpace(): void {
        const removedSpace: Space = this._grid.spaces.pop();
        removedSpace.tiles.forEach((tile: Tile) => {
            if (this._grid.tiles[tile.position.row][tile.position.col].direction === Direction.Both) {
                this._grid.tiles[tile.position.row][tile.position.col].direction =
                (removedSpace.direction === Direction.Across) ? Direction.Down : Direction.Across ;
            } else {
                this._grid.tiles[tile.position.row][tile.position.col].direction =  Direction.None;
                this._grid.tiles[tile.position.row][tile.position.col].character = BLACK_TILE;
            }
        });
    }
}
