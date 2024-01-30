import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';





const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()


const ambientLight = new THREE.AmbientLight('#ffffff', 2)

const directionalLight = new THREE.DirectionalLight('#FFE7AF', 2)


scene.add(ambientLight, directionalLight)

// GUI
// gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)

const gltfLoader = new GLTFLoader();

// let mixer = null

// let positionsCube = []
// gltfLoader.load(
//     './assets/move.glb',
//     (gltf) =>
//     {
//         // gltf.scene.scale.set(0.03, 0.03, 0.03)
//         scene.add(gltf.scene)

//         mixer = new THREE.AnimationMixer(gltf.scene)
//         const action = mixer.clipAction(gltf.animations[0])
//         action.play()

        
//         gltf.animations[0].tracks.forEach((track) => {
//             if (track.name.includes('.position')) { // Check if the track is a position track
//                 for (let i = 0; i < track.values.length; i += 3) { // Each position is represented by 3 values (x, y, z)
//                     positionsCube.push({
//                         x: track.values[i],
//                         y: track.values[i + 1],
//                         z: track.values[i + 2]
//                     })
//                 }
//             }
//         })

//     }
// )


//MATERIALS


gltfLoader.load('./assets/ANCIEN_MUSEE.glb', (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // child.material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
      }
    });
    scene.add(gltf.scene);
    gltf.scene.rotation.y = -1.25;
  });







const step = [{position: {x: 0, y: 0, z: 2} , name: '1'}, {position: {x: 4, y: 1, z: 2}, name: '2'}, {position: {x: 9, y: 2, z: 9}, name: '3'}];



// SIZES
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})


// CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.2, 100)
camera.position.set(2, 6, 2)
scene.add(camera)



// CONTROLS CAMERA
const controls = new OrbitControls(camera, canvas)


const getCameraPositionForTarget = (position) => {
    return { x: position.x + 0, y: position.y +1, z: position.z + 1 };
}

let index = 0;

const nextStep = () => {
    if (index >= step.length) {
        return;
    }
    index++;
    lookAtStep(step[index]);
};

const prevStep = () => {
    if (index <= 0) {
        return;
    }
    index--;
    lookAtStep(step[index]);
};

document.getElementById('prevButton').addEventListener('click', prevStep);
document.getElementById('nextButton').addEventListener('click', nextStep);

function lookAtStep(step){
    if (!step) {
        return;
    }

    const targetPosition = step.position;

    const cameraPosition = getCameraPositionForTarget(targetPosition);


   

    gsap.to(controls.step, {
        duration: 1,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z
    });

    gsap.to(controls.object.position, {
        duration: 1,
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z
    });
}

console.log(step[index])
console.log(index)


const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#ffffff')

let previousTime = 0

let time = 0;
const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    time += 0.1; 

    // if(mixer)
    // {
    //     mixer.update(deltaTime)
    // }


    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();