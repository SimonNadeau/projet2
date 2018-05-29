import { Word } from "../../../../../common/communication/word";
import { GridInfo } from "../../../../../common/communication/gridInfo";

const MOCK_GRID: string[][] =
[[ "H", "E", "L", "L", "O", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#" ],
 [ "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]];

const MOCK_WORD: Word  = {
    vertical: false,
    positionI: 0,
    positionJ: 0,
    content: "hello",
    size: 5,
    definition: "hello",
    isFound: false
};

const MOCK_WORDS: Word[] = [MOCK_WORD];

export const MOCK_GRID_INFO: GridInfo = {grid: MOCK_GRID, table: MOCK_WORDS};
