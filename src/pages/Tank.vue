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

let lightHelper;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
// glass geometry build
const tankGroup = new THREE.Group();
const frontBack = new THREE.BoxGeometry(6, 4, 0.06);
const leftRight = new THREE.BoxGeometry(0.06, 4, 4);
const end = new THREE.BoxGeometry(6, 0.06, 4);
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xadd8e6, // 浅蓝色，像玻璃的颜色
  transparent: true,
  opacity: 0.2, // 半透明
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
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
// all helper
const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
const axesHelper = new THREE.AxesHelper(2);
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

// adjust window size automatic
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
// appendChild for DOM
const guiControl = ref();
onMounted(() => {
  const controls = new OrbitControls(camera, guiControl.value);
  controls.enableDamping = true;
  const ticks = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  guiControl.value.appendChild(renderer.domElement);
});
</script>
