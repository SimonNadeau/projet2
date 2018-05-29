import { DifficultyInfo, WordTypeDifficulty, DefinitionDifficulty, DifficultyType } from "./difficulty";
import { Word } from "../../../common/communication/word";
import { HEIGHT, WIDTH, Grid } from "./grid";
import { Position } from "./position";
import { BLACK_TILE, Tile } from "./tile";
import { SpaceHandler } from "./spaceHandler";
import * as request from "request-promise-native";
import { getRandomValue } from "./random";
import { Space, MINIMUM_SIZE, MAXIMUM_SIZE } from "./space";
import { CrossingSpaceHandler } from "./crossingSpaceHandler";
import { Direction } from "./direction";

const URL: string = "http://localhost:3000";
const WORD_REQUEST: string = "/getWords/";
const DEF_REQUEST: string = "/getDef/";
const PARAM_SEPARATOR: string = "/";
const ANY_CHARACTER: string = "*";
const RANDOM_CHARACTER: string = "@";
const BODY_TAG: string = "body";
const MINIMUM_SPACE: number = 12;
const MINIMUM_ITERATION: number = 100;

export class GridGenerator {

    private _difficultyInfo: DifficultyInfo;
    private _spaceHandler: SpaceHandler;
    private _crossingSpaceHandler: CrossingSpaceHandler;
    private _grid: Grid;

    public constructor(diff: number) {
        this._difficultyInfo = {
            wordType: (diff as DifficultyType !== DifficultyType.Hard)
            ? WordTypeDifficulty.Common : WordTypeDifficulty.NonCommon,

            definitionType: (diff as DifficultyType === DifficultyType.Easy)
            ? DefinitionDifficulty.First : DefinitionDifficulty.Second};

        this._grid = {tiles: this.generateDefaultTiles(), spaces: new Array<Space>()};
        this._spaceHandler = new SpaceHandler(this._grid);
        this._crossingSpaceHandler = new CrossingSpaceHandler(this._grid);
    }

    private async assignWordToSpace(space: Space): Promise<void> {
        let words: string[] = (await this.getWordsByConstraints(space.tiles.length,
                                                                this.getConstrainedWord(space.tiles))
                                ).body as string[];
        words = this.filterDoubleWords(words);
        if (words.length !== 0) {
            this._spaceHandler.generateSpaceFromWord(
                space.position,
                space.direction,
                words[getRandomValue(words.length)]
            );
        }
    }

    private generateDefaultTiles(): Tile[][] {
        const tiles: Tile[][] = new Array<Array<Tile>>();
        for (let i: number = 0; i < HEIGHT; i++) {
            tiles.push( new Array<Tile>());
            for (let j: number = 0; j < WIDTH; j++) {
                tiles[i][j] = {
                    character: BLACK_TILE,
                    position: {row: i, col: j},
                    direction: Direction.None
                };
            }
        }

        return tiles;
    }

    private generateEmptySpace(): Space {
        let space: Space;
        let found: boolean = false;
        const blockedPositions: Position[] = new Array<Position>();
        do {
            const position: Position = this._crossingSpaceHandler.chooseRandomPosition(blockedPositions);
            if (position === null) {
                break;
            }
            space = this._crossingSpaceHandler.chooseRandomSpace(position);
            if ( space === null) {
                blockedPositions.push(position);
            } else {
                if (space.tiles.length >= MINIMUM_SIZE) {
                    found = true;
                }
            }
        } while (!found);

        return space;
    }

    private async generateFirstSpace(): Promise<void> {
        return this.getWordsBylength(getRandomValue(MAXIMUM_SIZE - MINIMUM_SIZE) + MINIMUM_SIZE)
            .then((req: request.RequestPromise) => {
                    const words: string[] = req[BODY_TAG];
                    this._spaceHandler.generateSeedSpace(words[getRandomValue(words.length)]);
            });
    }

    private async getDefinition(word: string): Promise<request.RequestPromise> {
        return this.request(DEF_REQUEST + this._difficultyInfo.wordType + PARAM_SEPARATOR + word);
    }

    private getConstrainedWord(tiles: Tile[]): string {
        let constraints: string = "";
        tiles.forEach((tile: Tile) => {
            constraints += (tile.character === BLACK_TILE) ? RANDOM_CHARACTER : tile.character;
        });

        return constraints;
    }

    private async getWordsByConstraints(length: number, constraints: string): Promise<request.RequestPromise> {
        return this.request(WORD_REQUEST + this._difficultyInfo.wordType + PARAM_SEPARATOR
                            + length + PARAM_SEPARATOR + constraints);
    }

    private async getWordsBylength(length: number): Promise<request.RequestPromise> {
            return this.request(WORD_REQUEST + this._difficultyInfo.wordType + PARAM_SEPARATOR +
                                length + PARAM_SEPARATOR + ANY_CHARACTER);
    }

    private getWordFromTiles(tiles: Tile[]): string {
        let content: string = "";
        for (const tile of tiles) {
            content += tile.character;
        }

        return content;
    }

    private filterDoubleWords(words: string[]): string[] {
        this._grid.spaces.forEach(
            (tmpSpace: Space) => {
                words.filter((tmpWord: string) => {
                    return this.getWordFromTiles(tmpSpace.tiles) !== tmpWord;
                });
            }
        );

        return words;
    }

    private async request(route: string): Promise<request.RequestPromise> {
        return request({
            uri: URL + route,
            resolveWithFullResponse: true,
            json: true
        });
    }

    public async generate(): Promise<void> {
        do {
            this._grid.spaces = new Array<Space>();
            this._grid.tiles = this.generateDefaultTiles();
            await this.generateFirstSpace();
            for (let i: number = 0; i < MINIMUM_ITERATION; i++) {
                const space: Space = this.generateEmptySpace();
                if (space === null) {
                    this._spaceHandler.removeLastSpace();
                } else {
                    await this.assignWordToSpace(space);
                }
            }
        } while (this._grid.spaces.length < MINIMUM_SPACE);
    }

    public getCharacterGrid(): string[][] {
        const characterGrid: string[][] = new Array<Array<string>>();
        for (let i: number = 0; i < this._grid.tiles.length; i++) {
            characterGrid.push(new Array<string>());
            for (let j: number = 0; j < this._grid.tiles[i].length; j++) {
                characterGrid[i][j] = this._grid.tiles[i][j].character.toLocaleUpperCase();
            }
        }

        return characterGrid;
    }

    public async getWords(): Promise<Word[]> {
        const words: Word[] = new Array<Word>();
        for (const space of this._grid.spaces) {
            const content: string = this.getWordFromTiles(space.tiles);
            const definition: string = (await this.getDefinition(content)).body;

            if (definition === undefined) {
                return null;
            }
            words.push({
                vertical: space.direction === Direction.Down,
                positionI: space.position.col,
                positionJ: space.position.row,
                content: content.toUpperCase(),
                size: content.length,
                definition: definition,
                isFound: false
            });
        }

        return words;
    }
}
