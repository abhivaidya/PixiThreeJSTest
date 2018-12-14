/// <reference path = "../node_modules/@types/node/index.d.ts"/>
/// <reference path = "../node_modules/@types/pixi.js/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-gltfloader.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-orbitcontrols.d.ts"/>
/// <reference path = "../node_modules/@types/ammo.d.ts"/>

class Game
{
    private divContainer;
    private canvas:HTMLCanvasElement;

    public factory:ShapeFactory;

    //Three props
    private renderer3D:THREE.WebGLRenderer;
    private camera:THREE.PerspectiveCamera;
    private scene:THREE.Scene;
    private loadingManager:THREE.LoadingManager;
    private controls:THREE.OrbitControls;
    private playerModel:THREE.GLTF;
    private playerTexture:THREE.Texture;
    private playerActions = [];
    private player:Player;
    private enemies:Enemy[] = [];
    public static enemyModels = [];
    private raycaster = new THREE.Raycaster();
    private mouse:THREE.Vector2 = new THREE.Vector2();
    private intersectPoint = new THREE.Vector3();
    private ground:THREE.Plane;
    private camXDistFromPlayer = 5;
    private camYDistFromPlayer = 5;
    private camZDistFromPlayer = 5;
    private clock = new THREE.Clock();
    private static alphabetModels = {};

    //Pixi props
    private renderer2D;
    private pixicontainer;

    //Physics props
    private physicsWorld: Ammo.btDiscreteDynamicsWorld;
    private rigidBodies = new Array<THREE.Object3D>();
    private tempTransform = new Ammo.btTransform();

    constructor()
    {
        this.divContainer = document.querySelector('#container');

        //Setting THREE Renderer
        this.renderer3D = new THREE.WebGLRenderer({ antialias: true });
        this.renderer3D.setSize( this.divContainer.clientWidth, this.divContainer.clientHeight );
        this.renderer3D.setPixelRatio( window.devicePixelRatio );
        this.renderer3D.shadowMap.enabled = true;

        this.canvas = this.renderer3D.domElement
        this.divContainer.appendChild( this.renderer3D.domElement );

        //Setting PIXI Renderer
        this.renderer2D = PIXI.autoDetectRenderer(this.canvas.width, this.canvas.height, {
            context: this.renderer3D.context,
            view: this.canvas,
            resolution: 1,
            transparent: true
        });      
    }

    public initialiseGameProps()
    {
        this.initialiseThreeProps();
        this.initialisePixiProps();
        this.initialisePhysicsProps();  
    }

    private initialiseThreeProps()
    {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x343441);

        let fov = 50;
        let aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        let near = 0.1;
        let far = 100;

        this.camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
        this.camera.position.set( this.camXDistFromPlayer, this.camYDistFromPlayer, this.camZDistFromPlayer );

        let ambientLight = new THREE.AmbientLight(0xaaaaaa, .9)

        let directionalLight = new THREE.DirectionalLight( 0x9DAACC, 1 );
        // let directionalLight = new THREE.DirectionalLight( 0x20283e, 4 );
        directionalLight.position.set( 5, 10, 7.5 );
        directionalLight.castShadow = true;

        this.scene.add(directionalLight, ambientLight);

        // this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        // let floor = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 20 ), new THREE.MeshStandardMaterial( { color: 0x343441, metalness: 0, roughness: 1, emissive: new THREE.Color(0, 0, 0) } ) );
        // floor.rotation.x = - Math.PI / 2;
        // // this.scene.add( floor );
        // floor.receiveShadow = true;

        // let grid = new THREE.GridHelper( 200, 40, 0x2C3539, 0x000000 );
        // (grid.material as THREE.MeshStandardMaterial).opacity = 0.2;
        // (grid.material as THREE.MeshStandardMaterial).transparent = true;
        // this.scene.add( grid );

        this.loadingManager = new THREE.LoadingManager(() => {
            this.initGame();
        });

        this.loadEnvironment();
        // this.loadEnemyModels();
        this.loadPlayerModel();
        this.loadMiscItems();

        this.controls = new THREE.OrbitControls( this.camera, this.divContainer );
    }

    private loadPlayerModel()
    {
        let loader = new THREE.GLTFLoader(this.loadingManager);

        const onLoad = ( gltf:THREE.GLTF, position, name:string ) => {
        
            this.playerModel = gltf;
            // this.playerModel.castShadow = true;
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
        
            // if (name == "zombie")
            //     Game.enemyModels[0] = gltf;
            // else if (name == "skeleton")
            //     Game.enemyModels[1] = gltf;
            // else if (name == "ghost")
            //     Game.enemyModels[2] = gltf;
            // else
            //     Game.enemyModels[3] = gltf;
            
            // console.log(Game.enemyModels[3]);
            
            gltf.castShadow = true;
        };
        
        const onProgress = () => {};
        
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        /*
        let zombiePosition = new THREE.Vector3( 0, 0, 1 );
        loader.load( 'assets/characters/character_zombie.glb', gltf => onLoad( gltf, zombiePosition, 'zombie' ), onProgress, onError );
        
        let skeletonPosition = new THREE.Vector3( 1, 0, -2 );
        loader.load( 'assets/characters/character_skeleton.glb', gltf => onLoad( gltf, skeletonPosition, 'skeleton' ), onProgress, onError );
        
        let ghostPosition = new THREE.Vector3( 0, 0, 0 );
        loader.load( 'assets/characters/character_ghost.glb', gltf => onLoad( gltf, ghostPosition, 'ghost' ), onProgress, onError );

        loader.load( 'assets/characters/learner_mesh.glb', gltf => onLoad( gltf, ghostPosition, 'learner' ), onProgress, onError );

        loader.load( 'assets/characters/learner_idle.glb', gltf => onLoad( gltf, ghostPosition, 'learner' ), onProgress, onError );*/
    }

    private loadEnvironment()
    {
        // let enviModelNames = ['altarStone', 'altarWood', 'bench', 'benchBroken', 'borderPillar', 'coffin', 'coffinOld', 'columnLarge', 'cross', 'crypt', 'debris', 'debrisWood', 'detailBowl', 'detailChalice', 'detailPlate', 'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight', 'fireBasket', 'grave', 'gravestoneBevel', 'gravestoneBroken', 'gravestoneCross', 'gravestoneCrossLarge', 'gravestoneDebris', 'gravestoneDecorative', 'gravestoneFlat', 'gravestoneFlatOpen', 'gravestoneRoof', 'gravestoneRound', 'gravestoneWide', 'lanternCandle', 'lanternDouble', 'lanternGlass', 'lanternSingle', 'pillarObelisk', 'pillarSquare', 'pumpkin', 'pumpkinCarved', 'pumpkinCarvedTall', 'pumpkinTall', 'shovel', 'shovelDirt', 'trunk', 'trunkLong', 'urn'];

        // let positionRange:number = 20;
        let loader = new THREE.GLTFLoader(this.loadingManager);

        loader.load( 'assets/environment/christmas.glb', ( gltf:THREE.GLTF ) => {
            this.scene.add(gltf.scene);
            // gltf.scene.receiveShadow = true;
            // gltf.scene.castShadow = true;

            gltf.scene.children.forEach(child => {
                
                if(child.name == "Floor")
                {
                    child.receiveShadow = true;
                    child.castShadow = false;
                }

                // console.log(child.name);
                
                if(child.children[0])
                {
                    child.children[0].castShadow = true;
                    child.children[0].receiveShadow = true;
                }
            });
        }, undefined, function( e ) {
            console.error( e );
        } );

        // for(let i= 0; i < enviModelNames.length; i++)
        // {            
        //     loader.load( 'assets/environment/' + enviModelNames[i] + '.glb', ( gltf:THREE.GLTF ) => {
        //         this[enviModelNames[i]] = gltf.scene;
        //         gltf.scene.castShadow = true;
        //     }, undefined, function( e ) {
        //         console.error( e );
        //     } );
        // }

        let numPoints = 50;

        let spline = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.25, 0, 0),
            new THREE.Vector3(-0.5, 0, 0.2),
            new THREE.Vector3(-0.6, 0, 0.35),
            // new THREE.Vector3(1.50, .50, 0),
            // new THREE.Vector3(2.50, .100, 0),
            // new THREE.Vector3(2.50, 3.00, 0)
        ]);
    
        var material = new THREE.LineBasicMaterial({
            color: 0xff00f0,
        });
    
        var geometry = new THREE.Geometry();
        var splinePoints = spline.getPoints(numPoints);
    
        for (var i = 0; i < splinePoints.length; i++) {
            geometry.vertices.push(splinePoints[i]);
        }
    
        var line = new THREE.Line(geometry, material);
        this.scene.add(line);
    }

    private loadMiscItems()
    {
        let loader = new THREE.GLTFLoader(this.loadingManager);

        const onLoad = ( gltf, name:string ) => {
            
            gltf.scene.children.forEach(child => {
                
                Game.alphabetModels[child.name] = child;

            });

            // console.log(Game.alphabetModels['a']);
        };
        
        const onProgress = () => {};
        
        const onError = ( errorMessage ) => { console.log( errorMessage ); };
        
        loader.load( 'assets/misc/alphabets.glb', gltf => onLoad( gltf, 'alphabets' ), onProgress, onError );
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

    private initialisePhysicsProps()
    {
        // Physics configuration
		const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
		const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
		const overlappingPairCache = new Ammo.btAxisSweep3(new Ammo.btVector3(-1000,-1000,-1000), new Ammo.btVector3(1000,1000,1000));
		const solver = new Ammo.btSequentialImpulseConstraintSolver();

		this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.physicsWorld.setGravity( new Ammo.btVector3(0, -9.8, 0));
    }

    private update(isPhysicsEnabled: boolean = true):number 
    {
        // this.enemies.forEach(enemy => {
        //     enemy.update();
        // });

        // this.player.update();

        // this.camera.position.set(this.player.charModel.position.x - this.camXDistFromPlayer, this.camYDistFromPlayer, this.player.charModel.position.z + this.camZDistFromPlayer);
        // this.camera.lookAt(this.player.charModel.position)

        const deltaTime = this.clock.getDelta();
		isPhysicsEnabled && this.updatePhysics(deltaTime);
		this.renderer3D.render(this.scene, this.camera);
		return deltaTime;
    }

    private updatePhysics(delta: number) 
    {
		// Step world
		this.physicsWorld.stepSimulation(delta, 10);

		// Update rigid bodies
		const len = this.rigidBodies.length;
		for (let i = 0; i < len; i++) {
			var objThree = this.rigidBodies[i];
			var ms = objThree.userData.physicsBody.getMotionState();
			if (ms) {
				ms.getWorldTransform(this.tempTransform);

				let p = this.tempTransform.getOrigin();
				objThree.position.set(p.x(), p.y(), p.z());

				let q = this.tempTransform.getRotation();
				objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
			}
		}
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
        /*
        lantern = this['lanternDouble'].clone();
        this.scene.add(lantern);
        lantern.position.set(0.95, 0, -3.05);
        
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
        */
        // (100, 1, 100, 0, pos, quat, new THREE.MeshPhongMaterial({ color: 0xFFFFFF }));
        // brickMass, -9, 9, 15, -9, false, material
        // this.factory.createParalellepiped(0.5, 0.5, 0.5, 30, new THREE.Vector3(0, 5, 0), new THREE.Quaternion(0, 0, 0, 1), new THREE.MeshPhongMaterial({ color: 0xB7B7B7 }));
        
        let pos = new THREE.Vector3(0, -0.5, 0);
        let quat = new THREE.Quaternion(0, 0, 0, 1);
        let ground = this.factory.createParalellepiped(20, 1, 20, 0, pos, quat, new THREE.MeshStandardMaterial( { opacity: 0, transparent: true} ));

        this.renderer3D.setAnimationLoop( () => {
            this.update();
            this.render();
        });

        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        document.addEventListener('touchend', this.onMouseUp.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onDocumentKeyUp.bind(this), false);
    }

    private onDocumentKeyDown(event)
    {
        // this.player.startMoving(event.keyCode);
    }

    private onDocumentKeyUp(event)
    {
        // this.player.stopMoving(event.keyCode);
        if((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122))
        {
            let alphabetClone = Game.alphabetModels[String.fromCharCode(event.keyCode).toLowerCase()].clone();
            alphabetClone.material.color = new THREE.Color(0xFF0000)

            let collisionObj:THREE.Mesh = this.factory.createParalellepiped(0.25, 0.25, 0.05, 30, new THREE.Vector3(1, 5, 0), new THREE.Quaternion(0, 0, 0, 1), new THREE.MeshStandardMaterial({ color: 0xB7B7B7, transparent:true, opacity:0 }));
            collisionObj.add(alphabetClone);
        }
    }

    private onMouseUp(event)
    {
        // this.player.stopMoving(event.keyCode);
        // this.factory.createParalellepiped(0.25, 0.25, 0.25, 30, new THREE.Vector3(0, 5, 0), new THREE.Quaternion(0, 0, 0, 1), new THREE.MeshPhongMaterial({ color: 0xB7B7B7 }));
    }

    private onMouseMove(event) 
    {
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // this.raycaster.ray.intersectPlane(this.ground, this.intersectPoint);
        // this.player.lookAt(this.intersectPoint);
    }

    public addPhysicsObject(object: THREE.Object3D, body: Ammo.btRigidBody, mass: number): void 
    {
        object.userData.physicsBody = body;
        
        if (mass > 0) 
        {
			this.rigidBodies.push(object);
			body.setActivationState(4); // Disable deactivation
        }
        
		this.scene.add(object);
		this.physicsWorld.addRigidBody(body);
	}
}

window.addEventListener("DOMContentLoaded", function(){
    let game = new Game();

    let factory = new ShapeFactory(game);

    game.factory = factory;
    game.initialiseGameProps();

    window.addEventListener('resize', function(){
        game.onWindowResize.bind(game);
    });
});
