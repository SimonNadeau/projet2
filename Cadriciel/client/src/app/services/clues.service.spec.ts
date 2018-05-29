import { TestBed, inject } from "@angular/core/testing";

import { CluesService } from "./clues.service";

describe("CluesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CluesService]
    });
  });

  it("should be created", inject([CluesService], (service: CluesService) => {
    expect(service).toBeTruthy();
  }));
});
