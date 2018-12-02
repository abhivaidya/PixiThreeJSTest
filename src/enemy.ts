class Enemy
{
    protected charModel:THREE.Mesh;
    
    constructor()
    {
        
    }

    public update()
    {

    }

    public setPosition(position:THREE.Vector3)
    {
        this.charModel.position.set(position.x, position.y, position.z);
    }
}

class Zombie extends Enemy
{
    constructor(scene:THREE.Scene)
    {
        super();

        this.charModel = Game.enemyModels[0].scene.children[0].clone();
        scene.add(this.charModel);
        
        this.charModel.children[1].rotateX(-Math.PI / 2);
        this.charModel.children[2].rotateX(-Math.PI / 2); 
    }

    public update()
    {
        
    }
}

class Skeleton extends Enemy
{
    constructor(scene:THREE.Scene)
    {
        super();

        this.charModel = Game.enemyModels[1].scene.children[0].clone();
        scene.add(this.charModel);
        
        this.charModel.children[1].rotateX(-Math.PI / 2);
        this.charModel.children[2].rotateX(-Math.PI / 2); 
    }

    public update()
    {

    }
}

class Ghost extends Enemy
{
    private angle:number = 0;

    constructor(scene:THREE.Scene)
    {
        super();

        this.charModel = Game.enemyModels[2].scene.children[0].clone()
        scene.add(this.charModel);
        
        this.charModel.children[1].rotateX(-Math.PI / 2);
        this.charModel.children[2].rotateX(-Math.PI / 2);

        this.charModel.position.y += 0.25;
    }

    public update()
    {
        this.angle += 0.04;

        this.charModel.position.y += Math.sin(this.angle) * 0.00625;

        // this.charModel.children[1].rotateX()
    }
}