import {injectable} from "inversify";
import {GridGenerator} from "../crossword/gridGenerator";
import {GridInfo} from "../../../common/communication/gridInfo";
import { Word } from "../../../common/communication/word";

@injectable()
export class GridService {

    public async generateGrid(diff: number): Promise<GridInfo> {
        if ( !this.isPossibleSetting(diff) ) {
            return {grid: [[]], table: [] };
        }
        const GRID_OBJ: GridGenerator = new GridGenerator(diff);
        let words: Word[];
        do {
            await GRID_OBJ.generate();
            words = await GRID_OBJ.getWords();
        } while (words === null);

        return {
            grid: GRID_OBJ.getCharacterGrid(),
            table: words
        };
    }

    private isPossibleSetting(diff: number): boolean {
        return (diff === 1 || diff === 2 || diff === 0) || (diff.toString() === "1" || diff.toString() === "2" || diff.toString() === "0");
    }
}
