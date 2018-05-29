import { TestBed, inject } from "@angular/core/testing";

import { RequestServerService } from "./request-server.service";
import { APP_BASE_HREF } from "@angular/common";
import {HttpModule} from "@angular/http";
import { FormsModule } from "@angular/forms";

describe("RequestServerService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        FormsModule,
        HttpModule
      ],
      providers: [
        RequestServerService
        ,
        { provide: APP_BASE_HREF, useValue: "/my/app" }
      ]
    });
  });

  it("should be created", inject([RequestServerService], (service: RequestServerService) => {
    expect(service).toBeTruthy();
  }));
});
