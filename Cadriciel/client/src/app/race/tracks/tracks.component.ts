import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { TrackInfo } from "../class/trackInfo";
import { RenderService } from "../../render-service/render.service";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.css"]
})
export class TracksComponent implements AfterViewInit {

  @Input() public tracks: TrackInfo[];
  @Output() public seletedTrackEmitter: EventEmitter<TrackInfo> = new EventEmitter<TrackInfo>();

  private selectedTrack: TrackInfo;
  private firstRenderInstance: boolean = false;
  private renderService: RenderService;

  @ViewChild("container")
  private containerRef: ElementRef;

  public constructor ( ) {
    if (!this.firstRenderInstance) {
      this.renderService = new RenderService();
    }
  }

  public ngAfterViewInit(): void {
    this.renderService
        .initialize(this.containerRef.nativeElement, false, undefined)
        .then(/* do nothing */)
        .catch((err) => console.error(err));
  }

  public onSelect(track: TrackInfo): void {
    this.selectedTrack = track;
    this.renderService.loadSelectedTrack(this.selectedTrack.nodeArray);
  }

  public emitSelectedTrack(track: TrackInfo): void {
    this.seletedTrackEmitter.emit(track);
  }

  public getTime(index: number): string {
    if (this.selectedTrack.bestTime[index] === undefined) {
      return "00:00:00";
    } else {
      return  this.selectedTrack.bestTime[index].minutes + ":" +
              this.selectedTrack.bestTime[index].seconds + ":" +
              this.selectedTrack.bestTime[index].hundredths;
    }
  }
}
