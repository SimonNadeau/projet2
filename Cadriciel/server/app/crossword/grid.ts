import { Tile } from "./tile";
import { Space } from "./space";

export const SIZE: number =  10;
export const HEIGHT: number = SIZE;
export const WIDTH: number = SIZE;

export interface Grid {
    tiles: Tile[][];
    spaces: Space[];
}
