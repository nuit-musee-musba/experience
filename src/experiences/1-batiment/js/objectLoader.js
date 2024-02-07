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

    this.animations.forEach((animation) => {
      const action = this.mixer.clipAction(animation);
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
      action.startAt(0);

      this.actions.push(action);
    });
  }

  play() {
    // console.log(animation.startAt);
    console.log("try to play");
    this.actions.forEach((action) => {
      action.play();
    });
    console.log("should have played");
  }

  update(time) {
    this.mixer.update(time);
  }
}
