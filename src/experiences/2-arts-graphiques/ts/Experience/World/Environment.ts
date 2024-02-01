import * as THREE from "three";
import Experience from "../Experience.js";

export default class Environment {
  experience: Experience;
  scene: Experience["scene"];
  ressources: Experience["resources"];
  ambientLight: THREE.AmbientLight;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.resources;

    this.setAmbiantLight();
  }

  setAmbiantLight() {
    this.ambientLight = new THREE.AmbientLight("#ffffff", 1);
    this.scene.add(this.ambientLight);
  }
}
