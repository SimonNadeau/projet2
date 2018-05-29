import { async, inject, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackRecordsComponent } from "./track-records.component";
import { TrackInfo } from "../class/trackInfo";
import { RenderService } from "../../render-service/render.service";
import { RequestServerService } from "../../services/request-server.service";
import { Results } from "../class/results";
import { HttpModule } from "@angular/http";
import { RaceService } from "../../services/race.service";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";

const MOCK_TRACK: TrackInfo = {
  name: "mockTrackName",
  type: "Easy",
  description: "MockDescription",
  timePlayed: 0,
  bestTime: [],
  nodeArray: [[]]
};

const zero: string = "00";
const second1: string = "01";
const second2: string = "02";

describe("TrackRecordsComponent", () => {
  const results1: Results = {} as Results;
  const results2: Results = {} as Results;
  results1._minutes = results2._minutes = results1._hundredth = results2._hundredth = zero;
  results1._seconds = second1;
  results2._seconds = second2;

  let component: TrackRecordsComponent;
  let fixture: ComponentFixture<TrackRecordsComponent>;
  let container: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TrackRecordsComponent],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        RaceService,
        RenderService,
        RequestServerService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    })
      .compileComponents()
      .then()
      .catch((err) => console.error(err));

    container = document.createElement("div");
    document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(container);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([RenderService], async (service: RenderService) => {
    component["_currentTrack"] = MOCK_TRACK;
    expect(component).toBeDefined();
  }));

  it("should increment time played on init", inject([RenderService], async (service: RenderService) => {
    component["_currentTrack"] = MOCK_TRACK;
    component.ngOnInit();
    expect(component["_currentTrack"].timePlayed).toEqual(1);
  }));

  it("should set record name correctly to trigger the submit", () => {
    component["_upToDate"] = true;

    const newName: string = "Test";
    component.name = newName;
    expect(component["_name"]).not.toEqual(newName);

    component["_upToDate"] = false;

    component.name = newName;
    expect(component["_name"]).toEqual(newName);
  });
});
