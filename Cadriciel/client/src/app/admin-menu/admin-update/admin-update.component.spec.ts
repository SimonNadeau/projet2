import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminUpdateComponent } from "./admin-update.component";
import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

import { FormsModule } from "@angular/forms";
import { RenderService } from "../../render-service/render.service";
import {HttpModule} from "@angular/http";
import { RequestServerService } from "../../services/request-server.service";
import { APP_BASE_HREF } from "@angular/common";

describe("AdminUpdateComponent", () => {
  let component: AdminUpdateComponent;
  let fixture: ComponentFixture<AdminUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminUpdateComponent
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit true if cancel button is click", () => {
    spyOn(component.notify, "emit");

    const button: DebugElement = fixture.debugElement.query(By.css("#button-cancel"));
    button.triggerEventHandler("click", {});

    fixture.detectChanges();

    expect(component.notify.emit).toHaveBeenCalledWith(true);

  });

});
