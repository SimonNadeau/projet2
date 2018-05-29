/* tslint:disable: no-magic-numbers */

import { TestBed, inject } from "@angular/core/testing";
import { Car } from "../race/car/car";

import { RaceService } from "./race.service";
import { Results } from "../race/class/results";
import { Record } from "../../../../common/communication/record";

const zero: string = "00";
const second1: string = "01";
const second2: string = "02";
const second4: string = "04";
const second8: string = "09";
const INDEX_OVERALL: number = 3;
const INDEX_LAP3: number = 2;

describe("RaceService", () => {
  const results1: Results = {} as Results;
  const results2: Results = {} as Results;
  results1._minutes = results2._minutes = results1._hundredth = results2._hundredth = zero;
  results1._seconds = second1;
  results2._seconds = second2;

  const comparedRecord: Record = {} as Record;
  comparedRecord.minutes = comparedRecord.hundredths = zero;
  comparedRecord.seconds = second8;

  const car: Car = new Car();
  car.results.push(results1);
  car.results.push(results1);
  car.results.push(results2);

  const virtual1: Car = new Car();
  virtual1.results.push(results1);
  virtual1.results.push(results1);
  virtual1.results.push(results1);

  const virtual2: Car = new Car();
  virtual2.results.push(results1);
  virtual2.results.push(results1);

  const virtuals: Car[] = [];
  virtuals.push(virtual1);
  virtuals.push(virtual2);

  const allCars: Car[] = [];
  allCars.push(car);
  allCars.push(virtual1);
  allCars.push(virtual2);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaceService]
    });
  });

  it("should be created", inject([RaceService], (service: RaceService) => {
    expect(service).toBeTruthy();
  }));

  it("should calculate overall correctly", inject([RaceService], (service: RaceService) => {
    service.calculateOverall(car);
    expect(car.results.length).toEqual(INDEX_OVERALL + 1);
    expect(car.results[INDEX_OVERALL]._minutes).toEqual(zero);
    expect(car.results[INDEX_OVERALL]._seconds).toEqual(second4);
    expect(car.results[INDEX_OVERALL]._seconds).toEqual(second4);
  }));

  it("should estimates correctly virtual results", inject([RaceService], (service: RaceService) => {
    expect(virtual2.results[INDEX_LAP3]).toBeUndefined();
    service.estimateVirtualTime(virtuals, car);
    expect(virtual1.results[INDEX_LAP3]).toEqual(results1);
    expect(virtual2.results[INDEX_LAP3]).toBeDefined();
  }));

  it("should get rank correctly", inject([RaceService], (service: RaceService) => {
    expect(service.getRank(virtual1, allCars)).toEqual(1);
    expect(service.getRank(car, allCars)).toEqual(2);
    expect(service.getRank(virtual2, allCars)).toEqual();
  }));

  it("virtual results should not be before main player", inject([RaceService], (service: RaceService) => {
    const isAfter: boolean = service.getRank(virtual2, allCars) > service.getRank(car, allCars) ? true : false;
    expect(isAfter).toBeTruthy();
  }));

  it("should create record correctly", inject([RaceService], (service: RaceService) => {
    const record: Record = service.createRecord(car);
    expect(record.minutes).toEqual(car.results[INDEX_OVERALL]._minutes);
    expect(record.seconds).toEqual(car.results[INDEX_OVERALL]._seconds);
    expect(record.hundredths).toEqual(car.results[INDEX_OVERALL]._hundredth);
    expect(record.playerName).toEqual(car._name);
  }));

  it("should detect if car got a record", inject([RaceService], (service: RaceService) => {
    expect(service.isARecord(car, comparedRecord)).toBeTruthy();
  }));

});
