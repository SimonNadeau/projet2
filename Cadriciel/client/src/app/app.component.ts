import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

const MAIN_ROUT: string = "/";
@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {

    private _isInMainMenu: boolean;

    public constructor( private router: Router) {
        this._isInMainMenu = false;
     }

    public readonly title: string = "LOG2990";

    public ngOnInit(): void {
        (window.location.href === MAIN_ROUT) ?
            this._isInMainMenu = true : this._isInMainMenu = false;
    }

    public navigateTo(route: string): void {
        if ( route !== this.router.url ) {
            this.router.navigateByUrl(route);
            this._isInMainMenu = false;
        } else {
            window.location.reload();
        }
    }

    public homeClick(): void {
        this._isInMainMenu = true;
    }
}
