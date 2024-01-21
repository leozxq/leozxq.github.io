<template>
  <div ref="physics"></div>
  <div @click="reset">restart</div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { ref, onMounted, render } from "vue";
import * as CANNON from "cannon-es";

// Loaders
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

//scene
const scene = new THREE.Scene();

// Environment Map
const environmentMap = cubeTextureLoader.load([
  "/img/map1/px.png",
  "/img/map1/nx.png",
  "/img/map1/py.png",
  "/img/map1/ny.png",
  "/img/map1/pz.png",
  "/img/map1/nz.png",
]);
console.log(environmentMap);
scene.background = environmentMap;

//GUI
const gui = new GUI();
// Models
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  console.log(gltf);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  scene.add(gltf.scene);
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("ratation");
});

// Lights
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

// GUI
const lightFolder = gui.addFolder("light");
lightFolder
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
lightFolder
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
lightFolder
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
lightFolder
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");
//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// camera build
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 3, 9);
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
// camera.lookAt(tankGroup.position);
renderer.render(scene, camera);
// adjust window size automatic
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
let oldElapsedTime = 0;
// appendChild for DOM
const physics = ref();
onMounted(() => {
  const controls = new OrbitControls(camera, physics.value);
  controls.enableDamping = true;
  const ticks = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  physics.value.appendChild(renderer.domElement);
});
const reset = () => {};
</script>
