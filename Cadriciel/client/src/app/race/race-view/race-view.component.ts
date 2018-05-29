import { Component, OnInit } from "@angular/core";
import { TrackInfo } from "../class/trackInfo";
import { RequestServerService } from "../../services/request-server.service";

const ROUTE_TRACK_LIST: string = "db/tracks/list";

@Component({
  selector: "app-race",
  templateUrl: "./race-view.component.html",
  styleUrls: ["./race-view.component.css"]
})
export class RaceViewComponent implements OnInit {

  public _gameStarted: boolean;
  public tracks: TrackInfo[];
  public trackChoosed: TrackInfo;

  public constructor(private requestServer: RequestServerService) {
    this._gameStarted = false;
  }

  public ngOnInit(): void {
    this.loadTracks();
  }

  private loadTracks(): void {
    this.requestServer.get<TrackInfo[]>(ROUTE_TRACK_LIST).subscribe(
      (data) => {
        this.tracks = data;
      });
  }

  public startGame( track: TrackInfo): void {
    this.trackChoosed = track;
    this._gameStarted = true;
  }

}
