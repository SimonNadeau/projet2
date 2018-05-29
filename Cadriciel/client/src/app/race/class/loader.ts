import { Mesh, BoxGeometry, MultiMaterial, Texture, TextureLoader, RepeatWrapping,
    MeshBasicMaterial, PlaneGeometry, MeshPhongMaterial } from "three";
import { PI_OVER_2, THREE } from "../../constants";

const FLOOR_REPEATER: number = 2000;
const Z_FLOOR_TRANSLATION: number = -0.01;
const Z_SKYBOX_TRANSLATION: number = -0.02;

const SKYBOX_SIDE: number = 10000;
const SKYBOX_HEIGHT: number = 2000;

export class Loader {
    public isNightMode: boolean = false;

    public constructor() {}

    private textureRepeterGenerator(x: number, y: number, path: string): Texture {
        const texture: Texture = new TextureLoader().load( path );
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set( x, y );

        return texture;
    }

    private textureGenerator(path: string): Texture {
        return new TextureLoader().load( path );
    }

    private materialGenerator(path: string): MeshPhongMaterial {
        return new MeshPhongMaterial( { map: this.textureGenerator(path) } );
    }

    private materialRepeterGenerator(x: number, y: number, path: string): MeshPhongMaterial {
        return new MeshPhongMaterial( { map: this.textureRepeterGenerator(x, y, path) } );
    }

    public loadTextures(): MeshBasicMaterial[] {
        const nightPath: string = this.isNightMode ? "_night" : "";

        return [
            this.materialGenerator("../../assets/camero/skyBox_wall_1" + nightPath + ".png"),
            this.materialGenerator("../../assets/camero/skyBox_wall_3" + nightPath + ".png"),
            this.materialGenerator("../../assets/camero/skyBox_ceiling" + nightPath + ".png"),
            this.materialRepeterGenerator(FLOOR_REPEATER, FLOOR_REPEATER, "../../assets/camero/gazon.jpg"),
            this.materialGenerator("../../assets/camero/skyBox_wall_2" + nightPath + ".png"),
            this.materialGenerator("../../assets/camero/skyBox_wall_4" + nightPath + ".png")
        ];
    }

    public loadSkyBox(): Mesh {
        const geometry: BoxGeometry = new BoxGeometry(SKYBOX_SIDE, SKYBOX_HEIGHT, SKYBOX_SIDE);
        const skyBox: Mesh = new Mesh(geometry, new MultiMaterial(this.loadTextures()));
        skyBox.name = "skyBox";
        skyBox.scale.set(-1, 1, 1);
        skyBox.translateY((SKYBOX_HEIGHT / 2) + Z_SKYBOX_TRANSLATION);

        return skyBox;
    }

    public mesh(): Array<Mesh> {
        const meshArray: Mesh[] = new Array<Mesh>();

        const geometry: PlaneGeometry = new PlaneGeometry(SKYBOX_SIDE, SKYBOX_SIDE, 0, 0 );
        const floor: Mesh = new Mesh( geometry, this.materialRepeterGenerator(FLOOR_REPEATER, FLOOR_REPEATER,
                                                                              "../../assets/camero/gazon.jpg") );

        floor.rotateX(PI_OVER_2 * THREE);
        floor.translateZ(Z_FLOOR_TRANSLATION);
        meshArray.push(floor);

        meshArray.push(this.loadSkyBox());

        return meshArray;
    }
}
