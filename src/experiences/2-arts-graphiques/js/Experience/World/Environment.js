import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.setAmbiantLight()
    }
    
    setAmbiantLight(){
      this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
      this.scene.add(this.ambientLight)
    }
}
