<script setup>
import { ref } from "vue";
import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 三维场景
const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);
// 模型对象
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial({
    color: "#0000ff",
  })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 2, 1),
  new THREE.MeshNormalMaterial({
    color: "#ff00ff",
  })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial({
    color: "#00ff00",
  })
);
group.add(cube1);
// group.add(cube2);
// group.add(cube3);
cube1.position.x = 0;
cube2.position.x = -2;
cube3.position.x = 2;
group.position.y = 0;
// mesh.scale.x = 2;
// mesh.rotation.reorder("YXZ");

// mesh.rotation.y = Math.PI / 4;
// mesh.rotation.x = Math.PI / 4;
// mesh.position.set(2, 1, 1);

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
const sizes = ref({});
sizes.value.width = window.innerWidth;
sizes.value.height = window.innerHeight;
// const width = window.innerWidth; //宽度
// const height = window.innerHeight; //高度
// 相机

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.value.width / sizes.value.height,
  1,
  3000
);
camera.position.set(0, 0, 4);
camera.lookAt(group.position);
// WebGL渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.value.width, sizes.value.height);
renderer.render(scene, camera);
renderer.setPixelRatio(window.devicePixelRatio);
// const cursor = { x: 0, y: 0 };
// window.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / width - 0.5;
//   cursor.y = -(e.clientY / height - 0.5);
// });
// const clock = new THREE.Clock();
// gsap.to(group.rotation, { duration: 10, delay: 1, y: 20 });
// gsap.to(group.position, { duration: 1, delay: 1, y: 0 });

//three.js执行渲染命令会输出一个canvas画布(HTML元素)，你可以插入到web页面中
window.addEventListener("resize", () => {
  sizes.value.width = window.innerWidth;
  sizes.value.height = window.innerHeight;
  camera.aspect = sizes.value.width / sizes.value.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.value.width, sizes.value.height);
});
const pict = ref();
onMounted(() => {
  const controls = new OrbitControls(camera, pict.value);
  controls.enableDamping = true;
  const roll = () => {
    // const elapsedTime = clock.getElapsedTime();
    // group.rotation.x = elapsedTime;
    // camera.position.x = Math.sin(cursor.x * 10) * 5;
    // camera.position.z = Math.cos(cursor.x * 10) * 5;
    // camera.lookAt(group.position);
    controls.update();
    renderer.render(scene, camera);

    window.requestAnimationFrame(roll);
  };
  roll();
  pict.value.appendChild(renderer.domElement);
});
</script>

<template>
  <div ref="pict"></div>
</template>

<style scoped></style>
