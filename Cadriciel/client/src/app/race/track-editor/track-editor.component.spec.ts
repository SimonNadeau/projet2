/* tslint:disable: no-magic-numbers */
import { async, ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { TrackEditorComponent } from "./track-editor.component";
import { RenderService, DEFAULT_TRACK } from "../../render-service/render.service";

describe("TrackEditorComponent", () => {
  let component: TrackEditorComponent;
  let fixture: ComponentFixture<TrackEditorComponent>;
  let container: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackEditorComponent ],
      providers: [RenderService]
    })
    .compileComponents()
    .then(/* do nothing */)
    .catch((err) => console.error(err));

    container = document.createElement("div");
    document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(container);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should not be ok to save if we do a right click", inject([RenderService], async (service: RenderService) => {
    service
    .initialize(container, true, DEFAULT_TRACK)
    .then( () => {
      const me: MouseEvent = undefined;
      component.rightClick(me);

      expect(component.okToSave).toBeFalsy();
    })
    .catch((err) => console.error(err));

  }));

  it("should not be ok to save when deleting a track", inject([RenderService], async (service: RenderService) => {
    service
    .initialize(container, true, DEFAULT_TRACK)
    .then( () => {
      const array: number[][] = [];
      for (const child of service.scene.children) {
        array.push([child.position.x, child.position.z]);
      }

      component.positionsArray = array;
      component.clearEditor();

      expect(component.okToSave).toBeFalsy();
    })
    .catch((err) => console.error(err));

  }));

  describe("HostListener test", () => {

    it("Should emit a save track when the mouse is click", inject([RenderService], async (service: RenderService) => {
      service
        .initialize(container, true, DEFAULT_TRACK)
        .then(() => {
          spyOn(component.notifySaveTrack, "emit");
          const e: MouseEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          });

          component.mouseClick(e);
          expect(component.notifySaveTrack.emit).toHaveBeenCalled();
        }

        )
        .catch((err) => console.error(err));
    }));

    it("Should should change flag if mouse leftclick", inject([RenderService], async (service: RenderService) => {
      service
        .initialize(container, true, DEFAULT_TRACK)
        .then(() => {

          const e: MouseEvent = new MouseEvent("mousedown", {
            bubbles: true,
            cancelable: true,
            view: window
          });

          component.mouseDown(e);
          expect(component["isLeftClick"]).toBeTruthy();
        }

        )
        .catch((err) => console.error(err));
    }));
  });

  it("Should load editor", inject([RenderService],  async (service: RenderService) => {
    const MOCK_NODES: Array<Array<number>> = [
      [-0.3304582210242588, 0, -0.3631830291896113],
      [-0.27762803234501343, 0, -0.359109709291473],
      [-0.28301886792452835, 0, -0.3061565525908374],
      [-0.3304582210242587, 0, -0.31226653153191286]
    ];

    component.loadEditor(MOCK_NODES);
    expect(component["_okToSave"]).toBeTruthy();
  }));

});
