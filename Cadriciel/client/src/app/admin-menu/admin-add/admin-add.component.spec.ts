import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import {HttpModule} from "@angular/http";
import { APP_BASE_HREF } from "@angular/common";

import { AdminAddComponent } from "./admin-add.component";
import { RenderService } from "../../render-service/render.service";
import { RequestServerService } from "../../services/request-server.service";

describe("AdminAddComponent", () => {

    let testComponent: AdminAddComponent;
    let testFixture: ComponentFixture<AdminAddComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminAddComponent
            ],
            imports: [
                FormsModule,
                HttpModule
            ],
            providers: [
                RenderService,
                RequestServerService,
                { provide: APP_BASE_HREF, useValue: "/my/app" }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
        .compileComponents()
        .then(/* do nothing */)
        .catch((err) => console.error(err));

        testFixture = TestBed.createComponent(AdminAddComponent);
        testComponent = testFixture.componentInstance;
        testFixture.detectChanges();
    }));

    it("should create", () => {
        expect(testComponent).toBeDefined();
    });

    it("should emit true if cancel button click", () => {
        spyOn(testComponent.notifyExit, "emit");

        const button: DebugElement = testFixture.debugElement.query(By.css("#button-cancel"));
        button.triggerEventHandler("click", {});

        testFixture.detectChanges();

        expect(testComponent.notifyExit.emit).toHaveBeenCalledWith(true);
    });

    it("should clear the value of the trackName and trackDescription", () => {
        testComponent.trackName = "mockName";
        testComponent.trackDescription = "this is a description";
        testComponent.cancelClick();

        expect(testComponent.trackName).toBeUndefined();
        expect(testComponent.trackDescription).toBeUndefined();
    });

});
