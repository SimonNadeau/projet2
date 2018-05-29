export interface Camera {
    initialized(): void;

    getCamera(): THREE.Camera;

    updateCamera(): void;

    updateMatrix(): void;

    setPosition(): void;

    setLookAt(): void;

    zoomIn(): void;

    zoomOut(): void;
}
