const DEFAULT_MESSAGE: string = "A variable is undefined";
const NAME: string = "UndefinedError";

export class UndefinedError extends Error {

    public constructor(message: string = DEFAULT_MESSAGE) {
      super(message);
      this.name = NAME;
    }
  }
