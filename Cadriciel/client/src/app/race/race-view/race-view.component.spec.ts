import { async, ComponentFixture, TestBed , /* inject */} from "@angular/core/testing";

import { RaceViewComponent } from "./race-view.component";
import { TracksComponent } from "../tracks/tracks.component";
import { GameComponent } from "../game-component/game.component";
import { FormsModule } from "@angular/forms";
import {HttpModule} from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";
import { RequestServerService } from "../../services/request-server.service";
import {  NO_ERRORS_SCHEMA } from "@angular/core";

describe("RaceComponent", () => {
  let component: RaceViewComponent;
  let fixture: ComponentFixture<RaceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RaceViewComponent,
        TracksComponent,
        GameComponent
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        RequestServerService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it("Should load tracks  correctly from the data base", async (done: Function) => {
  //   component.ngOnInit();
  //   const delay: number = 50;
  //   setTimeout(() => {
  //     expect(component.tracks).toBeDefined();
  //     done();
  //           }, delay);
  // });

});
