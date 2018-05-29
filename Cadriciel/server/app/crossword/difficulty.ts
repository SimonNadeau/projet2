export enum WordTypeDifficulty { Common, NonCommon }
export enum DefinitionDifficulty { First, Second }
export enum DifficultyType { Easy, Medium, Hard }

export interface DifficultyInfo {
    wordType: WordTypeDifficulty;
    definitionType: DefinitionDifficulty;
}
