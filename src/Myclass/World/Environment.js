import * as THREE from "three";

import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    this.setEnvironmentMap();
    this.setGeometryMap();
  }
  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.position.set(3.55, 5, -2.25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.scene.add(this.sunLight);

    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .min(0)
        .max(10)
        .step(0.01)
        .name("sunLightIntensity");
    }
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunLight.position, "x")
        .min(-10)
        .max(10)
        .step(0.01)
        .name("sunLightX");
    }
  }
  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap.texture;
    // this.scene.background = this.environmentMap.texture;
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
          // child.castShadow = true;
          // child.receiveShadow = true;
        }
      });
    };

    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, "intensity")
        .min(0)
        .max(10)
        .step(0.01)
        .name("envMapIntersity")
        .onChange(this.environmentMap.updateMaterials);
    }
  }
  setGeometryMap() {
    this.geometryMap = {};
    this.geometryMap.texture = this.resources.items.brickNormalTexture;
    // this.world.testMesh.material.map = this.geometryMap.texture;
  }
}
