export const TWO_DIGIT: number = 10;
export const HUNDRED: number = 100;
export const TIME_SYSTEM: number = 60;

export interface TimeInterface {

    update(): void;

    getTime(): number[];
}
