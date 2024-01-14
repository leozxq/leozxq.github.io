<template>
  <div ref="guiControl"></div>
  <router-link to="/">Home</router-link>
</template>
<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import gsap from "gsap";
import GUI from "lil-gui";
import CANNON from "cannon";

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

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#1b1132");
const scene = new THREE.Scene();
// fog build
// const fog = new THREE.Fog(0x1b1132, 0, 20);
// scene.fog = fog;

const textureLoader = new THREE.TextureLoader();
const glassFrontBackColorTexture = textureLoader.load("/img/glass.JPG");

// glass geometry build
const tankGroup = new THREE.Group();
const frontBack = new THREE.BoxGeometry(6, 4, 0.06);
const leftRight = new THREE.BoxGeometry(0.06, 4, 4);
const end = new THREE.BoxGeometry(6, 0.06, 4);
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xadd8e6, // 浅蓝色，像玻璃的颜色
  transparent: true,
  opacity: 0.3, // 半透明
  // map: glassFrontBackColorTexture,
});
const mesh1 = new THREE.Mesh(frontBack, glassMaterial);
mesh1.position.z = 2;
const mesh2 = new THREE.Mesh(frontBack, glassMaterial);
mesh2.position.z = -2;
const mesh3 = new THREE.Mesh(leftRight, glassMaterial);
mesh3.position.x = -3;
const mesh4 = new THREE.Mesh(leftRight, glassMaterial);
mesh4.position.x = 3;
const mesh5 = new THREE.Mesh(end, glassMaterial);
mesh5.position.y = -2;
tankGroup.add(mesh1, mesh2, mesh3, mesh4, mesh5);
tankGroup.castShadow = true;
tankGroup.receiveShadow = true;
// plane geometry build
const planeGeometry = new THREE.PlaneGeometry(8, 8);
const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
  color: 0x3cfb3c,
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
planeMesh.position.y = -2;
planeMesh.rotateX(Math.PI / 2);
planeMesh.receiveShadow = true;
scene.add(tankGroup, planeMesh);

// CANNON tank
const frontBackShape = new CANNON.Box(new CANNON.Vec3(3, 2, 0.03));
const leftRightShape = new CANNON.Box(new CANNON.Vec3(0.03, 2, 2));
const endShape = new CANNON.Box(new CANNON.Vec3(3, 0.03, 2));
const frontBody = new CANNON.Body({
  mass: 0,
  shape: frontBackShape,
  material: defaultMaterial,
});
frontBody.position.z = 2;

const backBody = new CANNON.Body({
  mass: 0,
  shape: frontBackShape,
  material: defaultMaterial,
});
backBody.position.z = -2;

const leftBody = new CANNON.Body({
  mass: 0,
  shape: leftRightShape,
  material: defaultMaterial,
});
leftBody.position.x = -3;

const rightBody = new CANNON.Body({
  mass: 0,
  shape: leftRightShape,
  material: defaultMaterial,
});
rightBody.position.x = 3;

world.addBody(frontBody);
world.addBody(backBody);
world.addBody(leftBody);
world.addBody(rightBody);

// Floor
const floorShape = new CANNON.Plane(8, 8);
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.position.y = -2;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// small ball build
const smallBallGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const smallBallMaterial = new THREE.MeshStandardMaterial({ color: 0x3d81f0 });
for (let i = 0; i < 300; i++) {
  const meshBall = new THREE.Mesh(smallBallGeometry, smallBallMaterial);
  meshBall.castShadow = true;
  meshBall.position.x = (Math.random() - 0.5) * 15;
  meshBall.position.y = (Math.random() - 0.5) * 15;
  meshBall.position.z = (Math.random() - 0.5) * 15;
  scene.add(meshBall);
}
// light build
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
scene.add(spotLight);
// ambient light
const ambient = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambient);
const directionLight = new THREE.DirectionalLight(0xffffff, 5);
directionLight.position.set(0, 1, 5);
directionLight.target = tankGroup;
directionLight.castShadow = true;
scene.add(directionLight);
scene.add(ambient);
// all helper
const cameraHelper = new THREE.CameraHelper(directionLight.shadow.camera);
const axesHelper = new THREE.AxesHelper(2);
cameraHelper.visible = false;
scene.add(cameraHelper, axesHelper);
// camera build
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(4, 3, 9);
camera.lookAt(tankGroup.position);
renderer.render(scene, camera);
// GUI build
const gui = new GUI();
const glassFolder = gui.addFolder("glass");
const spotLightFolder = gui.addFolder("spotLight");
const planeFolder = gui.addFolder("plane");
const physicsFolder = gui.addFolder("physics");
const debugObject = {};
debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 4,
    z: (Math.random() - 0.5) * 3,
  });
};
debugObject.createBox = () => {
  createBox(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5, {
    x: (Math.random() - 0.5) * 3,
    y: 4,
    z: (Math.random() - 0.5) * 3,
  });
};
// const rendererFolder = gui.addFolder("renderer");
// glassFolder.close();
glassFolder.add(tankGroup.position, "x", -3, 3, 0.01);
glassFolder.add(glassMaterial, "wireframe");
glassFolder.addColor(glassMaterial, "color");
glassFolder.add(glassMaterial, "opacity").min(0).max(1).step(0.001);
glassFolder.add(glassMaterial, "metalness").min(0).max(1).step(0.001);
glassFolder.add(glassMaterial, "roughness").min(0).max(1).step(0.001);
planeFolder.addColor(planeMaterial, "color").name("MaterialColor");
spotLightFolder.add(cameraHelper, "visible");
spotLightFolder.addColor(spotLight, "color").name("spotLightColor");

physicsFolder.add(debugObject, "createSphere");
physicsFolder.add(debugObject, "createBox");
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
  color: "#ff0000",
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
// adjust window size automatic
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
// appendChild for DOM
const guiControl = ref();
onMounted(() => {
  const controls = new OrbitControls(camera, guiControl.value);
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
      object.mesh.quaternion.copy(object.body.quaternion);
    }
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  guiControl.value.appendChild(renderer.domElement);
});
</script>
