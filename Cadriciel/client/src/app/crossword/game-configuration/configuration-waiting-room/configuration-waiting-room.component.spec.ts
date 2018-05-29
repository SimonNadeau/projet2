import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfigurationWaitingRoomComponent } from "./configuration-waiting-room.component";

describe("ConfigurationWaitingRoomComponent", () => {
  let component: ConfigurationWaitingRoomComponent;
  let fixture: ComponentFixture<ConfigurationWaitingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationWaitingRoomComponent ]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationWaitingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
