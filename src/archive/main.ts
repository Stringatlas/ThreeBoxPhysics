import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DirectionalLight } from 'three'
import { PhysicsObject } from '../physics'

class Vector2 {
  x=0
  y=0
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  getNormalized() {
    let magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
    if (magnitude == 0) {
      return new Vector2(this.x, this.y)
    }
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }
}

var frameTime = 0;

let clock = new THREE.Clock();

const starScatterBoxSize = 150;
const starShakeSpread = 0.5;
const numberOfStars = 0;

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

// const geo = new THREE.IcosahedronGeometry(10, 3);
// const mat = new THREE.MeshStandardMaterial({ color: 0xfe872f, wireframe: true} );
// const icosahedron = new THREE.Mesh(geo, mat);

const cubeGeo = new THREE.SphereGeometry(5);
const cubeMat = new THREE.MeshPhysicalMaterial({
  roughness: 0.7,
  metalness: 0.19,
  reflectivity: 0.7,
  clearcoat: 0.68,
  clearcoatRoughness: 0.83,
  color: 0x1282ef
});
const cube = new THREE.Mesh(cubeGeo, cubeMat);

const floorGeo = new THREE.PlaneGeometry(25, 25);
const floorMat = new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide,
  color: 0x573983,
  roughness: 0.5,

  
})
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotateX(Math.PI / 2);
floor.translateZ(5);
const isoMaterial = new THREE.MeshPhysicalMaterial();
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// const gridHelper = new THREE.GridHelper(200, 34, 0x219f7e, 0x8abf73);
// scene.add(gridHelper);

// directionalLight.position.set(20, 5, 5);


const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 2);

scene.add(ambientLight);
scene.add(directionalLightHelper);
scene.add(directionalLight);

cube.translateX(10);
cube.receiveShadow = true;
floor.receiveShadow = true;
// icosahedron.receiveShadow = true;
// scene.add(icosahedron);
scene.add(cube, floor);

let deltaTime = 0;
let fps = 0;

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

function createStar() {
  let [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(starScatterBoxSize));
  console.log(x, y, z);
  
  const geo = new THREE.SphereGeometry(0.5, 25, 25);
  const mat = new THREE.MeshStandardMaterial( {emissive: 0xffffff, color: 0xffffff, emissiveIntensity: 1});

  const star = new THREE.Mesh(geo, mat);
  star.position.set(x, y, z);
  scene.add(star);

  return star;
}

var stars = Array(numberOfStars).fill(0).map(() => createStar());

console.log("stars", stars);

var cubePhysicsObject = new PhysicsObject(cube);

function loop() {
  deltaTime = clock.getDelta();
  frameTime = deltaTime;

  fps = 1 / deltaTime;
  fpsCounter.innerHTML = fps.toFixed(3);

  requestAnimationFrame(loop);

  // icosahedron.rotateX(0.05);
  controls.update();

  stars.forEach((star) => { 
    star.position.set(star.position.x + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    star.position.y + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    star.position.z + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    )
  })

  renderer.render(scene, camera);
  handleMovement();
  // cube.lookAt(new THREE.Vector3(camera.position.x, 0, camera.position.z));
}

var moveSpeed = 5;

var forward: boolean, left: boolean, right: boolean, back: boolean = false; 

function handleMovement() {
  var movementInput = new Vector2(0, 0);
  if (forward) {
    movementInput.y -= 1;
  }
  
  if (back) {
    movementInput.y += 1;
  }

  if (left) {
    movementInput.x -= 1;
  }

  if (right) {
    movementInput.x += 1;
  }

  var movementInput = movementInput.getNormalized();

  var moveX = movementInput.x * moveSpeed * frameTime;
  var moveY = movementInput.y * moveSpeed * frameTime;

  if (!(Number.isFinite(moveX))) {
    moveX = 0;
  }

  if (!(Number.isFinite(moveY))) {
    moveY = 0;
  }

  let camRot = camera.rotation.z;
  let sin = Math.sin(camRot);
  let cos = Math.cos(camRot);
  
  cube.translateX(moveX * cos + moveY * sin);
  cube.translateZ(-moveX * sin + moveY * cos);
  // cube.translateX(moveX);
  // cube.translateZ(moveY);
}

document.addEventListener("keydown", (event) => {
  var key = event.key;

  if (key == "w") {
    forward = true;
  }
  else if (key == "a") {
    left = true;
  }
  else if (key == "s") {
    back = true;
  }
  else if (key == "d") {
    right = true;
  }
});

document.addEventListener("keyup", (event) => {
  var key = event.key;

  if (key == "w") {
    forward = false;
  }
  else if (key == "a") {
    left = false;
  }
  else if (key == "s") {
    back = false;
  }
  else if (key == "d") {
    right = false;
  }
});

loop();


