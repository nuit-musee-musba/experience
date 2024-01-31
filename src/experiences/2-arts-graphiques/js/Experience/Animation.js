import EventEmitter from './Utils/EventEmitter'
import Experience from "./Experience";

export default class Animation extends EventEmitter{
  constructor(){
    super()

    this.experience = new Experience();
    this.camera = this.experience.camera.instance
    this.sizes = this.experience.sizes;

  }
}
