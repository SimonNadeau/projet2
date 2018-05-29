import { Component, OnInit } from "@angular/core";
import { RenderService } from "../../render-service/render.service";
import { RaceService } from "../../services/race.service";

@Component({
    moduleId: module.id,
    selector: "app-track-results",
    templateUrl: "./track-results.component.html",
    styleUrls: ["./track-results.component.css"]
})
export class TrackResultsComponent implements OnInit {

    private _raceService: RaceService;

    public constructor(private _render: RenderService) {
        this._raceService = new RaceService();
    }

    public ngOnInit(): void {
        if (this._render.car === undefined || this._render.virtualCars === undefined ) {
            return;
        }
        this._raceService.calculateOverall(this._render.car);
        this._raceService.estimateVirtualTime(this._render.virtualCars.virtualPlayers, this._render.car);
    }
}
