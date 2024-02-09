import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Particles
 */
// Geometry
function generateParticles (){
    const particlesGeometry = new THREE.BufferGeometry()
    const count = 70

    const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)

    for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
    {
        positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.105,
        sizeAttenuation: true
    })

    // color 
    particlesMaterial.color = new THREE.Color('#FFF7E2')

    // Texture
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/4-lumiere/particles/particle.png')
    particlesMaterial.map = particleTexture
    particlesMaterial.alphaTest = 0.001
    particlesMaterial.depthTest = false
    particlesMaterial.depthWrite = false
    particlesMaterial.blending = THREE.AdditiveBlending

    // Points
    return new THREE.Points(particlesGeometry, particlesMaterial)

}

const particles1 = generateParticles();
scene.add(particles1)

const particles2 = generateParticles();
scene.add(particles2)

const particles3 = generateParticles();
scene.add(particles3)

const particles4 = generateParticles();
scene.add(particles4)

/**
 * Sizes canvas
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // __Update particles__
    particles1.position.x = Math.cos(elapsedTime/2) * 0.05
    particles1.position.y = Math.sin(elapsedTime/2) * 0.05
    particles1.position.z = Math.sin(elapsedTime/2) * 0.05

    particles2.position.x = Math.cos(elapsedTime/2) * -0.05
    particles2.position.y = Math.sin(elapsedTime/2) * -0.05
    particles2.position.z = Math.sin(elapsedTime/2) * -0.05

    particles3.position.x = Math.sin(elapsedTime/2) * 0.05
    particles3.position.y = Math.cos(elapsedTime/2) * -0.05
    particles3.position.z = Math.cos(elapsedTime/2) * 0.05

    particles4.position.x = Math.sin(elapsedTime/2) * -0.05
    particles4.position.y = Math.cos(elapsedTime/2) * 0.05
    particles4.position.z = Math.sin(elapsedTime/2) * -0.05
        
    // __Update controls__
    controls.update()

    // __Render__
    renderer.render(scene, camera)

    // __Call tick again on the next frame__
    window.requestAnimationFrame(tick)
}

tick()