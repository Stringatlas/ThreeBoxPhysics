import { Vector3, Vector2 } from './vector'
import { Object3D, Mesh, Vector3 as THREEVector3} from 'three'
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsBox, PhysicsObject } from './physics'
import { InputManager } from './inputManager'
import { System } from './system'

let clock = new THREE.Clock();

const system = new System();

const collisionObjects = new Array<PhysicsBox>;

const fpsCounter: HTMLParagraphElement | any = document.querySelector("#fpsCounter");
const canvas: HTMLCanvasElement | any = document.querySelector('#threeCanvas');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: canvas
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

const cubeGeo = new THREE.BoxGeometry(5, 5, 5);
const cubeMat = new THREE.MeshPhysicalMaterial({
  roughness: 0.7,
  metalness: 0.4,
  reflectivity: 0.7,
  clearcoat: 0.68,
  clearcoatRoughness: 0.83,
  color: 0x1282ef
});

const cube = new THREE.Mesh(cubeGeo, cubeMat);

cube.translateY(20);
const floorGeo = new THREE.PlaneGeometry(25, 25);
const floorMat = new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide,
  color: 0x573983,
  roughness: 0.3,
})
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotateX(Math.PI / 2);
floor.translateZ(5);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(directionalLight, ambientLight);
scene.add(cube, floor);

let deltaTime: number = 0;
let fps: number = 0;

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const cubePhysicsObject = new PhysicsBox(5, 5, 5, collisionObjects, cube);
cubePhysicsObject.useGravity = false;
cubePhysicsObject.mass = 100;
const floorPhysicsObject = new PhysicsBox(25, 0.2, 25, collisionObjects, floor);
floorPhysicsObject.useGravity = false;
floorPhysicsObject.mass = 100;
floorPhysicsObject.showBoundingBox(scene);
cubePhysicsObject.showBoundingBox(scene);

system.addObject(cubePhysicsObject);
system.addObject(floorPhysicsObject);

function loop() {
    deltaTime = clock.getDelta();

    if (isFinite(deltaTime)) {
        let horizontal = InputManager.getHorizontal();
        let vertical = InputManager.getVertical();
        
        let upDown = (InputManager.keyPresses.get("r") ? 1 : 0) + (InputManager.keyPresses.get("c") ? -1 : 0);

        cubePhysicsObject.update(deltaTime, new Vector3(horizontal, upDown, -vertical).multiply(cubePhysicsObject.mass * 5000));
        floorPhysicsObject.update(deltaTime);
        if (InputManager.keyPresses.get(" ")) cubePhysicsObject.velocity = Vector3.zero;

        system.update();
    }

    fps = 1 / deltaTime;
    fpsCounter.innerHTML = fps.toFixed(3);

    requestAnimationFrame(loop);

    controls.update();

    renderer.render(scene, camera);
}

document.addEventListener("keydown", (event) => {
    InputManager.updateKeyDown(event);
});
  
document.addEventListener("keyup", (event) => {
    InputManager.updateKeyUp(event);
});

var [o1m, o2m, o1v, o2v]: [number, number, Vector3, Vector3] = [10, 1, Vector3.zero, Vector3.one.multiply(-2)];

var object1FinalVelocity = o1v.multiply(o1m - o2m).add(o2v.multiply(2 * o2m)).divide(o1m + o2m);
var object2FinalVelocity = o2v.multiply(o2m - o1m).add(o1v.multiply(2 * o1m)).divide(o1m + o2m);

console.log("FINAL VELOCITIES", object1FinalVelocity, object2FinalVelocity)

loop();


