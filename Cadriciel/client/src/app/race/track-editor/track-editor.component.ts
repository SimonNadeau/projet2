import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Output, EventEmitter, Input } from "@angular/core";
import { TrackEditorRenderService } from "../track-editor-render/track-editor-render.service";

@Component({
    moduleId: module.id,
    selector: "app-track-editor",
    templateUrl: "./track-editor.component.html",
    styleUrls: ["./track-editor.component.css"]
})
export class TrackEditorComponent implements AfterViewInit {

    private firstRenderInstance: boolean = false;
    private renderService: TrackEditorRenderService;
    private isLeftClick: boolean = false;
    private _okToSave: boolean = false;
    private _positionsArray: Array<Array<number>>;

    @Output() public notifySaveTrack: EventEmitter<Array<Array<number>>> = new EventEmitter<Array<Array<number>>>();

    @Input() public set viewStatus(value: boolean) {
        if ( value ) {
            this.loadEditor(this._positionsArray);
        }
    }

    public set positionsArray(data: Array<Array<number>>) {
        this._positionsArray = data;
    }

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor() {
        if (!this.firstRenderInstance) {
            this.renderService = new TrackEditorRenderService();
        }
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("click", ["$event"])
    public mouseClick(event: MouseEvent): void {
        if (this.renderService.clickAction) {
            this.renderService.onClick(event);
            this.renderService.track.checkIfOkTosave();
        } else {
            this.renderService.clickAction = true;
        }
        this.notifySaveTrack.emit(this.renderService.track.save());
    }

    @HostListener("auxclick", ["$event"])
    public rightClick(event: MouseEvent): void {
        this.renderService.undoLastNode(event);
        this._okToSave = this.renderService.track.checkIfOkTosave();
    }

    @HostListener("mousedown", ["$event"])
    public mouseDown(event: MouseEvent): void {
        this.isLeftClick = true;
        this.renderService.saveDragElement();
    }

    @HostListener("mouseup", ["$event"])
    public mouseUp(event: MouseEvent): void {
        this.isLeftClick = false;
        this.renderService.clearDragElement();
        this.renderService.mouseUp(event, this.renderService.clickAction);
        this._okToSave = this.renderService.track.checkIfOkTosave();
    }

    @HostListener("mousemove", ["$event"])
    public dragNode(event: MouseEvent): void {
        if (this.isLeftClick) {
            this.renderService.drag(event);
        } else {
            this.renderService.updateMouse(event);
        }
    }

    public ngAfterViewInit(): void {
        this.initRenderService();
    }

    private initRenderService(): void  {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then()
            .catch((err) => console.error(err));
    }

    public get okToSave(): boolean {
        return this._okToSave;
    }

    public loadEditor(positions: Array<Array<number>>): void {
        this.renderService.onResize();
        if (positions !== undefined && positions.length > 0) {
            this.renderService.loadTrack(positions);
        }
        this._okToSave = this.renderService.track.checkIfOkTosave();
    }

    public clearEditor(): void {
        this.renderService.deleteTrack();
        this.renderService.track.clearSegmentArray();
        this.renderService.track.clearMeshIdArray();
        this.renderService.deleteFirstPoint();
        this.renderService.openTrack();
        this._okToSave = this.renderService.track.checkIfOkTosave();
    }
}
