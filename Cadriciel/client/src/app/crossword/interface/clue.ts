
import { Word } from "../../../../../common/communication/word";

export interface Clue {
    index: number;
    definition: string;
    isSelected: boolean;
    isFound: {byYourself: boolean, byAnother: boolean};
    word: Word;
}
