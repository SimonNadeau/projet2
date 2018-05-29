/* tslint:disable: no-magic-numbers */

import { TestBed, inject } from "@angular/core/testing";

import { GenerateGridService } from "./generate-grid.service";
import { CrosswordService } from "./crossword.service";
import { RequestServerService } from "../services/request-server.service";
import { APP_BASE_HREF } from "@angular/common";
import {HttpModule} from "@angular/http";
import { FormsModule } from "@angular/forms";
import { SelectWordsAndCluesService } from "./select-words-and-clues.service";
import { CluesService } from "./clues.service";
import { GridService } from "./grid.service";

describe("CrosswordService", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        CrosswordService,
        RequestServerService,
        SelectWordsAndCluesService,
        GridService,
        CluesService,
        GenerateGridService,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    });
  });

  it("should be created", inject([GenerateGridService], (service: GenerateGridService) => {
    expect(service).toBeTruthy();
  }));
});
