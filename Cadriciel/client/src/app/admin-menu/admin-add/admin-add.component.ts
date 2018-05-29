import { Component, Output, Input, EventEmitter } from "@angular/core";
import { RequestServerService } from "../../services/request-server.service";
import { TrackInfo } from "../../race/class/trackInfo";

const ROUTE_TRACK_LIST: string = "db/tracks/add";

@Component({
    selector: "app-admin-add",
    templateUrl: "./admin-add.component.html",
    styleUrls: ["./admin-add.component.css"]
})

export class AdminAddComponent {

    @Input() public savedNodes: Array<Array<number>>;
    @Input() public newTrack: TrackInfo;

    @Output() public notifyExit: EventEmitter<boolean>;
    @Output() public notifyEditor: EventEmitter<void>;

    public trackName: string;
    public trackDescription: string;

    public constructor(private requestServer: RequestServerService) {
        this.notifyExit = new EventEmitter<boolean>();
        this.notifyEditor = new EventEmitter<void>();
    }

    private clearInformation(): void {
        this.trackName = undefined;
        this.trackDescription = undefined;
    }

    public cancelClick(): void {
        this.notifyExit.emit(true);
        this.clearInformation();
    }

    public editTrackClick(): void {
        this.notifyEditor.emit();
    }

    private setTrackInfo(): void {
        this.newTrack.name = this.trackName;
        this.newTrack.description = this.trackDescription;
        this.newTrack.nodeArray = this.savedNodes;
    }

    private addToServer(): void {
        this.requestServer.add<TrackInfo>(ROUTE_TRACK_LIST, this.newTrack).subscribe(
            (data) => {
                this.clearInformation();
                this.notifyExit.emit(true);
            }
        );
    }

    public addEvent(): void {
        if (this.newTrack.nodeArray !== undefined) {
            this.setTrackInfo();
            this.addToServer();
        } else {
            alert("This track is not ready to save!");
        }
    }

}
