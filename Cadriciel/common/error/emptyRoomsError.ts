const DEFAULT_MESSAGE: string = "Room is empty";
const NAME: string = "EmptyRoomsError";

export class EmptyRoomsError extends Error {

    public constructor(message: string = DEFAULT_MESSAGE) {
      super(message);
      this.name = NAME;
    }
  }
