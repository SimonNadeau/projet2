export interface Space {
    expectedChar: string;
    tempChar: string;
    isSelected: boolean;
    isSelectedByOther: boolean;
    isFilled: boolean;
    foundByStatus: {yourself: boolean, another: boolean };
    positionI: number;
    positionJ: number;
    isFirst: boolean;
    isLast: boolean;
    index: number;
}
