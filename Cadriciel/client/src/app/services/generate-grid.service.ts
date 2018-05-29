import { Injectable } from "@angular/core";
import { CrosswordService } from "./crossword.service";
import { GridInfo } from "../../../../common/communication/gridInfo";
import { Word } from "../../../../common/communication/word";
import { Clue } from "../crossword/interface/clue";
import { RequestServerService } from "./request-server.service";
import { CluesService } from "./clues.service";
import { GridService } from "./grid.service";

const GET_GRID_URL: string =  "generateGrid/";

@Injectable()
export class GenerateGridService extends CrosswordService {

  public gridGenerated: boolean;

  public constructor( protected requestServer: RequestServerService,
                      protected cluesService: CluesService,
                      protected gridService: GridService) {
    super(requestServer,
          cluesService,
          gridService);

    this.gridGenerated = false;
  }

  private setSpaces(): void {

    for (const word of this.cluesService.words) {
      const start: number = (word.vertical) ? word.positionJ : word.positionI;
      const fixed: number = (word.vertical) ? word.positionI : word.positionJ;
      for (const space of this.getSpacesOf(word)) {
        const variablePosition: number = (word.vertical) ? space.positionJ : space.positionI;
        const fixedPosition: number = (word.vertical) ? space.positionI : space.positionJ;

        if (fixedPosition === fixed) {
          if (variablePosition === start) {
            space.isFirst = true;
          }
          if (variablePosition === (start + word.size - 1) ) {
            space.isLast = true;
          }
        }
      }
    }
  }

  public generateGrid(difficulty: number): void {
    this.requestServer.getWithParam<GridInfo, number>(GET_GRID_URL, difficulty ).subscribe(
      (async (data) => {
        this.setCrossword(data);
        this.gridGenerated = true;
      }
    ));
  }

  public updateGridIndexes(): void {
    this.gridService.initIndexes();
  }

  public setCrossword(info: GridInfo): void {
    this.gridService.grid = info.grid;
    this.cluesService.words = info.table;
    this.setSpaces();
    this.updateGridIndexes();
    this.setClues();
  }

  public setClues(): void {
    this.cluesService.clues = new Array<Clue>();
    for (const array of this.gridService.content) {
      for (const space of array) {
        const horizontalWord: Word = this.getHorizontalWordOf(space);
        if (horizontalWord !== undefined) {
          this.cluesService.setOneClue(horizontalWord, space);
        }

        const verticalWord: Word = this.getVerticalWordOf(space);
        if (verticalWord !== undefined) {
          this.cluesService.setOneClue(verticalWord, space);
        }
      }
    }
  }
}
