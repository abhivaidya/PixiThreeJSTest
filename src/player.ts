class Player
{
    public charModel:THREE.Scene;
    private charAnims:THREE.AnimationClip[];
    private walkSpeed:number = 0;
    private turnSpeed:number = 0;

    private mixer:THREE.AnimationMixer;
    private actions:THREE.AnimationAction[];
    private actionNames:string[];

    private speed:number = 2;

    private clock = new THREE.Clock();

    private currAnimCount = 0;
    
    constructor(scene:THREE.Scene, gltfFile:THREE.GLTF, playerTexture:THREE.Texture)
    {
        this.charModel = gltfFile.scene;
        this.charAnims = gltfFile.animations

        playerTexture.flipY = false;
        ((this.charModel.children[0].children[1] as THREE.Mesh).material as THREE.MeshStandardMaterial).map = playerTexture;
        scene.add(this.charModel);
        
        // this.charModel.children[2].rotateX(-Math.PI / 2);
        // this.charModel.children[3].rotateX(-Math.PI / 2);
        
        this.mixer = new THREE.AnimationMixer( this.charModel );
        // mixers.push( mixer );

        this.actions = [];
        this.actionNames = [];

        for ( var i = 0; i < this.charAnims.length; i++ ) 
        {
            let clip = this.charAnims[ i ];
            let action = this.mixer.clipAction( clip );
            this.actions[ clip.name ] = action;
            this.actionNames.push(clip.name);
        }

        console.log(this.actions);

        this.actions[this.actionNames[this.currAnimCount]].play();
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
            case 32:
                this.changeAnim();
                break;
        }
    }

    private changeAnim()
    {
        this.actions[this.actionNames[this.currAnimCount]].fadeOut(0.5);

        this.currAnimCount++;

        this.actions[this.actionNames[this.currAnimCount]]
					.reset()
					.setEffectiveTimeScale( 1 )
					.setEffectiveWeight( 1 )
					.fadeIn( 0.5 )
					.play();
    }

    public update()
    {
        let delta = this.clock.getDelta();

        if(this.mixer)
            this.mixer.update( delta );

        this.charModel.translateZ(this.walkSpeed * delta);
        this.charModel.rotation.y += this.turnSpeed * delta;
    }
}