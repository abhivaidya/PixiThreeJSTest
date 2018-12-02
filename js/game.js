/// <reference path = "../node_modules/@types/node/index.d.ts"/>
/// <reference path = "../node_modules/@types/pixi.js/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-gltfloader.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-orbitcontrols.d.ts"/>
var Game = /** @class */ (function () {
    function Game() {
        this.playerActions = [];
        this.enemies = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersectPoint = new THREE.Vector3();
        this.divContainer = document.querySelector('#container');
        //Setting THREE Renderer
        this.renderer3D = new THREE.WebGLRenderer({ antialias: true });
        this.renderer3D.setSize(this.divContainer.clientWidth, this.divContainer.clientHeight);
        this.renderer3D.setPixelRatio(window.devicePixelRatio);
        this.canvas = this.renderer3D.domElement;
        this.divContainer.appendChild(this.renderer3D.domElement);
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
    Game.prototype.initialiseThreeProps = function () {
        var _this = this;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2c3539);
        var fov = 35;
        var aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        var near = 0.1;
        var far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(-4, 5, 10);
        var directionallight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionallight.position.set(0, 3, 3);
        this.scene.add(directionallight);
        var ambientlight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientlight);
        this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshPhongMaterial({ color: 0x2C3539, depthWrite: false }));
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);
        var grid = new THREE.GridHelper(200, 40, 0x2C3539, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);
        this.loadingManager = new THREE.LoadingManager(function () {
            _this.initGame();
        });
        this.loadEnvironment();
        this.loadEnemyModels();
        this.loadPlayerModel();
        this.controls = new THREE.OrbitControls(this.camera, this.divContainer);
        this.clock = new THREE.Clock();
    };
    Game.prototype.loadPlayerModel = function () {
        var _this = this;
        var loader = new THREE.GLTFLoader(this.loadingManager);
        var onLoad = function (gltf, position, name) {
            _this.playerModel = gltf.scene;
            var playerScale = 0.06;
            _this.playerModel.scale.set(playerScale, playerScale, playerScale);
        };
        var onProgress = function () { };
        var onError = function (errorMessage) { console.log(errorMessage); };
        loader.load('assets/characters/advancedCharacter.gltf', function (gltf) { return onLoad(gltf, new THREE.Vector3(), 'player'); }, onProgress, onError);
        var textureLoader = new THREE.TextureLoader(this.loadingManager);
        textureLoader.load('assets/characters/skin_adventurer.png', function (texture) {
            _this.playerTexture = texture;
        });
    };
    Game.prototype.loadEnemyModels = function () {
        var loader = new THREE.GLTFLoader(this.loadingManager);
        var onLoad = function (gltf, position, name) {
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
        var onProgress = function () { };
        var onError = function (errorMessage) { console.log(errorMessage); };
        var zombiePosition = new THREE.Vector3(0, 0, 1);
        loader.load('assets/characters/character_zombie.glb', function (gltf) { return onLoad(gltf, zombiePosition, 'zombie'); }, onProgress, onError);
        var skeletonPosition = new THREE.Vector3(1, 0, -2);
        loader.load('assets/characters/character_skeleton.glb', function (gltf) { return onLoad(gltf, skeletonPosition, 'skeleton'); }, onProgress, onError);
        var ghostPosition = new THREE.Vector3(0, 0, 0);
        loader.load('assets/characters/character_ghost.glb', function (gltf) { return onLoad(gltf, ghostPosition, 'ghost'); }, onProgress, onError);
    };
    Game.prototype.loadEnvironment = function () {
        var _this = this;
        var enviModelNames = ['altarStone', 'altarWood', 'bench', 'benchBroken', 'borderPillar', 'coffin', 'coffinOld', 'columnLarge', 'cross', 'crypt', 'debris', 'debrisWood', 'detailBowl', 'detailChalice', 'detailPlate', 'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight', 'fireBasket', 'grave', 'gravestoneBevel', 'gravestoneBroken', 'gravestoneCross', 'gravestoneCrossLarge', 'gravestoneDebris', 'gravestoneDecorative', 'gravestoneFlat', 'gravestoneFlatOpen', 'gravestoneRoof', 'gravestoneRound', 'gravestoneWide', 'lanternCandle', 'lanternDouble', 'lanternGlass', 'lanternSingle', 'pillarObelisk', 'pillarSquare', 'pumpkin', 'pumpkinCarved', 'pumpkinCarvedTall', 'pumpkinTall', 'shovel', 'shovelDirt', 'trunk', 'trunkLong', 'urn'];
        var positionRange = 20;
        var loader = new THREE.GLTFLoader(this.loadingManager);
        var _loop_1 = function (i) {
            loader.load('assets/environment/' + enviModelNames[i] + '.glb', function (gltf) {
                _this[enviModelNames[i]] = gltf.scene;
            }, undefined, function (e) {
                console.error(e);
            });
        };
        for (var i = 0; i < enviModelNames.length; i++) {
            _loop_1(i);
        }
    };
    Game.prototype.initialisePixiProps = function () {
        this.pixicontainer = new PIXI.Container();
        var bunnyTexture = PIXI.Texture.fromImage('https://use-the-platform.com/webp/images/1');
        var bunny = new PIXI.Sprite(bunnyTexture);
        bunny.anchor.x = bunny.anchor.y = 0;
        bunny.position.x = 0;
        bunny.position.y = 0;
        bunny.scale.set(0.2);
        this.pixicontainer.addChild(bunny);
    };
    Game.prototype.update = function () {
        // this.mesh.rotation.x += 0.01;
        // this.mesh.rotation.y += 0.01;
        // this.mesh.rotation.z += 0.01;
        var delta = this.clock.getDelta();
        if (this.mixer)
            this.mixer.update(delta);
        this.enemies.forEach(function (enemy) {
            enemy.update();
        });
    };
    Game.prototype.render = function () {
        this.renderer2D.reset();
        this.renderer3D.state.reset();
        this.renderer3D.render(this.scene, this.camera);
        this.renderer3D.state.reset();
        this.renderer2D.reset();
        this.renderer2D.render(this.pixicontainer, undefined, false);
    };
    Game.prototype.onWindowResize = function () {
        this.camera.aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer3D.setSize(this.divContainer.clientWidth, this.divContainer.clientHeight);
    };
    Game.prototype.initGame = function () {
        // this.scene.add(this['lanternDouble'].clone());
        var _this = this;
        // ((this.playerModel.children[1] as THREE.SkinnedMesh).material as THREE.MeshStandardMaterial).map = this.playerTexture;
        // this.playerActions['Idle'].play();
        var zombie = new Zombie(this.scene);
        this.enemies.push(zombie);
        zombie.setPosition(new THREE.Vector3(0.25, 0, 0.5));
        var ghost = new Ghost(this.scene);
        this.enemies.push(ghost);
        ghost.setPosition(new THREE.Vector3(-0.25, 0, -0.5));
        var skeleton = new Skeleton(this.scene);
        this.enemies.push(skeleton);
        skeleton.setPosition(new THREE.Vector3(-0.25, 0, -0.75));
        this.player = new Player(this.scene, this.playerModel, this.playerTexture);
        this.renderer3D.setAnimationLoop(function () {
            _this.update();
            _this.render();
        });
        window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    };
    Game.prototype.onMouseMove = function (event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.ray.intersectPlane(this.ground, this.intersectPoint);
        this.player.lookAt(this.intersectPoint);
    };
    Game.enemyModels = [];
    return Game;
}());
window.addEventListener("DOMContentLoaded", function () {
    var game = new Game();
    window.addEventListener('resize', function () {
        game.onWindowResize.bind(game);
    });
});
