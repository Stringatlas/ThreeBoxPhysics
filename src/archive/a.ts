import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { BoxGeometry, Object3D, PlaneGeometry } from 'three';
import { ThreeObject } from './threeObject';

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

const geo = new THREE.IcosahedronGeometry(10, 3);
const mat = new THREE.MeshStandardMaterial({ color: 0xfe872f, wireframe: true} );
const icosahedron = new THREE.Mesh(geo, mat);

const cubeGeo = new THREE.BoxGeometry(10, 10, 10);
const cubeMat = new THREE.MeshPhysicalMaterial({
  roughness: 0,
  metalness: 0.707,
  reflectivity: 0.7,
  clearcoat: 0.68,
  clearcoatRoughness: 0.83,
  color: 0x1282ef
});

const cube = new THREE.Mesh(cubeGeo, cubeMat);

const floorGeo: PlaneGeometry = new THREE.PlaneGeometry(25, 25);
const floorMat = new THREE.MeshPhysicalMaterial({
  side: THREE.DoubleSide,
  color: 0x2222222,
  
})
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotateX(Math.PI / 2);
floor.translateZ(5);
const isoMaterial = new THREE.MeshPhysicalMaterial();
const pointLight = new THREE.PointLight(0xffffff);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 34, 0x219f7e, 0x8abf73);
// scene.add(gridHelper);

pointLight.position.set(20, 5, 5);

const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 2);

scene.add(ambientLight);
scene.add(pointLightHelper);
scene.add(pointLight);

cube.translateX(10);
cube.receiveShadow = true;
const cubeObject = new ThreeObject(cube);
floor.receiveShadow = true;
icosahedron.receiveShadow = true;
scene.add(icosahedron, cube, floor);

let lastTime = 0;
let deltaTime = 0;
let fps = 0;

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

function loop(time: any) {

  deltaTime = (time - lastTime ) / 1000;
  fps = 1 / deltaTime;
  fpsCounter.innerHTML = fps.toFixed(3);
  lastTime = time;

  requestAnimationFrame(loop);


  icosahedron.rotateX(0.05);
  controls.update();

  stars.forEach((star) => { 
    star.position.set(star.position.x + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    star.position.y + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    star.position.z + THREE.MathUtils.randFloatSpread(starShakeSpread), 
    ) 
  })

  renderer.render(scene, camera);
}

// @ts-ignore
loop(); 
