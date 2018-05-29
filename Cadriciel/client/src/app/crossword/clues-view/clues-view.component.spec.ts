/* tslint:disable: no-magic-numbers */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";
import { CrosswordService } from "../../services/crossword.service";
import { CluesViewComponent } from "./clues-view.component";
import { RequestServerService } from "../../services/request-server.service";
import {HttpModule} from "@angular/http";
import { FormsModule } from "@angular/forms";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { GridService } from "../../services/grid.service";
import { CluesService } from "../../services/clues.service";
import { FocusService } from "../../services/focus.service";

describe("CluesComponent", () => {
  let component: CluesViewComponent;
  let fixture: ComponentFixture<CluesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CluesViewComponent
      ],
      imports: [
        HttpModule,
        FormsModule
      ],
      providers: [
        CrosswordService,
        RequestServerService,
        SelectWordsAndCluesService,
        GridService,
        CluesService,
        FocusService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CluesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});
