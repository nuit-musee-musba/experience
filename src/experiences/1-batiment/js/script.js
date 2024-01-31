import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { period } from './period';




const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()


const ambientLight = new THREE.AmbientLight('#ffffff', 0.8)

const directionalLight = new THREE.DirectionalLight('#EBF5F6', 3)
// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLight.position.set(1, 3, 4)
directionalLight.lookAt(4, 2, 4)

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







// const periodCameraPosition = period.map((step) => {return step.position});


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
const endMenu = document.getElementById('end-menu');

const restart = () => {
    index = 0;
    handleFocusPeriod(period[index]);
    endMenu.style.position = "relative";
}

document.getElementById('restart-button').addEventListener('click', restart);

const nextStep = () => {
    if ((index + 1) < period.length) {
        index++;
        handleFocusPeriod(period[index]);
        console.log(index);
    } else {
        endMenu.style.position = "absolute";
    }
};

const prevStep = () => {
    if (index <= 0) {
        return;
    }
    index--;
    handleFocusPeriod(period[index]);
};

endMenu.addEventListener('click', nextStep);
document.getElementById('prevButton').addEventListener('click', prevStep);
document.getElementById('nextButton').addEventListener('click', nextStep);

for (let i = 1; i <= 4; i++) {
    document.getElementById(`period${i}`).addEventListener('click', () => {
      handleFocusPeriod(period[i - 1]); 
      index = i - 1;
    });
  }


function handleFocusPeriod(step){
    if (!step) {
        return;
    }

    const targetPosition = step.position;

    const cameraPosition = getCameraPositionForTarget(targetPosition);


    document.getElementById("title-component").textContent = step.title;
    document.getElementById("text-component").innerHTML = step.description.map(paragraph => `<p>${paragraph}</p>`).join('');
   


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
handleFocusPeriod(period[index])



const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#808E90')

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