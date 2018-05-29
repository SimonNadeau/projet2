import { GridGenerator } from "./gridGenerator";
import { expect } from "chai";

import { DEFAULT_GRID } from "./mockGrids";

describe("Grid generator", () => {
    let gridGen: GridGenerator;
    beforeEach(() => {
        gridGen = new GridGenerator(1);
    });

    it("should be an empty grid", () => {
        expect(gridGen.getCharacterGrid()).to.eql(DEFAULT_GRID);
    });

    it("should have some words", async () => {
        await gridGen.generate().then(() => {
            expect(gridGen.getWords()).not.to.equal(undefined);
        });
    }).timeout(30000);
});
