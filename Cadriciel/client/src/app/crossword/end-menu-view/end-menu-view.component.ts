import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { GameMode } from "../interface/configuration";
import { SocketEvents } from "../../socketIO/socketEvents";
import { SOCKETS_CALLS } from "../../socketIO/socket-io.service";

const PLAY_AGAIN: boolean = true;
const WIN_MESSAGE: string = "You won!";
const LOST_MESSAGE: string = "You lost...";
const IS_WAITING: boolean = true;

@Component({
  selector: "app-end-menu-view",
  templateUrl: "./end-menu-view.component.html",
  styleUrls: ["./end-menu-view.component.css"]
})
export class EndMenuViewComponent implements OnInit {

  @Output() public playAgainEmitter: EventEmitter<boolean>;
  @Input() public gameMode: GameMode;
  @Input() public wonGame: Boolean;

  private _isWaiting: boolean;
  private _socketEvents: SocketEvents;
  private _message: string;

  public constructor() {
    this.playAgainEmitter = new EventEmitter<boolean>();
    this._isWaiting = !IS_WAITING;
    this._message = WIN_MESSAGE;
  }

  public ngOnInit(): void {
    this.updateMessage();
    if (this._socketEvents !== undefined ) {
      this.listentForPlayAgain();
    }
  }

  private listentForPlayAgain(): void {
    this._socketEvents.on(SOCKETS_CALLS.playAgain, () => {
      if (this.isWaiting) {
        this._isWaiting = !IS_WAITING;
        this.emitPlayAgain();
        this._socketEvents.emit(SOCKETS_CALLS.playAgain, undefined);
      }
    });
  }

  private updateMessage(): void {
    (this.wonGame) ? this._message = WIN_MESSAGE : this._message = LOST_MESSAGE;
  }

  public get isWaiting(): boolean {
    return this._isWaiting;
  }

  @Input() public set socketEvent(value: SocketEvents) {
    if (value !== undefined) {
      this._socketEvents = value;
    }
  }

  public menuClick(): void {
    window.location.reload();
  }

  public playAgainClick(): void {
    if (this.gameMode === GameMode.single) {
      this.emitPlayAgain();
    } else {
      this._isWaiting = IS_WAITING;
      this._socketEvents.emit(SOCKETS_CALLS.playAgain, undefined );
    }
  }

  private emitPlayAgain(): void {
    this.playAgainEmitter.emit(PLAY_AGAIN);
  }
}
