import { Record } from "../../../../../common/communication/record";

export interface TrackInfo {
    name: string;
    type: string;
    description: string;
    timePlayed: number;
    bestTime: Array<Record>;
    nodeArray: Array<Array<number>>;
}
