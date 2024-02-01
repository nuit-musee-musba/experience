import * as THREE from "three";

import Camera from "./Camera";
import Time from "./Utils/Time";
import sources from "./sources";
import Sizes from "./Utils/Sizes";
import World from "./World/World";
import Renderer from "./Renderer";
import Animation from "./Animation";
import Resources from "./Utils/Resources";
import Transition from "./Utils/Transitions";

let instance: Experience | null = null;

type TWindow = Window & typeof globalThis & { experience?: Experience };

export default class Experience {
  canvas?: HTMLCanvasElement;
  sizes: Sizes;
  scene: THREE.Scene;
  resources: Resources;
  camera: Camera;
  renderer: Renderer;
  world: World;
  time: Time;
  animation: Animation;
  window: TWindow = window;
  transition: Transition;

  constructor(canvas?: HTMLCanvasElement) {
    if (instance) {
      return instance;
    }

    instance = this;

    // Global access
    this.window.experience = this;

    // Options
    if (canvas) {
      this.canvas = canvas;
    }

    // Setup
    this.sizes = new Sizes();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    this.time = new Time();
    this.animation = new Animation();
    this.transition = new Transition();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    // this.camera.update()
    this.renderer.update();
  }
}
