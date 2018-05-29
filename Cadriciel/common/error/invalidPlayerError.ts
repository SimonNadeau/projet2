const DEFAULT_MESSAGE: string = "Player not found";
const NAME: string = "InvalidPlayerError";

export class InvalidPlayerError extends Error {

    public constructor(message: string = DEFAULT_MESSAGE) {
      super(message);
      this.name = NAME;
    }
  }
