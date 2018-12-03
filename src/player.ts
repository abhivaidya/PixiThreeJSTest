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
        
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
    }

    public lookAt(intersectPoint:THREE.Vector3)
    {
        this.charModel.lookAt(intersectPoint);
    }

    public move(eventKeyCode:number)
    {
        switch( eventKeyCode ) 
        {
            case 87:
                this.charModel.position.setZ(this.charModel.position.z + 0.05);
                break;
            case 65:
                console.log('a');
                break;
            case 83:
                console.log('s');
                break;
            case 68:
                console.log('d');
                break;
        }
    }

    public update()
    {

    }
}