/* tslint:disable: no-magic-numbers */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormsModule } from "@angular/forms";
import { AdminMenuComponent } from "./admin-menu.component";
import { RenderService } from "../render-service/render.service";
import { TrackEditorComponent } from "../race/track-editor/track-editor.component";
import {HttpModule} from "@angular/http";
import { RequestServerService } from "../services/request-server.service";
import { AdminAddComponent } from "./admin-add/admin-add.component";
import { APP_BASE_HREF } from "@angular/common";
import {AdminUpdateComponent} from "./admin-update/admin-update.component";

import { TrackInfo } from "../race/class/trackInfo";
import { NO_ERRORS_SCHEMA, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";

describe("AdminMenuComponent", () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;
  const MOCK_TRACK: TrackInfo = {
    name: "Mock",
    type: "Mock",
    description: "Mock",
    timePlayed: 0,
    bestTime: [],
    nodeArray: []
 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminMenuComponent,
        TrackEditorComponent,
        AdminAddComponent,
        AdminUpdateComponent
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        RenderService,
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
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should toggle between menu states when the correct buttons are press", async() => {
    component["_tracks"].push(MOCK_TRACK);
    component.onSelect(component["_tracks"][0]);

    let button: DebugElement = fixture.debugElement.query(By.css("#addButton"));
    button.triggerEventHandler("click", {});

    fixture.detectChanges();

    expect(component["_menuState"]).toEqual(1);

    button = fixture.debugElement.query(By.css("#edit-button"));
    button.triggerEventHandler("click", {});

    fixture.detectChanges();

    expect(component["_menuState"]).toEqual(2);

  });

  it("should load tracks from server", async () => {
    component.loadTrack();
    expect(component["_tracks"].length).not.toBe(undefined);
  });

});
