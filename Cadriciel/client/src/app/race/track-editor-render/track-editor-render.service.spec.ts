/* tslint:disable: no-magic-numbers */

import { TestBed, inject } from "@angular/core/testing";
import { TrackEditorRenderService } from "./track-editor-render.service";
import { Vector3 } from "three";

describe("TrackEditorRenderServiceService", () => {
  let container: HTMLDivElement;
  let array: number[][];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackEditorRenderService]
    });
    container = document.createElement("div");
    document.getElementById = jasmine.createSpy("HTML Element").and.returnValue(container);
    array = [
      [ -0.3879941434846267, 1, -0.4680604534862712 ],
      [ 0.16820095168374793, 1, -0.062016511966871024 ],
      [ -0.3790240666178625, 1, 0.1812372754460625 ],
      [ -0.7320644216691069, 1, 0.5749025146904708 ],
      [ -0.8374816983894583, 1, 0.09193955211261592 ]
    ];
  });

  it("should be created", inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {
    expect(service).toBeTruthy();
  }));

  it("should be ok to load track", inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {
    service
    .initialize(container)
    .then( () => {
      service.loadTrack(array);
      let vector: Vector3;
      for (let i: number = 0; i < array.length; i++) {
        vector = new Vector3(array[i][0], array[i][1], array[i][2]);
        expect(service["scene"].children[(i + 1) * 2].position.equals(vector)).toBeTruthy();
      }
    })
    .catch((err) => console.error(err));

  }));

  it("should not be to delete the floor or the AmbientLight when deleting a track",
     inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {

    service
    .initialize(container)
    .then( () => {
      service.loadTrack(array);
      service.deleteTrack();

      // the two left are AmbientLight and the floor as it should
      expect(service["scene"].children.length).toEqual(2);
    })
    .catch((err) => console.error(err));
  }));

  it("The scene should have 1 less element after undo.", inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {
    service
    .initialize(container)
    .then( () => {
      service.loadTrack(array);
      const originalLenght: number = service["scene"].children.length;
      const me: MouseEvent = undefined;
      service.undoLastNode(me);

      expect(originalLenght - 1).toEqual(service["scene"].children.length);
      expect(service.track.checkIfOkTosave()).toBeFalsy();
    })
    .catch((err) => console.error(err));

  }));

  it("The scene should add a new element if needed. A new element should add a segment and a node",
     inject([TrackEditorRenderService], (service: TrackEditorRenderService) => {

    service
    .initialize(container)
    .then( () => {
      service.loadTrack(array);
      const originalLenght: number = service["scene"].children.length;
      const vector: Vector3 = new Vector3(-0.8374816983894583, 1, 0);
      service.addNode(vector);
      expect(originalLenght + 2).toEqual(service["scene"].children.length);
    })
    .catch((err) => console.error(err));

  }));

});
