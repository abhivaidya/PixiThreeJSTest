/// <reference path = "../node_modules/@types/node/index.d.ts"/>
/// <reference path = "../node_modules/@types/pixi.js/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/index.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-gltfloader.d.ts"/>
/// <reference path = "../node_modules/@types/three/three-orbitcontrols.d.ts"/>
var Game = /** @class */ (function () {
    function Game() {
        var _this = this;
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
        this.renderer3D.setAnimationLoop(function () {
            _this.update();
            _this.render();
        });
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
        this.camera.position.set(-4, 10, 15);
        //let geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
        // let geometry = new THREE.OctahedronBufferGeometry(2, 2);
        // let material = new THREE.MeshBasicMaterial({ color: 0x800080 });
        // let material = new THREE.MeshStandardMaterial({ color: 0x800080 });
        // material.flatShading = true;
        // this.mesh = new THREE.Mesh( geometry, material );
        // this.scene.add( this.mesh );
        this.textureLoader = new THREE.TextureLoader();
        var directionallight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionallight.position.set(0, 3, 3);
        this.scene.add(directionallight);
        var ambientlight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientlight);
        var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20), new THREE.MeshPhongMaterial({ color: 0x2C3539, depthWrite: false }));
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);
        var grid = new THREE.GridHelper(200, 40, 0x2C3539, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);
        this.loadingManager = new THREE.LoadingManager(function () {
            _this.initGame();
        });
        var enviModelNames = ['altarStone', 'altarWood', 'bench', 'benchBroken', 'borderPillar', 'coffin', 'coffinOld', 'columnLarge', 'cross', 'crypt', 'debris', 'debrisWood', 'detailBowl', 'detailChalice', 'detailPlate', 'fence', 'fenceBroken', 'fenceIron', 'fenceIronBorder', 'fenceIronBorderPillar', 'fenceIronGate', 'fenceIronOpening', 'fenceStone', 'fenceStoneStraight', 'fireBasket', 'grave', 'gravestoneBevel', 'gravestoneBroken', 'gravestoneCross', 'gravestoneCrossLarge', 'gravestoneDebris', 'gravestoneDecorative', 'gravestoneFlat', 'gravestoneFlatOpen', 'gravestoneRoof', 'gravestoneRound', 'gravestoneWide', 'lanternCandle', 'lanternDouble', 'lanternGlass', 'lanternSingle', 'pillarObelisk', 'pillarSquare', 'pumpkin', 'pumpkinCarved', 'pumpkinCarvedTall', 'pumpkinTall', 'shovel', 'shovelDirt', 'trunk', 'trunkLong', 'urn'];
        var positionRange = 20;
        var _loop_1 = function (i) {
            var loader = new THREE.GLTFLoader(this_1.loadingManager);
            loader.load('assets/environment/' + enviModelNames[i] + '.glb', function (gltf) {
                _this[enviModelNames[i]] = gltf.scene;
                // this.scene.add( this[enviModelNames[i]] );
                // this[enviModelNames[i]].position.set(Math.round(Math.random() * positionRange) - positionRange / 2, 0, Math.round(Math.random() * positionRange) - positionRange / 2);
            }, undefined, function (e) {
                console.error(e);
            });
        };
        var this_1 = this;
        for (var i = 0; i < enviModelNames.length; i++) {
            _loop_1(i);
        }
        this.controls = new THREE.OrbitControls(this.camera, this.divContainer);
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
        this.scene.add(this['lanternDouble'].clone());
    };
    return Game;
}());
window.addEventListener("DOMContentLoaded", function () {
    var game = new Game();
    window.addEventListener('resize', function () {
        game.onWindowResize.bind(game);
    });
});
