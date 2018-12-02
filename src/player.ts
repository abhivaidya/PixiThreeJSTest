class Player
{
    private charModel:THREE.Scene;
    
    constructor(scene:THREE.Scene, playerModel:THREE.Scene, playerTexture:THREE.Texture)
    {
        this.charModel = playerModel;

        console.log(playerModel);

        playerTexture.flipY = false;
        ((playerModel.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).map = playerTexture;
        scene.add(this.charModel);
    }

    public lookAt(intersectPoint:THREE.Vector3)
    {
        this.charModel.lookAt(intersectPoint);
    }

    public update()
    {

    }
}