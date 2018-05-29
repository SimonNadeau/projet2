/* tslint:disable: no-magic-numbers */

import { Stopwatch } from "../class/timer/stopwatch";

describe("StopWatch", () => {
    let SW: Stopwatch;

    beforeEach(async (done: () => void) => {
        SW = new Stopwatch();
        done();
    });

    it("Hundredth should be instantiated correctly with two number", () => {
        expect(SW.getFormattedHundredth()).toEqual("00");
    });

    it("Seconds should be instantiated correctly with two number", () => {
        expect(SW.getFormattedSeconds()).toEqual("00");
    });

    it("Minutes should be instantiated correctly with two number", () => {
        expect(SW.getFormattedMinutes()).toEqual("00");
    });

    it("should restart correctly.", () => {
        SW.update();
        SW.reset();
        expect(SW.getTime()).toEqual([]);
    });
});
