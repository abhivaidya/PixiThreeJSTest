///<reference path="../node_modules/@types/three/index.d.ts"/>
///<reference path="../node_modules/@types/pixi.js/index.d.ts"/>
var container;
var rendererThree;
var rendererPixi;
var camera;
var scene;
var mesh;
var canvas;
var textureLoader;
function init() {
    container = document.querySelector('#container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');
    var fov = 35;
    var aspect = container.clientWidth / container.clientHeight;
    var near = 0.1;
    var far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 10);
    var geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial({ color: 0x800080 });
    var material = new THREE.MeshStandardMaterial({ color: 0x800080 });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    textureLoader = new THREE.TextureLoader();
    var light = new THREE.DirectionalLight(0xffffff, 5);
    light.position.set(0, 3, 3);
    scene.add(light);
    rendererThree = new THREE.WebGLRenderer({ antialias: true });
    rendererThree.setSize(container.clientWidth, container.clientHeight);
    rendererThree.setPixelRatio(window.devicePixelRatio);
    canvas = rendererThree.domElement;
    container.appendChild(rendererThree.domElement);
    rendererThree.setAnimationLoop(function () {
        update();
        render();
    });
}
function update() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
}
function render() {
    rendererThree.state.reset();
    rendererThree.render(scene, camera);
    rendererThree.state.reset();
}
function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    rendererThree.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', onWindowResize);
init();
