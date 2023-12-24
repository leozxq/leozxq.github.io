<template>
  <div>
    <section class="section">My Template1</section>
    <section class="section">My Template2</section>
    <section class="section">My Template3</section>
    <section class="webgl" ref="scroll"></section>
  </div>
</template>
<script setup>
import * as THREE from "three";
import { ref, onMounted } from "vue";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

const parameters = {
  materialColor: 0xffeded,
};
const gui = new GUI();

// scene
const scene = new THREE.Scene();

//Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearAlpha(0.5);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(6, 6, 9);

renderer.render(scene, camera);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const kube = () => {
  const kubeGeometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshBasicMaterial({
    color: parameters.materialColor,
  });
  const kubeMesh = new THREE.Mesh(kubeGeometry, material);
  scene.add(kubeMesh);
};
kube();
gui.addColor(parameters, "materialColor").onFinishChange(kube);
camera.lookAt(0, 0, 0);
const scroll = ref();
onMounted(() => {
  //   const controls = new OrbitControls(camera, scroll.value);
  //   controls.enableDamping = true;
  const ticks = () => {
    // controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(ticks);
  };
  ticks();
  scroll.value.appendChild(renderer.domElement);
});
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
html {
  background: #1e1a20;
}
.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}

.section {
  display: flex;
  align-items: center;
  height: 100vh;
  position: relative;
  font-family: "Cabin", sans-serif;
  color: #ffeded;
  text-transform: uppercase;
  font-size: 7vmin;
  padding-left: 10%;
  padding-right: 10%;
}
section:nth-child(odd) {
  justify-content: flex-end;
}
</style>
