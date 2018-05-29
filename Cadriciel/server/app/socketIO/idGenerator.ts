const POSSIBLE: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH: number = 10;
export class IDGenerator {
    public makeID(): string {
        let text: string = "";

        for (let i: number = 0; i < ID_LENGTH; i++) {
            text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
        }

        return text;
    }
}
