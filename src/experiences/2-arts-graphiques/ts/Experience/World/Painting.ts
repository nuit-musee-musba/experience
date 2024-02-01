import { AnimationClip, AnimationMixer, Clock, LoopOnce, Scene } from "three";

import type Experience from "../Experience";
import type Resources from "../Utils/Resources";
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class Painting {
  experience: Experience;
  scene: Scene;
  resources: Resources;

  gltf: GLTF;
  animation: AnimationClip;

  hasAnimated: boolean = false;
  mixer: AnimationMixer;

  constructor(experience: Experience) {
    this.experience = experience;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setMesh();

    console.log(this.scene);
  }

  setMesh() {
    const gltf = this.experience.resources.items.painting;

    if ("scene" in gltf) {
      gltf.scene.scale.set(0.2, 0.2, 0.2);
      gltf.scene.rotateY(Math.PI);
      this.gltf = gltf;

      this.scene.add(this.gltf.scene);
    }
  }

  public animate() {
    if (this.hasAnimated) {
      return;
    }
    this.hasAnimated = true;

    this.mixer = new AnimationMixer(this.gltf.scene);
    this.animation = this.gltf.animations[0];
    const action = this.mixer.clipAction(this.animation);

    action.setLoop(LoopOnce, 0);
    action.clampWhenFinished = true;
    action.reset().play();

    const clock = new Clock();
    let previousTime = 0;

    this.experience.time.on("tick", () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      this.update(deltaTime);
    });
  }

  update(deltaTime: number) {
    this.mixer.update(deltaTime * 0.02);

    if (deltaTime > 5) {
      this.experience.time.off("tick");
    }
  }
}
