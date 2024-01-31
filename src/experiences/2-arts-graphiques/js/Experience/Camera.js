import * as THREE from 'three'
import Experience from "./Experience.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import EventEmitter from './Utils/EventEmitter.js'

export default class Camera extends EventEmitter{
  constructor(){
    super()
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    // this.setOrbitControls()
  }

  setInstance(){
    this.instance = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.instance.position.set(0, 0, 3)
    this.scene.add(this.instance)
  }

  setOrbitControls(){
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize(){
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update(){
    this.controls.update()
  }
}
