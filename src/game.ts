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
    private mesh:THREE.Mesh;
    private loadingManager:THREE.LoadingManager;
    private textureLoader:THREE.TextureLoader;
    private controls:THREE.OrbitControls;
    private playerModel:THREE.Scene;
    private mixer:THREE.AnimationMixer;
    private actions;

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

        this.renderer3D.setAnimationLoop( () => {
            this.update();
            this.render();
        });
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
        this.camera.position.set( -4, 10, 15 );

        //let geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        // let geometry = new THREE.OctahedronBufferGeometry(2, 2);

        // let material = new THREE.MeshBasicMaterial({ color: 0x800080 });
        // let material = new THREE.MeshStandardMaterial({ color: 0x800080 });
        // material.flatShading = true;

        // this.mesh = new THREE.Mesh( geometry, material );
        // this.scene.add( this.mesh );

        this.textureLoader = new THREE.TextureLoader();

        let directionallight = new THREE.DirectionalLight( 0xffffff, 1.5 );
        directionallight.position.set(0, 3, 3);
        this.scene.add(directionallight);

        let ambientlight = new THREE.AmbientLight( 0xffffff, 1 );
        this.scene.add(ambientlight);

        let ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x2C3539, depthWrite: false } ) );
        ground.rotation.x = - Math.PI / 2;
        this.scene.add( ground );

        let grid = new THREE.GridHelper( 200, 40, 0x2C3539, 0x000000 );
        (grid.material as THREE.MeshStandardMaterial).opacity = 0.2;
        (grid.material as THREE.MeshStandardMaterial).transparent = true;
        this.scene.add( grid );

        this.loadingManager = new THREE.LoadingManager(() => {
            this.initGame();
        });

        let enviModelNames = ['altarStone', 'altarWood', 'bench', 'benchBroken', 'borderPillar', 'coffin', 'coffinOld', 'columnLarge', 'cross', 'crypt', 'debris', 'debrisWood', 'detailBowl', 'detailChalice', 'detailPlate', 'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight', 'fireBasket', 'grave', 'gravestoneBevel', 'gravestoneBroken', 'gravestoneCross', 'gravestoneCrossLarge', 'gravestoneDebris', 'gravestoneDecorative', 'gravestoneFlat', 'gravestoneFlatOpen', 'gravestoneRoof', 'gravestoneRound', 'gravestoneWide', 'lanternCandle', 'lanternDouble', 'lanternGlass', 'lanternSingle', 'pillarObelisk', 'pillarSquare', 'pumpkin', 'pumpkinCarved', 'pumpkinCarvedTall', 'pumpkinTall', 'shovel', 'shovelDirt', 'trunk', 'trunkLong', 'urn'];

        let positionRange:number = 20;

        for(let i= 0; i < enviModelNames.length; i++)
        {
            let loader = new THREE.GLTFLoader(this.loadingManager);
            loader.load( 'assets/environment/' + enviModelNames[i] + '.glb', ( gltf:THREE.GLTF ) => {
                this[enviModelNames[i]] = gltf.scene;
                // this.scene.add( this[enviModelNames[i]] );


                // this[enviModelNames[i]].position.set(Math.round(Math.random() * positionRange) - positionRange / 2, 0, Math.round(Math.random() * positionRange) - positionRange / 2);
            }, undefined, function( e ) {
                console.error( e );
            } );
        }

        this.controls = new THREE.OrbitControls( this.camera, this.divContainer );
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
        this.scene.add(this['lanternDouble'].clone());
    }
}

window.addEventListener("DOMContentLoaded", function(){
    let game = new Game();

    window.addEventListener('resize', function(){
        game.onWindowResize.bind(game);
    });
});
