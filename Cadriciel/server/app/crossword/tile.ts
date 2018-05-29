import { Position } from "./position";
import { Direction } from "./direction";

export const BLACK_TILE: string = "#";

export interface Tile {
    position: Position;
    character: string;
    direction: Direction;
}
