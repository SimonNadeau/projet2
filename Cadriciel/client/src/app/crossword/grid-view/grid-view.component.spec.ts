/* tslint:disable: no-magic-numbers */

import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { GridViewComponent } from "./grid-view.component";
import { CrosswordService } from "../../services/crossword.service";
import { RequestServerService } from "../../services/request-server.service";
import {HttpModule} from "@angular/http";
import { FormsModule } from "@angular/forms";
import { APP_BASE_HREF } from "@angular/common";
import { SelectWordsAndCluesService } from "../../services/select-words-and-clues.service";
import { FocusService } from "../../services/focus.service";
import { CluesService } from "../../services/clues.service";
import { FocusDirective } from "../../focus.directive";
import { GridService } from "../../services/grid.service";
import * as MOCK from "../mock/mock";
import { GenerateGridService } from "../../services/generate-grid.service";
import { Grid } from "./grid";
import { FindWordService } from "../../services/find-word.service";

describe("GridViewComponent", () => {
  let component: GridViewComponent;
  let fixture: ComponentFixture<GridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GridViewComponent,
        FocusDirective
      ],
      imports: [
        HttpModule,
        FormsModule
      ],
      providers: [
        RequestServerService,
        CrosswordService,
        SelectWordsAndCluesService,
        FocusService,
        CluesService,
        GridService,
        GenerateGridService,
        FindWordService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", inject([GenerateGridService], (service: GenerateGridService) => {
    service.setCrossword(MOCK.MOCK_GRID_INFO);
    const grid: Grid = new Grid([[undefined]]);
    expect(component["gridService"]["_grid"]).not.toEqual(grid);
    expect(component).toBeTruthy();
  }));

  it("should only accepte space", inject([GenerateGridService], async(service: GenerateGridService) => {
    service.setCrossword(MOCK.MOCK_GRID_INFO);

    expect(component.verifySpecialCharacter(61)).toEqual(true);
    expect(component.verifySpecialCharacter(65)).toEqual(false);

    expect(component).toBeTruthy();
  }));

  it("should confirm if a word is found", inject([GenerateGridService], async(service: GenerateGridService) => {
    service.setCrossword(MOCK.MOCK_GRID_INFO);
    component["gridService"].content[0][0].tempChar = "H".toUpperCase();
    component["gridService"].content[0][1].tempChar = "E".toUpperCase();
    component["gridService"].content[0][2].tempChar = "L".toUpperCase();
    component["gridService"].content[0][3].tempChar = "L".toUpperCase();
    component["gridService"].content[0][4].tempChar = "O".toUpperCase();

    component["findWordService"].verifyWordOf(component["gridService"].content[0][0]);
    component["findWordService"].verifyWordOf(component["gridService"].content[0][1]);
    component["findWordService"].verifyWordOf(component["gridService"].content[0][2]);
    component["findWordService"].verifyWordOf(component["gridService"].content[0][3]);
    component["findWordService"].verifyWordOf(component["gridService"].content[0][4]);

    expect(component["gridService"].content[0][0].isFilled).toEqual(true);
    expect(component["crosswordService"]["cluesService"].clues[0].isFound.byYourself).toEqual(true);
  }));

});
