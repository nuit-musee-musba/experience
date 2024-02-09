import * as THREE from "three";

export class ObjectLoader {
  mixer = null;
  gltf = null;
  animations = [];
  actions = [];

  constructor(gltf) {
    this.gltf = gltf;
    this.mixer = new THREE.AnimationMixer(gltf.scene);
    this.animations = this.gltf.animations;

    this.setup();
  }

  setup() {
    this.animations.forEach((animation) => {
      const action = this.mixer.clipAction(animation);
      //action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
      //action.startAt(0);
      action.enabled = true;

      this.actions.push(action);
    });
  }

  resetAnimations() {
    this.actions.forEach((action) => {
      action.reset();
    });
  }

  // method to have the final state of the animation
  finalState() {
    this.actions.forEach((action) => {
      // Start the animation
      action.play();

      // Skip to the end of the animation
      action.time = action.getClip().duration;
    });
  }

  play() {
    if (this.isPlayed) {
      return;
    }
    this.isPlayed = true;
    this.mixer.timeScale = 1;

    this.actions.forEach((action) => {
      action.reset();
      action.play();
      action.timeScale = 1;
    });
  }

  reverse() {
    if (!this.isPlayed) {
      return;
    }
    this.actions.forEach((action) => {
      action.paused = false;
      action.timeScale = -1;
      action.setLoop(THREE.LoopOnce);
      action.play();
    });
    this.isPlayed = false;
  }

  update(time) {
    this.mixer.update(time);
  }
}
