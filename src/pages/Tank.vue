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

const loadingManager = new THREE.LoadingManager();
const textureloader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envTexture = cubeTextureLoader
  .setPath("/img/")
  .load([
    "OIP-C.jpg",
    "OIP-C.jpg",
    "OIP-C.jpg",
    "OIP-C.jpg",
    "OIP-C.jpg",
    "OIP-C.jpg",
  ]);
const texture = textureloader.load("/img/1.png");

// texture.center.x = Math.PI / 4;
// texture.repeat.x = 2;
// texture.repeat.y = 3;
// texture.wrapS = THREE.MirroredRepeatWrapping;
// texture.wrapT = THREE.MirroredRepeatWrapping;
const scene = new THREE.Scene();
const tankGroup = new THREE.Group();
const geometry2 = new THREE.SphereGeometry(0.1, 16, 16);
const material2 = new THREE.MeshPhongMaterial();
const geoFront = new THREE.BoxGeometry(6, 4, 0.06);

const geoback = new THREE.BoxGeometry(6, 4, 0.06);
const geoLeft = new THREE.BoxGeometry(0.06, 4, 4);

const geoRight = new THREE.BoxGeometry(0.06, 4, 4);

const geoEnd = new THREE.BoxGeometry(6, 0.06, 4);

const material = new THREE.MeshBasicMaterial({
  color: 0xadd8e6, // 浅蓝色，像玻璃的颜色
  transparent: true,
  opacity: 0.2, // 半透明
});
// material.map = texture;
// material.envMap = envTexture;
// material.envMapIntensity = 1.0;
const mesh1 = new THREE.Mesh(geoFront, material);
mesh1.position.z = 2;
const mesh2 = new THREE.Mesh(geoback, material);
mesh2.position.z = -2;
const mesh3 = new THREE.Mesh(geoLeft, material);
mesh3.position.x = -3;
const mesh4 = new THREE.Mesh(geoRight, material);
mesh4.position.x = 3;
const mesh5 = new THREE.Mesh(geoEnd, material);
mesh5.position.y = -2;
const meshBall = new THREE.Mesh(geometry2, material2);
tankGroup.add(mesh1, mesh2, mesh3, mesh4, mesh5);
scene.add(tankGroup, meshBall);
const pointLight = new THREE.PointLight(0xffffff, 1000, 2000.0);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

for (let i = 0; i < 300; i++) {
  const meshball = new THREE.Mesh(geometry2, material2);
  meshball.position.x = (Math.random() - 0.5) * 15;
  meshball.position.y = (Math.random() - 0.5) * 15;
  meshball.position.z = (Math.random() - 0.5) * 15;
  scene.add(meshball);
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  1000
);
camera.position.set(4, 3, 9);
camera.lookAt(mesh5.position);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(window.devicePixelRatio);
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});
const gui = new GUI();
gui.add(tankGroup.position, "x", -3, 3, 0.01);
// gui.add(material, "metalness").min(0).max(1).step(0.001);
// gui.add(mesh, "visible");
gui.add(material, "wireframe");
gui.addColor(material, "color");
gui.add(material, "opacity").min(0).max(1).step(0.001);
// gui.add(material, "roughness").min(0).max(1).step(0.001);
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
