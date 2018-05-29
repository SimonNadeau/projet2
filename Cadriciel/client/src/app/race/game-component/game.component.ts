import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input, Output, EventEmitter } from "@angular/core";
import { RenderService } from "../../render-service/render.service";
import { Car } from "../car/car";
import { TrackInfo } from "../class/trackInfo";

export { Record } from "../../../../../common/communication/record";

const NBR_LAPS: number = 3;
const TIMER: number = 3000;
@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit {

    public currentTrack: TrackInfo;
    @Input() public id: string;
    @Output() public replayEmitter: EventEmitter<TrackInfo> = new EventEmitter<TrackInfo>();

    @Input() public set track(value: TrackInfo) {
        this.renderService
            .initialize(this.containerRef.nativeElement, true, value.nodeArray )
            .then(/* do nothing */ )
            .catch((err) => console.error(err));
        this.currentTrack = value;
    }

    private _nbrLaps: number;
    private _firstRenderInstance: boolean = false;
    public _isShoingGo: boolean = true;
    private _isTimerStarted: boolean = true;

    @ViewChild("container")
    private containerRef: ElementRef;

    public constructor(private renderService: RenderService) {
        if (!this._firstRenderInstance) {
            this._nbrLaps = NBR_LAPS;
        }
    }

    public get nbrLaps(): number {
        return this._nbrLaps;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        this.renderService.keyHandler.handleKeyDown(event);
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        this.renderService.keyHandler.handleKeyUp(event);
    }

    private showGo(): void {
        if ((this.renderService.raceState.stateNumber === 2) && (this._isTimerStarted)) {
            this._isTimerStarted = false;
            setTimeout(() => {
                this._isShoingGo = false;
                    }, TIMER);
        }
    }

    public isShoingGo(): boolean {
        this.showGo();

        return this._isShoingGo;
    }

    public ngAfterViewInit(): void {
    }

    public get car(): Car {
        return this.renderService.car;
    }

    public replay(): void {
        window.location.reload();
    }

    public menu(): void {
        window.location.reload();
    }
}
