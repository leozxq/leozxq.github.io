<template>
  <div ref="physics"></div>
  <div @click="reset">restart</div>
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
// Materials
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.position.y = -2;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// floor geometry build
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.4,
    roughness: 0.4,
  })
);
floor.position.y = -2;
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

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

const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 2,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.createBox = () => {
  createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 3,
    z: (Math.random() - 0.5) * 3,
  });
};
const planeFolder = gui.addFolder("plane");
planeFolder.addColor(parameters, "color").onChange();
const sphereFolder = gui.addFolder("sphere");
sphereFolder.add(debugObject, "createSphere");
sphereFolder.add(debugObject, "createBox");
//renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
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

// Utils
const objectsUpdate = [];
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.3,
  color: "#003300",
  // envMap: environmentMapTexture,
});
const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // CANNON Body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    // position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);
  // Save in objects to update
  objectsUpdate.push({
    mesh: mesh,
    body: body,
  });
};

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.9,
  roughness: 0.1,
  color: "#0033ff",
});
// const boxShap = new CANNON.Box(1);
const createBox = (width, height, depht, position) => {
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  mesh.scale.set(width, height, depht);
  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // CANNON body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depht / 2)
  );

  const body = new CANNON.Body({
    mass: 1,
    shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);
  objectsUpdate.push({
    mesh: mesh,
    body: body,
  });
};

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
    // sphereBody.applyForce(new CANNON.Vec3(1, 0, 0), sphereBody.position);
    world.step(1 / 60, deltaTime, 3);
    for (const object of objectsUpdate) {
      object.mesh.position.copy(object.body.position);
    }

    // sphere.position.copy(sphereBody.position);

    controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  physics.value.appendChild(renderer.domElement);
});
const reset = () => {};
</script>
