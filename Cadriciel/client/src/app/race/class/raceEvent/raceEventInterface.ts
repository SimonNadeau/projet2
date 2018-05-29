export const NBR_LAPS: number = 3;
export const LAP: string = "Lap ";
export const OVERALL: string = "Overall";

export interface RaceEventInterface {

    update(): void;

    time(): string[];

    setTimer(): void;

    isStateFinnished(): boolean;
}
