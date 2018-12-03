class Player
{
    public charModel:THREE.Scene;
    private walkSpeed:number = 0;
    private turnSpeed:number = 0;

    private speed:number = 2;

    private clock = new THREE.Clock();
    
    constructor(scene:THREE.Scene, playerModel:THREE.Scene, playerTexture:THREE.Texture)
    {
        this.charModel = playerModel;

        // console.log(playerModel);

        playerTexture.flipY = false;
        ((playerModel.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).map = playerTexture;
        scene.add(this.charModel);
        
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
    }

    public lookAt(intersectPoint:THREE.Vector3)
    {
        // this.charModel.lookAt(intersectPoint);
    }

    public startMoving(eventKeyCode:number)
    {
        switch( eventKeyCode ) 
        {
            case 87:
                this.walkSpeed = this.speed;
                break;
            case 83:
                this.walkSpeed = -this.speed;
                break;
            case 65:
                this.turnSpeed = this.speed;
                break;
            case 68:
                this.turnSpeed = -this.speed;
                break;
        }
    }

    public stopMoving(eventKeyCode:number)
    {
        switch( eventKeyCode ) 
        {
            case 87:
                this.walkSpeed = 0;
                break;
            case 83:
                this.walkSpeed = 0;
                break;
            case 65:
                this.turnSpeed = 0;
                break;
            case 68:
                this.turnSpeed = 0;
                break;
        }
    }

    public update()
    {
        let delta = this.clock.getDelta();

        this.charModel.translateZ(this.walkSpeed * delta);
        this.charModel.rotation.y += this.turnSpeed * delta;
    }
}