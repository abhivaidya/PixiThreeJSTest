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
        this.camXDistFromPlayer = 5;
        this.camYDistFromPlayer = 5;
        this.camZDistFromPlayer = 5;
        this.divContainer = document.querySelector('#container');
        //Setting THREE Renderer
        this.renderer3D = new THREE.WebGLRenderer({ antialias: true });
        this.renderer3D.setSize(this.divContainer.clientWidth, this.divContainer.clientHeight);
        this.renderer3D.setPixelRatio(window.devicePixelRatio);
        this.renderer3D.shadowMap.enabled = true;
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
        // this.scene.background = new THREE.Color(0x2c3539);
        var fov = 15;
        var aspect = this.divContainer.clientWidth / this.divContainer.clientHeight;
        var near = 0.1;
        var far = 100;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(-this.camXDistFromPlayer, this.camYDistFromPlayer, this.camZDistFromPlayer);
        var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 5, 10);
        this.scene.add(directionalLight, hemisphereLight);
        // this.ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        var floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshPhongMaterial({ color: 0x1e1e1e, depthWrite: false }));
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);
        floor.receiveShadow = true;
        // let grid = new THREE.GridHelper( 200, 40, 0x2C3539, 0x000000 );
        // (grid.material as THREE.MeshStandardMaterial).opacity = 0.2;
        // (grid.material as THREE.MeshStandardMaterial).transparent = true;
        // this.scene.add( grid );
        this.loadingManager = new THREE.LoadingManager(function () {
            _this.initGame();
        });
        this.loadEnvironment();
        this.loadEnemyModels();
        this.loadPlayerModel();
        this.controls = new THREE.OrbitControls(this.camera, this.divContainer);
    };
    Game.prototype.loadPlayerModel = function () {
        var _this = this;
        var loader = new THREE.GLTFLoader(this.loadingManager);
        var onLoad = function (gltf, position, name) {
            _this.playerModel = gltf;
            // this.playerModel.castShadow = true;
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
            gltf.castShadow = true;
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
        this.enemies.forEach(function (enemy) {
            enemy.update();
        });
        this.player.update();
        // this.camera.position.set(this.player.charModel.position.x - this.camXDistFromPlayer, this.camYDistFromPlayer, this.player.charModel.position.z + this.camZDistFromPlayer);
        // this.camera.lookAt(this.player.charModel.position)
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
        //'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight',
        var _this = this;
        for (var i = 0; i < 6; i++) {
            var fence = this['fenceIronBorderPillar'].clone();
            this.scene.add(fence);
            fence.position.set(i * 1 - 3, 0, -3);
            if (i % 2 != 0) {
                fence.rotation.y = Math.PI;
                fence.position.x += 0.9;
                fence.position.z -= 0.1;
            }
        }
        var lantern = this['lanternDouble'].clone();
        this.scene.add(lantern);
        lantern.position.set(-1.05, 0, -3.05);
        lantern = this['lanternDouble'].clone();
        this.scene.add(lantern);
        lantern.position.set(0.95, 0, -3.05);
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
        document.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.addEventListener('keydown', this.onDocumentKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onDocumentKeyUp.bind(this), false);
    };
    Game.prototype.onDocumentKeyDown = function (event) {
        this.player.startMoving(event.keyCode);
    };
    Game.prototype.onDocumentKeyUp = function (event) {
        this.player.stopMoving(event.keyCode);
    };
    Game.prototype.onMouseMove = function (event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // this.raycaster.ray.intersectPlane(this.ground, this.intersectPoint);
        // this.player.lookAt(this.intersectPoint);
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
