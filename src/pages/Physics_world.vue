<template>
  <div ref="physics"></div>
</template>
<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import { ref, onMounted, render } from "vue";
import * as CANNON from "cannon-es";
import Experience from "../Myclass/Experience.js";
const physics = ref(null);
onMounted(() => {
  const experience = new Experience(physics);
  physics.value.appendChild(experience.renderer.instance.domElement);
});
// appendChild for DOM
// onMounted(() => {
//   // Loaders
//   const gltfLoader = new GLTFLoader();
//   const cubeTextureLoader = new THREE.CubeTextureLoader();

//   //scene
//   const scene = new THREE.Scene();

//   const updateAllMaterials = () => {
//     scene.traverse((child) => {
//       if (
//         child instanceof THREE.Mesh &&
//         child.material instanceof THREE.MeshStandardMaterial
//       ) {
//         child.material.envMapIntensity = debugObject.envMapIntensity;
//         child.material.needsUpdate = true;
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//   };

//   // Environment Map
//   const environmentMap = cubeTextureLoader.load([
//     "/img/Standard-Cube-Map/px.png",
//     "/img/Standard-Cube-Map/nx.png",
//     "/img/Standard-Cube-Map/py.png",
//     "/img/Standard-Cube-Map/ny.png",
//     "/img/Standard-Cube-Map/pz.png",
//     "/img/Standard-Cube-Map/nz.png",
//   ]);
//   // environmentMap.outputColorSpace = THREE.SRGBColorSpace;
//   scene.background = environmentMap;
//   scene.environment = environmentMap;
//   //GUI
//   const gui = new GUI();
//   const debugObject = {};
//   debugObject.envMapIntensity = 2;
//   gui
//     .add(debugObject, "envMapIntensity")
//     .min(0)
//     .max(10)
//     .step(0.01)
//     .name("envMapIntensity")
//     .onChange(updateAllMaterials);
//   // Models
//   gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//     console.log(gltf);
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     scene.add(gltf.scene);
//     gui
//       .add(gltf.scene.rotation, "y")
//       .min(-Math.PI)
//       .max(Math.PI)
//       .step(0.001)
//       .name("ratation");
//     updateAllMaterials();
//   });

//   // Lights
//   const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
//   directionalLight.position.set(0.25, 5, -2.25);
//   directionalLight.castShadow = true;
//   directionalLight.shadow.camera.far = 15;
//   directionalLight.shadow.mapSize.set(1024, 1024);
//   directionalLight.shadow.normalBias = 0.05;
//   scene.add(directionalLight);

//   // const directionalLightCameraHelper = new THREE.CameraHelper(
//   //   directionalLight.shadow.camera
//   // );
//   // scene.add(directionalLightCameraHelper);

//   // GUI
//   const lightFolder = gui.addFolder("light");
//   lightFolder
//     .add(directionalLight, "intensity")
//     .min(0)
//     .max(10)
//     .step(0.001)
//     .name("lightIntensity");
//   lightFolder
//     .add(directionalLight.position, "x")
//     .min(-5)
//     .max(5)
//     .step(0.001)
//     .name("lightX");
//   lightFolder
//     .add(directionalLight.position, "y")
//     .min(-5)
//     .max(5)
//     .step(0.001)
//     .name("lightY");
//   lightFolder
//     .add(directionalLight.position, "z")
//     .min(-5)
//     .max(5)
//     .step(0.001)
//     .name("lightZ");

//   //renderer
//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.outputColorSpace = THREE.SRGBColorSpace;
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 1;
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//   gui
//     .add(renderer, "toneMapping", {
//       No: THREE.NoToneMapping,
//       Linear: THREE.LinearToneMapping,
//       Reinhard: THREE.ReinhardToneMapping,
//       Cineon: THREE.CineonToneMapping,
//       ACESFilmic: THREE.ACESFilmicToneMapping,
//     })
//     .onFinishChange(() => {
//       renderer.toneMapping = Number(renderer.toneMapping);
//       updateAllMaterials();
//     });
//   console.log("out", renderer.toneMapping);
//   gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);
//   // camera build
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     1,
//     1000
//   );
//   camera.position.set(4, 3, 9);
//   const axesHelper = new THREE.AxesHelper(2);
//   scene.add(axesHelper);
//   // camera.lookAt(tankGroup.position);
//   renderer.render(scene, camera);
//   // adjust window size automatic
//   window.addEventListener("resize", () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//   });

//   const clock = new THREE.Clock();
//   let oldElapsedTime = 0;
//   const controls = new OrbitControls(camera, physics.value);
//   controls.enableDamping = true;
//   const ticks = () => {
//     const elapsedTime = clock.getElapsedTime();
//     const deltaTime = elapsedTime - oldElapsedTime;
//     oldElapsedTime = elapsedTime;

//     controls.update();

//     renderer.render(scene, camera);
//     window.requestAnimationFrame(ticks);
//   };
//   ticks();
//   physics.value.appendChild(renderer.domElement);
// });
// const reset = () => {};
</script>
