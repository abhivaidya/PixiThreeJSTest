/// <reference path = "../node_modules/@types/node/index.d.ts"/>
/// <reference path = "../node_modules/@types/pixi.js/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-gltfloader.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-orbitcontrols.d.ts"/>

class Game
{
    private divContainer;
    private canvas:HTMLCanvasElement;

    //Three props
    private renderer3D:THREE.WebGLRenderer;
    private camera:THREE.PerspectiveCamera;
    private scene:THREE.Scene;
    private loadingManager:THREE.LoadingManager;
    private controls:THREE.OrbitControls;
    private playerModel:THREE.Scene;
    private playerTexture:THREE.Texture;
    private playerActions = [];
    private player:Player;
    private mixer:THREE.AnimationMixer;
    private clock:THREE.Clock;
    private enemies:Enemy[] = [];
    public static enemyModels = [];
    private raycaster = new THREE.Raycaster();
    private mouse:THREE.Vector2 = new THREE.Vector2();
    private intersectPoint = new THREE.Vector3();
    private ground:THREE.Plane;

    //Pixi props
    private renderer2D;
    private pixicontainer;

    constructor()
    {
        this.divContainer = document.querySelector('#container');

        //Setting THREE Renderer
        this.renderer3D = new THREE.WebGLRenderer({ antialias: true });
        this.renderer3D.setSize( this.divContainer.clientWidth, this.divContainer.clientHeight );
        this.renderer3D.setPixelRatio( window.devicePixelRatio );

        this.canvas = this.renderer3D.domElement
        this.divContainer.appendChild( this.renderer3D.domElement );

        //Setting PIXI Renderer
        this.renderer2D = PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height, {
            context: this.renderer3D.context,
            view: this.canvas,
            resolution: 1,
            transparent: true
        });

        this.initialiseThreeProps();
        this.initialisePixiProps();
    }

    private initialiseThreeProps()
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2c3539);

        let fov = 35;
        let aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        let near = 0.1;
        let far = 100;

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        this.camera.position.set( -4, 5, 10 );

        let directionallight = new THREE.DirectionalLight( 0xffffff, 1.5 );
        directionallight.position.set(0, 3, 3);
        this.scene.add(directionallight);

        let ambientlight = new THREE.AmbientLight( 0xffffff, 1 );
        this.scene.add(ambientlight);

        this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        let floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x2C3539, depthWrite: false } ) );
        floor.rotation.x = - Math.PI / 2;
        this.scene.add( floor );

        let grid = new THREE.GridHelper( 200, 40, 0x2C3539, 0x000000 );
        (grid.material as THREE.MeshStandardMaterial).opacity = 0.2;
        (grid.material as THREE.MeshStandardMaterial).transparent = true;
        this.scene.add( grid );

        this.loadingManager = new THREE.LoadingManager(() => {
            this.initGame();
        });

        this.loadEnvironment();
        this.loadEnemyModels();
        this.loadPlayerModel();

        this.controls = new THREE.OrbitControls( this.camera, this.divContainer );

        this.clock = new THREE.Clock();
    }

    private loadPlayerModel()
    {
        let loader = new THREE.GLTFLoader(this.loadingManager);

        const onLoad = ( gltf:THREE.GLTF, position, name:string ) => {
        
            this.playerModel = gltf.scene;

            let playerScale:number = 0.06;
            this.playerModel.scale.set(playerScale, playerScale, playerScale);
        };
        
        const onProgress = () => {};
        
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        
        loader.load( 'assets/characters/advancedCharacter.gltf', gltf => onLoad( gltf, new THREE.Vector3(), 'player' ), onProgress, onError );

        let textureLoader = new THREE.TextureLoader(this.loadingManager);
        textureLoader.load('assets/characters/skin_adventurer.png', (texture) => {
            this.playerTexture = texture;
        });
    }

    private loadEnemyModels()
    {
        let loader = new THREE.GLTFLoader(this.loadingManager);

        const onLoad = ( gltf, position, name:string ) => {
        
            // const model = gltf.scene.children[ 0 ];
            // model.position.copy( position );
            // model.children[1].rotateX(-Math.PI / 2);
            // model.children[2].rotateX(-Math.PI / 2);  
        
            // const animation = gltf.animations[ 0 ];
        
            // const mixer = new THREE.AnimationMixer( model );
            // mixers.push( mixer );
        
            // const action = mixer.clipAction( animation );
            // action.play();
        
            // this.scene.add( model );

            if (name == "zombie")
                Game.enemyModels[0] = gltf;
            else if (name == "skeleton")
                Game.enemyModels[1] = gltf;
            else if (name == "ghost")
                Game.enemyModels[2] = gltf;
        };
        
        const onProgress = () => {};
        
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        
        let zombiePosition = new THREE.Vector3( 0, 0, 1 );
        loader.load( 'assets/characters/character_zombie.glb', gltf => onLoad( gltf, zombiePosition, 'zombie' ), onProgress, onError );
        
        let skeletonPosition = new THREE.Vector3( 1, 0, -2 );
        loader.load( 'assets/characters/character_skeleton.glb', gltf => onLoad( gltf, skeletonPosition, 'skeleton' ), onProgress, onError );
        
        let ghostPosition = new THREE.Vector3( 0, 0, 0 );
        loader.load( 'assets/characters/character_ghost.glb', gltf => onLoad( gltf, ghostPosition, 'ghost' ), onProgress, onError );          
    }

    private loadEnvironment()
    {
        let enviModelNames = ['altarStone', 'altarWood', 'bench', 'benchBroken', 'borderPillar', 'coffin', 'coffinOld', 'columnLarge', 'cross', 'crypt', 'debris', 'debrisWood', 'detailBowl', 'detailChalice', 'detailPlate', 'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight', 'fireBasket', 'grave', 'gravestoneBevel', 'gravestoneBroken', 'gravestoneCross', 'gravestoneCrossLarge', 'gravestoneDebris', 'gravestoneDecorative', 'gravestoneFlat', 'gravestoneFlatOpen', 'gravestoneRoof', 'gravestoneRound', 'gravestoneWide', 'lanternCandle', 'lanternDouble', 'lanternGlass', 'lanternSingle', 'pillarObelisk', 'pillarSquare', 'pumpkin', 'pumpkinCarved', 'pumpkinCarvedTall', 'pumpkinTall', 'shovel', 'shovelDirt', 'trunk', 'trunkLong', 'urn'];

        let positionRange:number = 20;
        let loader = new THREE.GLTFLoader(this.loadingManager);

        for(let i= 0; i < enviModelNames.length; i++)
        {            
            loader.load( 'assets/environment/' + enviModelNames[i] + '.glb', ( gltf:THREE.GLTF ) => {
                this[enviModelNames[i]] = gltf.scene;
            }, undefined, function( e ) {
                console.error( e );
            } );
        }
    }

    private initialisePixiProps()
    {
        this.pixicontainer = new PIXI.Container();

        let bunnyTexture = PIXI.Texture.fromImage('https://use-the-platform.com/webp/images/1');
        let bunny = new PIXI.Sprite(bunnyTexture);
        bunny.anchor.x = bunny.anchor.y = 0;
        bunny.position.x = 0;
        bunny.position.y = 0;
        bunny.scale.set(0.2)
        this.pixicontainer.addChild(bunny);
    }

    private update() 
    {
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.01;
        // this.mesh.rotation.z += 0.01;

        const delta = this.clock.getDelta();

        if(this.mixer)
            this.mixer.update( delta );
        
        this.enemies.forEach(enemy => {
            enemy.update();
        });
    }

    private render()
    {
        this.renderer2D.reset();

        this.renderer3D.state.reset();
        this.renderer3D.render(this.scene, this.camera);
        this.renderer3D.state.reset();

        this.renderer2D.reset();
        this.renderer2D.render(this.pixicontainer, undefined, false);
    }

    public onWindowResize()
    {
        this.camera.aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer3D.setSize(this.divContainer.clientWidth, this.divContainer.clientHeight);
    }

    private initGame()
    {
        for(let i = 0; i < 10; i++)
        {
            let fence = this['fenceIron'].clone();
            this.scene.add(fence);
            fence.position.set(i * 1 - 5, 0, -5);
        }

        for(let i = 0; i < 10; i++)
        {
            let fence = this['fenceIron'].clone();
            this.scene.add(fence);
            fence.position.set(i * 1 - 5, 0, 5);
        }

        // this.scene.add(this['lanternDouble'].clone());

        // ((this.playerModel.children[1] as THREE.SkinnedMesh).material as THREE.MeshStandardMaterial).map = this.playerTexture;

        // this.playerActions['Idle'].play();

        let zombie = new Zombie(this.scene);
        this.enemies.push(zombie);
        zombie.setPosition(new THREE.Vector3(0.25, 0, 0.5));

        let ghost = new Ghost(this.scene);
        this.enemies.push(ghost);
        ghost.setPosition(new THREE.Vector3(-0.25, 0, -0.5));

        let skeleton = new Skeleton(this.scene);
        this.enemies.push(skeleton);
        skeleton.setPosition(new THREE.Vector3(-0.25, 0, -0.75));

        this.player = new Player(this.scene, this.playerModel, this.playerTexture);

        this.renderer3D.setAnimationLoop( () => {
            this.update();
            this.render();
        });

        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onDocumentKeyUp.bind(this), false);
    }

    private onDocumentKeyDown(event)
    {
        this.player.move(event.keyCode);

        // switch( event.keyCode ) 
        // {
        //     case 87:
        //         console.log('w');
        //         break;
        //     case 65:
        //         console.log('a');
        //         break;
        //     case 83:
        //         console.log('s');
        //         break;
        //     case 68:
        //         console.log('d');
        //         break;
        // }
    }

    private onDocumentKeyUp(event)
    {
        switch( event.keyCode ) 
        {
            case 16:
                break;
        }
    }

    private onMouseMove(event) 
    {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.ray.intersectPlane(this.ground, this.intersectPoint);
        this.player.lookAt(this.intersectPoint);
    }
}

window.addEventListener("DOMContentLoaded", function(){
    let game = new Game();

    window.addEventListener('resize', function(){
        game.onWindowResize.bind(game);
    });
});
