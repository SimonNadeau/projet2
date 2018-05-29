import { GridGenerator } from "./gridGenerator";
import { CrossingSpaceHandler } from "./crossingSpaceHandler";
import { SpaceHandler } from "./spaceHandler";
import { Direction } from "./direction";

import { expect } from "chai";
import { Tile } from "./tile";

describe("Crossing space handler", () => {
    let gridGen: GridGenerator;
    let crossingSpaceHandler: CrossingSpaceHandler;
    let spaceHandler: SpaceHandler;

    beforeEach(() => {
        gridGen = new GridGenerator(1);
        crossingSpaceHandler = new CrossingSpaceHandler(gridGen["_grid"]);
        spaceHandler = new SpaceHandler(gridGen["_grid"]);
    });

    it("should choose a random position", async () => {
        spaceHandler.generateSpaceFromWord({row: 0, col: 0}, Direction.Across, "word");
        spaceHandler.generateSpaceFromWord({row: 0, col: 0}, Direction.Down, "wagon");

        expect(crossingSpaceHandler.chooseRandomPosition([{row: 0, col: 0}])).to.not.eql(undefined);
    });

    it("should choose a random space", async () => {
        const word: string = "word";
        const tiles: Tile[] = new Array<Tile>();
        for (let i: number = 0; i < word.length; i++) {
            const tmpTile: Tile = {position: {row: 0, col: i}, character: word.charAt(i), direction: Direction.Across};
            gridGen["_grid"]["tiles"][0][i] = tmpTile;
            tiles.push(tmpTile);
        }

        gridGen["_grid"]["spaces"].push( {direction: Direction.Across, position: {row: 0, col: 0}, tiles: tiles});

        expect(crossingSpaceHandler.chooseRandomSpace({row: 0, col: 0})).to.not.eql(undefined);
    });

});
