import { Component, Input, Output, EventEmitter } from "@angular/core";
import { TrackInfo } from "../../race/class/trackInfo";
import { RequestServerService } from "../../services/request-server.service";

const UPDTATE_URL: string = "db/tracks/update/";
const ADD_URL: string = "db/tracks/add";

@Component({
  selector: "app-admin-update",
  templateUrl: "./admin-update.component.html",
  styleUrls: ["./admin-update.component.css"]
})

export class AdminUpdateComponent {

  @Input() public theTrack: TrackInfo;
  @Input() public trackName: string;
  @Input() public trackDescription: string;
  @Input() public savedNodes: Array<Array<number>>;

  @Output() public notify: EventEmitter<boolean>;
  @Output() public notifyEditor: EventEmitter<void>;
  private _saving: boolean;

  public constructor(private requestServer: RequestServerService) {

    this.notify = new EventEmitter<boolean>();
    this.notifyEditor = new EventEmitter<void>();

    this._saving = false;
  }

  public cancelClick(): void {
     this.notify.emit(true);
  }

  public editTrackClick(): void {
    this.notifyEditor.emit();
  }

  public toggleSaveEvent(): void {
    this._saving = !this._saving;
  }

  public saveOver(id: string): void {
    if (this.savedNodes !== undefined) {
      this.theTrack.nodeArray = this.savedNodes;
    }
    this.theTrack.name = this.trackName;
    this.theTrack.description = this.trackDescription;
    this.requestServer.update<TrackInfo>(UPDTATE_URL, id, this.theTrack).subscribe((data) => {
      this.notify.emit(true);
    });
  }

  public saveAsNew(): void {
    if (this.savedNodes !== undefined) {
      this.theTrack.nodeArray = this.savedNodes;
    }
    this.theTrack.name = this.trackName;
    this.theTrack.description = this.trackDescription;
    this.requestServer.add<TrackInfo>(ADD_URL, this.theTrack).subscribe(
      (data) => {
        this.notify.emit(true);
      }
    );
  }
}
