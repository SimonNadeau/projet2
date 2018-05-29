import { Injectable } from "@angular/core";
import * as socketIo from "socket.io-client";
import { SOCKETS_CALLS } from "../../../../common/communication/socketCalls";

const URL: string = "http://localhost:3000";

export {
  SOCKETS_CALLS
};

@Injectable()
export class SocketIoService {

  private _socket: SocketIOClient.Socket;

  public constructor() {
  }

  protected get socket(): SocketIOClient.Socket {
    return this._socket;
  }

  protected connect(): void {
    this._socket = socketIo(URL);
  }

  public disconnect(): void {
    this._socket.disconnect();
  }

  public on<T>(event: string, fn: Function): void {
    this._socket.on(event, (data: T) => {
       fn(data);
    });
  }

  public emit<T>(event: string, data: T): void {
    this._socket.emit(event, data);
  }
}
