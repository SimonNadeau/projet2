import * as request from "request-promise-native";
import * as fs from "fs";
import { injectable } from "inversify";

const STORAGEPATH: string = "./app/lexicalService/wordStorage.json";

const APIPATH: string = "http://api.datamuse.com/words?";

const enum ROUTE_TAGS {SPELLED_LIKE = "sp", METADATA = "md", EQUALITY = "=",
                      DEFINITION = "d", ADDING_CONSTRAINTS = "&", MAXIMUM = "max"}
const enum RESPONSE_TAGS {BODY = "body", DEFS = "defs"}
const enum REGEXP_TAGS {EXOTIC_CHARS = "[_'-]", BEGINNING = "^", RANDOM_CHARACTER = ".", MANY_CHARACTER = ".*"}

const MANY_CHARACTER: string = "*";
const RANDOM_CHARACTER: string = "@";

const MINIMUM_LENGTH: number = 2;
const MINIMUM_VALUES: number = 1;
const DEFINITION_PARSING_IGNORED_VALUES: number = 2;
enum WordTypeDifficulty { Common, NonCommon }
enum DefinitionDifficulty { First, Second }

@injectable()
export class LexicalService {
    private async apiResponse(route: string): Promise<request.RequestPromise> {
        return request({
            uri: APIPATH + route,
            resolveWithFullResponse: true,
            json: true
        });
    }

    private filterExoticChars(words: string[]): string[] {
            return words.filter((word: string) => {
                return !(new RegExp(REGEXP_TAGS.EXOTIC_CHARS).test(word));
            });
    }

    private filterByPattern(words: string[], pattern: string): string[] {
            return words.filter((word: string) => {
                return new RegExp(REGEXP_TAGS.BEGINNING +
                    pattern.split(MANY_CHARACTER).join(REGEXP_TAGS.MANY_CHARACTER)
                            .split(RANDOM_CHARACTER).join(REGEXP_TAGS.RANDOM_CHARACTER))
                            .test(word);
            });
    }

    private filterBadDefintions(definitions: string[], word: string): string[] {
        const parsedDefs: string[] = [];
        for (const def of definitions) {
            if (!def.substr(DEFINITION_PARSING_IGNORED_VALUES, def.length).includes(word)) {
                parsedDefs.push(def.substr(DEFINITION_PARSING_IGNORED_VALUES, def.length));
            }
        }

        return parsedDefs;
    }

    private filterType(informations: string[]): string[] {
        const definitions: string[] = [];
        informations.forEach((information: string) => {
            const fragmentedInfo: string[] = information.split("\t");
            definitions.push(fragmentedInfo[fragmentedInfo.length - 1]);

        });

        return definitions;
    }

    public async getDefinition(defDifficulty: DefinitionDifficulty, word: string): Promise<string> {
        const route: string = ROUTE_TAGS.SPELLED_LIKE + ROUTE_TAGS.EQUALITY + word
            + ROUTE_TAGS.ADDING_CONSTRAINTS + ROUTE_TAGS.MAXIMUM + ROUTE_TAGS.EQUALITY + MINIMUM_VALUES
            + ROUTE_TAGS.ADDING_CONSTRAINTS + ROUTE_TAGS.METADATA + ROUTE_TAGS.EQUALITY + ROUTE_TAGS.DEFINITION;

        const response: request.RequestPromise = await this.apiResponse(route);

        if (response.body[0] === null || response.body[0][RESPONSE_TAGS.DEFS] === undefined) {
            return null;
        }

        let definitions: string[] = this.filterBadDefintions(response.body[0][RESPONSE_TAGS.DEFS], word);
        definitions = this.filterType(definitions);

        return (definitions.length <= 1 || defDifficulty.toString() === DefinitionDifficulty.First.toString())
            ? definitions[DefinitionDifficulty.First] : definitions[DefinitionDifficulty.Second];
    }

    public getWords(wordType: WordTypeDifficulty, length: number, pattern: string): string[] {
        let selectedWords: string[] = JSON.parse(fs.readFileSync(STORAGEPATH).toString())[wordType][length - MINIMUM_LENGTH];
        if (selectedWords === undefined) {
            return null;
        }
        selectedWords = this.filterByPattern(this.filterExoticChars(selectedWords), pattern);

        return selectedWords;
    }
}
