/* tslint:disable: no-magic-numbers */

import { TestBed, inject } from "@angular/core/testing";
import { RenderService, DEFAULT_TRACK, EDITOR_TO_GAME } from "./render.service";
import { Vector3 } from "three";

const TWO: number = 2;

describe("RenderService", () => {
    let container: HTMLDivElement;
    let array: number[][];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RenderService]
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

    it("should be created", inject([RenderService], async (service: RenderService) => {
        await service
        .initialize(container, true, DEFAULT_TRACK)
        .then(/* do nothing */)
        .catch((err) => console.error(err));
        expect(service.car).toBeDefined();
    }));

    it("should be ok to load selected track for the track generator",  inject([RenderService], async (service: RenderService) => {
        service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => {
            service.loadSelectedTrack(array);
            let vector: Vector3;
            for (let i: number = 0; i < array.length; i++) {
                vector = new Vector3(array[i][0] * EDITOR_TO_GAME, array[i][1], array[i][2] * -EDITOR_TO_GAME);
                expect(service["_trackGen"]["_trackNode"][i].equals(vector)).toBeTruthy();
            }
        })
        .catch((err) => console.error(err));
      }));

    it("The scene should have more than 1 elements.", inject([RenderService], async (service: RenderService) => {
        await service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => {
            expect(service.scene.children.length).toBeGreaterThanOrEqual(TWO);
        })
        .catch((err) => console.error(err));

    }));

    it("The scene's elements should have different names.", inject([RenderService], async (service: RenderService) => {
        await service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => {
            const numberOfChildren: number = service.scene.children.length;
            const arrayOfNames: Array<string> = [];

            for (let index: number = 0; index < numberOfChildren; index++) {
                if (arrayOfNames.indexOf(service.scene.children[index].name) === -1) {
                    arrayOfNames.push(service.scene.children[index].name);
                }
            }
            expect(arrayOfNames.length).toBeGreaterThanOrEqual(TWO);
        })
        .catch((err) => console.error(err));
    }));

    it("The scene's first element should be skybox", inject([RenderService], async (service: RenderService) => {
       service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => { expect(service.scene.children[0].name).toBe("skyBox");
        })
        .catch((err) => console.error(err));

    }));

    it("The scene's second element should be track", inject([RenderService], async (service: RenderService) => {
       service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => {expect(service.scene.children[1].name).toBe("track"); } )
        .catch((err) => console.error(err));

    }));

    it("The car should be on lap 1 at the beginning of the race.", inject([RenderService], async (service: RenderService) => {
        service
        .initialize(container, true, DEFAULT_TRACK)
        .then( () => { expect(service.car.lap).toEqual(1); })
        .catch((err) => console.error(err));
    }));

    it("Should load a starting line correctly", inject([RenderService], async (service: RenderService) => {
        service
        .initialize(container, true, [[]])
        .then(() => {
            service.loadSelectedTrack(DEFAULT_TRACK);
            expect(service.scene.getObjectByName("starting line")).toBeDefined();
        })
        .catch((err) => console.error(err));
    }));

    it("Should generate a random grid position number", inject([RenderService], (service: RenderService) => {
        const firstPosition: number = service.carGridPosition();
        let isSameNumber: boolean = true;
        for (let i: number = 0; i < 20; i++) {
            if (service.carGridPosition() !== firstPosition) {
                isSameNumber = false;
                break;
            }
        }
        expect(isSameNumber).toBeFalsy();
    }));
});
