import { Component, OnInit, ViewChild } from "@angular/core";
import { TrackInfo } from "../race/class/trackInfo";
import { RequestServerService } from "../services/request-server.service";
import { TrackEditorComponent } from "../race/track-editor/track-editor.component";

const ROUTE_TRACK_LIST: string = "db/tracks/list";
const DELETE_URL: string = "db/tracks/delete/";
enum MenuStates {
  main,
  adding,
  updating,
  editing
}

@Component({
  selector: "app-admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ["./admin-menu.component.css"]
})
export class AdminMenuComponent implements OnInit {

  @ViewChild(TrackEditorComponent) public trackEditor: TrackEditorComponent;

  private _tracks: TrackInfo[];
  private _menuState: MenuStates;
  private _lastState: MenuStates;
  private _editTrack: TrackInfo;
  private _savedNodes: Array<Array<number>>;
  public selectedTrack: TrackInfo;

  public constructor(private requestServer: RequestServerService) {
    this._menuState = MenuStates.main;
    this._lastState = MenuStates.main;
    this._tracks = undefined;
    this.clearSaveNode();
    this.clearEditTrack();
    this.loadTrack();
  }

  public ngOnInit(): void {
    this.loadTrack();
  }

  private navigatingThroughMenu(nextState: MenuStates): void {
    this._menuState = nextState;
  }

  public loadTrack(): void {
    this.requestServer.get<TrackInfo[]>(ROUTE_TRACK_LIST).subscribe(
      (data) => {
        this._tracks = data;
    });
  }

  private compareCurrentState(state: MenuStates): boolean {
    return this._menuState === state;
  }

  private clearEditTrack(): void {
    if (!this.compareCurrentState(MenuStates.updating) || !this.compareCurrentState(MenuStates.adding) ) {
      this._editTrack = {
        name: undefined,
        type: undefined,
        description: undefined,
        timePlayed: undefined,
        bestTime: [undefined],
        nodeArray: undefined
      } ;
    }
  }
  private clearSaveNode(): void {
    if (!this.compareCurrentState(MenuStates.updating) || !this.compareCurrentState(MenuStates.adding) ) {
      this.setSavedNodes(undefined);
    }
  }

  private setSavedNodes(nodes: Array<Array<number>>): void {
    this._savedNodes = nodes;
  }

  /* Methodes only used in the HTML */

  public deleteEvent(id: string): void {
    if (confirm("Do you really want to delete this track?")) {
      this.requestServer.delete(DELETE_URL, id).subscribe(
        (data) => {
          this.loadTrack();
        }
      );
    }
  }

  public updateEvent(track: TrackInfo): void {
    this._editTrack = track;
    (this.compareCurrentState(MenuStates.updating)) ?
      this.navigatingThroughMenu(MenuStates.main) : this.navigatingThroughMenu(MenuStates.updating);
    this.clearSaveNode();
    this.loadTrack();
  }

  public addingEvent(): void {
    (this.compareCurrentState(MenuStates.adding)) ?
      this.navigatingThroughMenu(MenuStates.main) : this.navigatingThroughMenu(MenuStates.adding);
    this.clearEditTrack();
    this.clearSaveNode();
    this.loadTrack();
  }

  public editorEvent(): void {
    if (!this.compareCurrentState(MenuStates.editing)) {
      this._lastState = this._menuState;
      this.setSavedNodes(this._editTrack.nodeArray);
      this.trackEditor.positionsArray = this._savedNodes;
      this.navigatingThroughMenu(MenuStates.editing);
    } else if (this.compareCurrentState(MenuStates.editing) && this.trackEditor.okToSave) {
      this._editTrack.nodeArray = this._savedNodes;
      this.navigatingThroughMenu(this._lastState);
      this.trackEditor.clearEditor();
    } else {
      alert("This track is not ready to save!");
    }
  }

  public cancelEditorMode(): void {
    this.navigatingThroughMenu(this._lastState);
    this.setSavedNodes(this._editTrack.nodeArray);
    this.trackEditor.clearEditor();
  }

  public getTrackIndex(track: TrackInfo): number {
    return this._tracks.indexOf(track);
  }

  public onSelect(track: TrackInfo): void {
    this.selectedTrack = track;
  }

}
