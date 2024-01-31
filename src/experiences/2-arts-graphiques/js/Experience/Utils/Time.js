import EventEmitter from './EventEmitter'
import Experience from "../Experience";

export default class Time extends EventEmitter{
  constructor(){
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16
    this.experience = new Experience()
    this.camera = this.experience.camera
    this.resources = this.experience.resources


    window.requestAnimationFrame(() => {
        this.tick()
    })
  }

  tick(){
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    this.trigger('tick')

    window.requestAnimationFrame(()=> {
      this.tick()
    })
  }
}
