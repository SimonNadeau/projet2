import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";

import { TracksComponent } from "./tracks.component";
import { TrackInfo } from "../class/trackInfo";
// import { DebugElement } from "@angular/core";
// import { By } from "@angular/platform-browser";
import { RequestServerService } from "../../services/request-server.service";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {HttpModule} from "@angular/http";

const MOCK_TRACK: TrackInfo = {
  name: "mockTrackName",
  type: "Easy",
  description: "MockDescription",
  timePlayed: 10,
  bestTime: [],
  nodeArray: [[]]
};
const ROUTE_TRACK_LIST: string = "db/tracks/list";

describe("TracksComponent", () => {
  let component: TracksComponent;
  let fixture: ComponentFixture<TracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksComponent ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        RequestServerService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    })
    .compileComponents()
    .then(/* Do nothing */)
    .catch((err) => console.error(err));
    component = new TracksComponent();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Should load the track list from the server", inject([RequestServerService], async(service: RequestServerService) => {
     service.get<TrackInfo[]>(ROUTE_TRACK_LIST).subscribe(
      (data) => {
        component.tracks = data;
        expect(component.tracks).not.toEqual(undefined);
      });
  }));

  it("Should emit selected track correctly", async() => {
    spyOn(component.seletedTrackEmitter, "emit");

    component.tracks = [MOCK_TRACK];

    component["selectedTrack"] = MOCK_TRACK;
    component.emitSelectedTrack(MOCK_TRACK);

    expect(component.seletedTrackEmitter.emit).toHaveBeenCalledWith(MOCK_TRACK);
  });

});
