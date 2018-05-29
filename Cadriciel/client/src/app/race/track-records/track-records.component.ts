import { Component, Input, OnInit } from "@angular/core";
import { RenderService } from "../../render-service/render.service";
import { TrackInfo } from "../class/trackInfo";
import { Car } from "../car/car";
import { RequestServerService } from "../../services/request-server.service";
import { RaceService } from "../../services/race.service";
import { Record } from "../../../../../common/communication/record";

export const NBR_RECORD: number = 3;

const ENTER_KEYCODE: number = 13;
const URL_UPDATE_TIMES: string = "db/records/";
const URL_UPDATE_PLAYED: string = "db/records/timePlayed/";
const DEFAULT_TRACK: TrackInfo = {
  name: "defaultName",
  type: "Easy",
  description: "defaultDescription",
  timePlayed: 0,
  bestTime: [],
  nodeArray: [[]]
};

const COLON: string = ":";
@Component({
  moduleId: module.id,
  selector: "app-track-records",
  templateUrl: "./track-records.component.html",
  styleUrls: ["./track-records.component.css"]
})
export class TrackRecordsComponent implements OnInit {

  public _upToDate: boolean;
  private _currentTrack: TrackInfo;
  private _raceService: RaceService;
  private _name: string;
  @Input() public id: string;

  @Input() public set track(value: TrackInfo) {
    this._currentTrack = value;
  }

  public constructor(private _render: RenderService, private _requestServer: RequestServerService) {
    this._raceService = new RaceService();
    this._currentTrack = DEFAULT_TRACK;
    this._name = "";
  }

  public ngOnInit(): void {
    this.updateTimePlayed();
    if (this._currentTrack === undefined || this._render.car === undefined) {
      return;
    }
    this.fillIfEmpty();
    this._upToDate = !this.gotRecord(this._render.car);
  }

  public set name(newName: string) {
    if (newName !== "" && newName !== undefined && !this._upToDate) {
      this._name = newName;
    }
  }

  public submitName(event: KeyboardEvent): void {
    if (event.keyCode === ENTER_KEYCODE) {
      if (this._name !== "") {
        const rank: number = this.getRankRecord(this._render.car);
        this.pushOtherResults(rank);
        this._currentTrack.bestTime[rank] = this._raceService.createRecord(this._render.car);
        this._currentTrack.bestTime[rank].playerName = this._name;
        this._upToDate = true;
        this.updateResult();
      }
    }
  }

  public getRecordTime(car: Car): string {
    const record: Record = this._raceService.createRecord(car);

    return record.minutes + COLON + record.seconds + COLON + record.hundredths;
  }

  private fillIfEmpty(): void {
    if (this._currentTrack.bestTime[0] === undefined) {
      if (this._currentTrack.bestTime.length < NBR_RECORD) {
        this.fillTimes();
        this.updateResult();
      }
    }
  }

  private fillTimes(): void {
    if (this._render.getAllCars() === undefined) {
      return;
    }
    for (let i: number = 1; i <= NBR_RECORD + 1; i++) {
      for (const car of this._render.getAllCars()) {
        if (this._raceService.getRank(car, this._render.getAllCars()) === i) {
          if (car !== this._render.car) {
            this._currentTrack.bestTime.push(this._raceService.createRecord(car));
          } else {
            i++;
          }
        }
      }
    }
  }

  private pushOtherResults(index: number): void {
    let indexDB: number = this._currentTrack.bestTime.length - 1;
    while (index !== indexDB) {
      this._currentTrack.bestTime[indexDB] = this._currentTrack.bestTime[--indexDB];
    }
  }

  private gotRecord(car: Car): boolean {
    if (this._raceService.getRank(this._render.car, this._render.getAllCars()) === 1) {
      return (this.getRankRecord(car) < NBR_RECORD);
    }

    return false;
  }

  private getRankRecord(car: Car): number {
    let index: number = 0;
    for (const record of this._currentTrack.bestTime) {
      if (!this._raceService.isARecord(car, record)) {
        index++;
      }
    }

    return index;
  }

  private updateResult(): void {
    if (this.id === undefined) {
      return;
    }
    this._requestServer.update<TrackInfo>(URL_UPDATE_TIMES, this.id, this._currentTrack).subscribe(
      (data) => { }
    );
  }

  private updateTimePlayed(): void {

    this._currentTrack.timePlayed++;

    if (this.id !== undefined) {
      this._requestServer.updateTimePlayed<TrackInfo>(URL_UPDATE_PLAYED, this.id, this._currentTrack).subscribe(
        (data) => { }
      );
    }
  }
}
