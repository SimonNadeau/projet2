/* tslint:disable: no-magic-numbers */

import { RaceState } from "../class/raceEvent/raceState";
import { NBR_LAPS } from "../class/raceEvent/raceEventInterface";
import { RenderService } from "../../render-service/render.service";

describe("RaceState", () => {
    let raceState: RaceState;
    let render: RenderService;

    beforeEach(async (done: () => void) => {
        render = new RenderService();
        raceState = new RaceState(render);
        done();
    });

    it("should be defined", () => {
        expect(raceState).toBeDefined();
    });

    it("should be a 3 lap race", () => {
        expect(NBR_LAPS).toEqual(3);
    });

    it("should change to afterRaceState when 3 laps are completed", () => {
        raceState["_render"].car.lap = 3;
        raceState["_duringRace"]["checkEndOfRace"](raceState["_render"].car);
        raceState.update();
        expect(raceState["_duringRace"].isEnd).toBeTruthy();
    });

});
