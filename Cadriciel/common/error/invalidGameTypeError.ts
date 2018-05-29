const DEFAULT_MESSAGE: string = "Not in a multiplayer game";
const NAME: string = "InvalidGameTypeError";

export class InvalidGameTypeError extends Error {

    public constructor(message: string = DEFAULT_MESSAGE) {
      super(message);
      this.name = NAME;
    }
  }
