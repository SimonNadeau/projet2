import { Object3D, Geometry, Vector3, Points } from "three";

const FRONT_TRANSLATION_DISTANCE: number = -0.98;
const BACK_TRANSLATION_DISTANCE: number = 0.78;
const TRANSLATION_DISTANCES: number[] = [FRONT_TRANSLATION_DISTANCE, 0, BACK_TRANSLATION_DISTANCE];

export class VirtuaBumperCreator {
    public createVirtualBumpers(mesh: Object3D): void {
        TRANSLATION_DISTANCES.forEach((translationDistance) => {
            const virtualBumperGeometry: Geometry = new Geometry();
            virtualBumperGeometry.vertices.push(new Vector3(0, 0, 0));
            const virtualBumper: Points = new Points(virtualBumperGeometry);
            virtualBumper.visible = false;
            virtualBumper.translateOnAxis(mesh.getWorldDirection(), translationDistance);
            virtualBumper.translateOnAxis(new Vector3(0, 1, 0), 2);
            mesh.add(virtualBumper);
         });
    }
}
