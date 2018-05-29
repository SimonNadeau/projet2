import { Injectable } from "@angular/core";
import { Car } from "../race/car/car";
import { Results } from "../race/class/results";
import { Record } from "../../../../common/communication/record";
import { TWO_DIGIT, HUNDRED, TIME_SYSTEM } from "../race/class/timer/timeInterface";
import { NBR_LAPS, LAP, OVERALL } from "../race/class/raceEvent/raceEventInterface";

const TIME_00: string = "00";
const TIME_0: string = "0";
const INDEX_HUNDREDTHS: number = 0;
const INDEX_SECONDS: number = 1;
const INDEX_MINUTES: number = 2;

@Injectable()
export class RaceService {

    public constructor() { }

    public estimateVirtualTime(players: Car[], mainPlayer: Car): void {
        if (players === undefined ) {
            return;
        }
        for (const virtualCar of players) {
            if (virtualCar !== mainPlayer) {
                while (virtualCar.results.length !== NBR_LAPS) {
                    const lapName: string = LAP + (virtualCar.results.length + 1).toString();
                    virtualCar.results.push(this.createResult(lapName, this.calculateAverageTime(virtualCar, mainPlayer)));
                }
                this.calculateOverall(virtualCar);
            }
        }
    }

    public calculateOverall(car: Car): void {
        const time: number[] = this.addLapsTime(car);
        const overall: Results = this.createResult(OVERALL, time);
        car.results.push(overall);
    }

    public getRank(car: Car, players: Car[]): number {
        if (players === undefined ) {
            return 0;
        }
        let rank: number = 1;
        for (const player of players) {
            if (player !== car) {
                if (!this.arrivedBefore(car, player)) {
                    rank++;
                }
            }
        }

        return rank;
    }

    private arrivedBefore(car: Car, otherCar: Car): boolean {
        const overallCar: Results = car.results[car.results.length - 1];    // Le dernier resultat est toujours le overall time
        const overallOther: Results = otherCar.results[otherCar.results.length - 1];
        if (overallCar._minutes < overallOther._minutes) {
            return true;
        }
        if (overallCar._minutes === overallOther._minutes) {
            if (overallCar._seconds < overallOther._seconds) {
                return true;
            }
            if (overallCar._seconds === overallOther._seconds) {
                if (overallCar._hundredth < overallOther._hundredth) {
                    return true;
                }
            }
        }

        return false;
    }

    public isARecord(car: Car, times: Record): boolean {
        if (times === undefined) {
            return true;
        }
        if (car.results[NBR_LAPS]._minutes < times.minutes) {
            return true;
        }
        if (car.results[NBR_LAPS]._minutes === times.minutes) {
            if (car.results[NBR_LAPS]._seconds < times.seconds) {
                return true;
            }
            if (car.results[NBR_LAPS]._seconds === times.seconds) {
                if (car.results[NBR_LAPS]._hundredth < times.hundredths) {
                    return true;
                }
            }
        }

        return false;
    }

    public createRecord(car: Car): Record {
        const record: Record = {} as Record;
        record.playerName = car._name;
        record.minutes = car.results[NBR_LAPS]._minutes;
        record.seconds = car.results[NBR_LAPS]._seconds;
        record.hundredths = car.results[NBR_LAPS]._hundredth;

        return record;
    }

    private calculateAverageTime(virtualCar: Car, mainPlayer: Car): number[] {
        const addedResult: number[] = this.addLapsTime(virtualCar);
        const averageResult: number[] = [];
        for (const nbr of addedResult) {
            averageResult.push(Math.round(nbr / virtualCar.results.length));
        }

        return this.adjustResult(virtualCar, mainPlayer, averageResult);
    }

    private addLapsTime(car: Car): number[] {
        let hundredths: number = 0;
        let seconds: number = 0;
        let minutes: number = 0;
        const addedResult: number[] = [];

        for (const result of car.results) {
            hundredths += parseInt(result._hundredth, TWO_DIGIT);
            seconds += parseInt(result._seconds, TWO_DIGIT);
            minutes += parseInt(result._minutes, TWO_DIGIT);
        }

        addedResult.push(hundredths);
        addedResult.push(seconds);
        addedResult.push(minutes);

        return this.adjustWithTimeSystem(addedResult);
    }

    private adjustResult(car: Car, mainPlayer: Car, averageResult: number[]): number[] {
        const comparedLap: number = car.results.length;
        const comparedResult: Results = mainPlayer.results[comparedLap];
        const comparedMinutes: number = parseInt(comparedResult._minutes, TWO_DIGIT);
        const comparedSeconds: number = parseInt(comparedResult._seconds, TWO_DIGIT);

        if (averageResult[INDEX_MINUTES] < comparedMinutes) {
            averageResult[INDEX_MINUTES]++;
        } else if (averageResult[INDEX_MINUTES] === comparedMinutes) {
            if (averageResult[INDEX_SECONDS] <= comparedSeconds) {
                averageResult[INDEX_SECONDS] = comparedSeconds + 1;
            }
        }

        return this.adjustWithTimeSystem(averageResult);
    }

    private adjustWithTimeSystem(result: number[]): number[] {
        while (result[INDEX_HUNDREDTHS] >= HUNDRED) {
            result[INDEX_HUNDREDTHS] -= HUNDRED;
            result[INDEX_SECONDS] += 1;
        }
        while (result[INDEX_SECONDS] >= TIME_SYSTEM) {
            result[INDEX_SECONDS] -= TIME_SYSTEM;
            result[INDEX_MINUTES] += 1;
        }

        return result;
    }

    private createResult(name: string, time: number[]): Results {
        const result: Results = {} as Results;
        result._name = name;
        result._hundredth = this.formatTime(time[INDEX_HUNDREDTHS]);
        result._seconds = this.formatTime(time[INDEX_SECONDS]);
        result._minutes = this.formatTime(time[INDEX_MINUTES]);

        return result;
    }

    private formatTime(nbr: number): string {
        if (nbr === 0) {
            return TIME_00;
        }
        if (nbr < TWO_DIGIT) {
            return TIME_0 + nbr.toString();
        }

        return nbr.toString();
    }

}
