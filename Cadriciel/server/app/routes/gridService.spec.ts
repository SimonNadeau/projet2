import { expect } from "chai";
import chai = require("chai");
import ChaiHttp = require("chai-http");

chai.use(ChaiHttp);

const URL: string = "http://localhost:3000";
const GRID_DIFFICULTY: number = 0;
const ADRESS: string = "/generateGrid/" + GRID_DIFFICULTY;

describe("Grid Service", () => {
    beforeEach(async (done: () => void) => {
        done();
    });

    it("should load a object with keys: table and words and not be empty", async () => {
        await chai.request(URL)
            .post(ADRESS)
            .end(async (err: Error, res: ChaiHttp.Response ) => {
                expect(JSON.parse(res.text)).to.have.all.keys("grid", "table");
                expect(JSON.parse(res.text).table).not.to.equal(undefined);
                expect(JSON.parse(res.text).grid).not.to.equal(undefined);
                expect(res).to.have.status(200);
            });
    }).timeout(60000);

});
