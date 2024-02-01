import Experience from "./Experience";
import EventEmitter from "./Utils/EventEmitter";

export default class Animation extends EventEmitter {
  experience: Experience;
  camera: Experience["camera"]["instance"];
  sizes: Experience["sizes"];

  constructor() {
    super();

    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.sizes = this.experience.sizes;
  }
}
