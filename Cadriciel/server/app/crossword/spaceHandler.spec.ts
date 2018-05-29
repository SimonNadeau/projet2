import { GridGenerator } from "./gridGenerator";
import { SpaceHandler } from "./spaceHandler";
import { Direction } from "./direction";

import { expect } from "chai";

describe("Space handler", () => {
    let gridGen: GridGenerator;
    let spaceHandler: SpaceHandler;

    beforeEach(() => {
        gridGen = new GridGenerator(1);
        spaceHandler = new SpaceHandler(gridGen["_grid"]);
    });

    it("should generate the first space", async () => {
        spaceHandler.generateSeedSpace("word");
        expect(gridGen["_grid"]["spaces"][0]).to.not.eql(undefined);
    });

    it("should remove the last space added", async () => {
        spaceHandler.generateSpaceFromWord({row: 0, col: 0}, Direction.Across, "word");
        spaceHandler.generateSpaceFromWord({row: 0, col: 0}, Direction.Down, "wagon");
        spaceHandler.removeLastSpace();

        expect(gridGen["_grid"]["spaces"].length).to.eql(1);
        expect(gridGen["_grid"]["spaces"][0].direction).to.eql(Direction.Across);
    });
});
