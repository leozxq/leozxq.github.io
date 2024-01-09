<template>
  <div ref="physics"></div>
</template>
<script setup>
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { ref, onMounted } from "vue";
import CANNON from "cannon";
//scene
const scene = new THREE.Scene();
//parameters
const parameters = {};
parameters.color = "#3cfb3c";

//physics
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
// create sphere
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
});
world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.position.y = -2;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);
// Materials
const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");

// floor geometry build
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
  })
);
floor.position.y = -2;
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// test sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    color: "#bbbbbb",
    metalness: 0.3,
    roughness: 0.4,
  })
);
sphere.castShadow = true;
sphere.position.y = -1;
scene.add(sphere);
// Light
const spotLight = new THREE.SpotLight(0xffffff, 10);
spotLight.distance = 30;
spotLight.angle = Math.PI / 4;
spotLight.decay = 0;
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(1024, 1024);
spotLight.shadow.camera.near = 0.5; // default
spotLight.shadow.camera.far = 20; // default
spotLight.shadow.camera.fov = 50;
spotLight.shadow.focus = 1;
const directionLight = new THREE.DirectionalLight(0xffffff, 5);
directionLight.position.set(0, -3, 5);
directionLight.target = floor;
directionLight.castShadow = true;
scene.add(directionLight, spotLight);
// GUI
const gui = new GUI({ width: 200 });
const planeFolder = gui.addFolder("plane");
planeFolder.addColor(parameters, "color").onChange();
//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
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

    //update physics world
    world.step(1 / 60, deltaTime, 3);

    sphere.position.copy(sphereBody.position);

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  physics.value.appendChild(renderer.domElement);
});
</script>
