///<reference path="../node_modules/@types/three/index.d.ts"/>
///<reference path="../node_modules/@types/pixi.js/index.d.ts"/>

let container;

let rendererThree;
let rendererPixi;

let camera;
let scene;
let mesh;

let canvas;

let textureLoader;

function init()
{
    container = document.querySelector('#container');

    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue');

    const fov = 35;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;

    camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 10 );

    const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );

    // const material = new THREE.MeshBasicMaterial({ color: 0x800080 });
    const material = new THREE.MeshStandardMaterial({ color: 0x800080 });

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    textureLoader = new THREE.TextureLoader();

    const light = new THREE.DirectionalLight( 0xffffff, 5 );
    light.position.set(0, 3, 3);
    scene.add(light);

    rendererThree = new THREE.WebGLRenderer({ antialias: true });

    rendererThree.setSize( container.clientWidth, container.clientHeight );
    rendererThree.setPixelRatio( window.devicePixelRatio );

    canvas = rendererThree.domElement
    container.appendChild( rendererThree.domElement );

    rendererThree.setAnimationLoop( () => {
        update();
        render();
    });
}

function update()
{
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
}

function render()
{
    rendererThree.state.reset();
    rendererThree.render(scene, camera);
    rendererThree.state.reset();


}

function onWindowResize()
{
    camera.aspect = container.clientWidth / container.clientHeight;

    camera.updateProjectionMatrix();

    rendererThree.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

init();