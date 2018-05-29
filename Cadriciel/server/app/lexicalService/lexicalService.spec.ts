import { expect } from "chai";
import chai = require("chai");
import ChaiHttp = require("chai-http");
chai.use(ChaiHttp);

const WORD_DEF_ROUTE: string = "/getDef/0/word";
const WORD_ROUTE: string = "/getWords/0/4/word";
const WORD_DEFINITION: string = "a unit of language that native speakers can identify";
const WORD_BODY: string = '["word"]';

describe("Lexical Service", () => {
    const URL: string = "http://localhost:3000";

    it("should have some definitions", async () => {
        await chai.request(URL)
            .get(WORD_DEF_ROUTE)
            .then((res: ChaiHttp.Response) => {
                expect(res.text).to.eql(WORD_DEFINITION);
            });
    });

    it("should have some words", async () => {
        await chai.request(URL)
            .get(WORD_ROUTE).then((res: ChaiHttp.Response) => {
                expect(res.text).to.eql(WORD_BODY);
            });
    });

});
