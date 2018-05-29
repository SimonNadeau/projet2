import { Position } from "./position";
import { Tile } from "./tile";
import { Direction } from "./direction";

export const MINIMUM_SIZE: number = 2;
export const MAXIMUM_SIZE: number = 10;

export interface Space {
    direction: Direction;
    position: Position;
    tiles: Tile[];
}
