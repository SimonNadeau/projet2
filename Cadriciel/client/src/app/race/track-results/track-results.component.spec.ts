import { async, inject, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackResultsComponent } from "./track-results.component";
import { RenderService } from "../../render-service/render.service";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RaceService } from "../../services/race.service";
import { RequestServerService } from "../../services/request-server.service";
import { APP_BASE_HREF } from "@angular/common";

describe("TrackResultsComponent", () => {
  let component: TrackResultsComponent;
  let fixture: ComponentFixture<TrackResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackResultsComponent ],
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
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", inject([RenderService], (service: RenderService) => {
    expect(component).toBeTruthy();
  }));

});
