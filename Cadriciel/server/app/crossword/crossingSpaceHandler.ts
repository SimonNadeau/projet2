import { Space } from "./space";
import { Position } from "./position";
import { Direction } from "./direction";
import { Tile, BLACK_TILE } from "./tile";
import { Grid, SIZE } from "./grid";
import { getRandomValue } from "./random";

interface EmptySpace {
    position: Position;
    direction: Direction;
    range: number;
}

export class CrossingSpaceHandler {

    public constructor(private _grid: Grid) {}

    private assignNextPosition(direction: Direction, position: Position, directedDistance: number): Position {
        return (direction === Direction.Across) ?
                                        {col: position.col + directedDistance, row: position.row} :
                                        {row: position.row + directedDistance, col: position.col};
    }

    private assignDirectedPosition(direction: Direction, nextPosition: Position, leftFactor: number): Position {
        if ( direction === Direction.Across) {
            return { row: nextPosition.row.valueOf() + leftFactor, col: nextPosition.col.valueOf() };
        } else {
            return { row: nextPosition.row.valueOf(), col: nextPosition.col.valueOf() + leftFactor };
        }
    }

    private findMaximumDistance(direction: Direction, position: Position, directionFactor: number): number {
        let distance: number = 1;
        let inBounds: boolean = true;
        let nextPosition: Position = this.assignNextPosition(direction, position, directionFactor * (distance));
        let surrounded: boolean = this.testTile(nextPosition, false);
        do {
            inBounds = this.inBounds(nextPosition);

            surrounded = surrounded || this.testTile(this.assignDirectedPosition(direction, nextPosition, -1), surrounded)
                                    || this.testTile(this.assignDirectedPosition(direction, nextPosition, 1), surrounded);

            nextPosition = this.assignNextPosition(direction, position, directionFactor * (distance + 1));
            surrounded = surrounded || this.testTile(nextPosition, surrounded);

            if (distance === 1 && surrounded) {
                return null;
            }

            distance++;
        } while (inBounds && !surrounded);

        return --distance;
    }

    private getAlignedTiles(emptySpace: EmptySpace): Tile[] {
        const tiles: Tile[] = new Array<Tile>();
        for (let i: number = 0; i <= emptySpace.range; i++) {
            tiles.push((emptySpace.direction === Direction.Across) ?
                            this._grid.tiles[emptySpace.position.row][emptySpace.position.col + i] :
                            this._grid.tiles[emptySpace.position.row + i][emptySpace.position.col]);
        }

        return tiles;
    }

    private inBounds(position: Position): boolean {
        return position.row >= 0 && position.row < SIZE && position.col >= 0 && position.col < SIZE;
    }

    private findCrossingDirection(position: Position): Direction {
        return (this._grid.tiles[position.row][position.col].direction === Direction.Across) ? Direction.Down : Direction.Across;
    }

    private testTile(sidePosition: Position, surrounded: boolean): boolean {
        if (this.inBounds(sidePosition)) {
            surrounded = surrounded || this._grid.tiles[sidePosition.row][sidePosition.col].character !== BLACK_TILE;
        }

        return surrounded;
    }

    public chooseRandomPosition(blockedPositions: Position[]): Position {
        const acceptedTiles: Tile[] = new Array<Tile>();
        this._grid.spaces.forEach((space: Space) => {
            space.tiles.forEach((tile: Tile) => {
                const blocked: boolean =
                blockedPositions.filter((position: Position) => {
                    return position === tile.position;
                }).length === 0;

                if (tile.direction !== Direction.Both && blocked) {
                    acceptedTiles.push(tile);
                }
            });
        });

        return (acceptedTiles.length === 0) ? null : acceptedTiles[getRandomValue(acceptedTiles.length)].position;
    }

    public chooseRandomSpace(position: Position): Space {
        const direction: Direction =  this.findCrossingDirection(position);
        let previousRange: number =  this.findMaximumDistance(direction, position, -1);
        let followingRange: number = this.findMaximumDistance(direction, position, 1);
        if (previousRange === null || followingRange === null) {
            return null;
        }
        previousRange = getRandomValue(previousRange);
        followingRange = getRandomValue(followingRange);
        const startingPosition: Position = (direction === Direction.Across) ?
                            {col: position.col - previousRange, row: position.row} :
                            {row: position.row - previousRange, col: position.col};

        return {
            position: startingPosition,
            direction: direction,
            tiles: this.getAlignedTiles(
                {position: startingPosition, direction: direction, range: previousRange + followingRange}
            )};
    }
}
