import { expect } from "chai";
import chai = require("chai");
import ChaiHttp = require("chai-http");
chai.use(ChaiHttp);

describe("Data base", () => {
    const URL: string = "http://localhost:3000";
    let dataLength: number = -1;
    let dataID: string = "";

    beforeEach(async (done: () => void) => {
        done();
    });

    it("should load a array when calling get at the database", (done: () => void) => {
        chai.request(URL)
            .get("/db/tracks/list")
            .end((err: Error, res: ChaiHttp.Response ) => {
                dataLength = res.body.length;
                expect(dataLength).to.above(-1);
                done();
            });
    });

    it("should create a array in the database",  (done: () => void) => {

        chai.request(URL)
        .post("/db/tracks/add")
        .send({ "name": "mockName", "description": "mockDescription" })
        .end((errpr: Error, response: ChaiHttp.Response) => {
            chai.request(URL)
                .get("/db/tracks/list")
                .end((err: Error, res: ChaiHttp.Response) => {
                    expect(res.body.length).to.above(dataLength);
                    dataLength = res.body.length;
                    for (const track of res.body ) {
                        if (track.name === "mockName") {
                            dataID = track._id;
                        }
                    }
                    done();
                });
        });
    });

    it("should update a array in the database",  (done: () => void) => {

        chai.request(URL)
        .put("/db/tracks/update/" + dataID)
        .send({ "name": "mockNameUpdate", "description": "mockDescriptionUpdate" })
        .end((errpr: Error, response: ChaiHttp.Response) => {
            chai.request(URL)
                .get("/db/tracks/list")
                .end((err: Error, res: ChaiHttp.Response) => {
                    for (const track of res.body ) {
                        if (track._id === dataID) {
                            expect(track.name).to.equal("mockNameUpdate");
                            expect(track.description).to.equal("mockDescriptionUpdate");
                        }
                    }
                    done();
                });
        });
    });

    it("should delete a array in the database", (done: () => void) => {
        chai.request(URL)
            .del("/db/tracks/delete/" + dataID)
            .end((error: Error, response: ChaiHttp.Response) => {
                chai.request(URL)
                .get("/db/tracks/list")
                .end((err: Error, res: ChaiHttp.Response) => {
                    expect(dataLength).to.above(res.body.length);
                    done();
                });
        });
    });

});
