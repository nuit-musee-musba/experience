import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Create scene
const scene = new THREE.Scene();

// Target canvas
var canvas = document.getElementById("webgl");

// Create camera
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 10);


// Create Renderer
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);

// // Add renderer to DOM
document.body.appendChild(renderer.domElement);

// // Axes Helper
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

// Fog
scene.fog = new THREE.Fog('#a79', 8.5, 12);

// Create/Add Rig, this is the whole group that will be rotated.
const rig = new THREE.Group();
scene.add(rig);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
// controls.rotateSpeed = 0.35;

// // Limit vertical rotation (up and down)
// controls.minPolarAngle = Math.PI / 2; // Minimum angle in radians (looking down)
// controls.maxPolarAngle = Math.PI / 2; // Maximum angle in radians (looking up)

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Carousel
const carousel = new THREE.Group();
carousel.rotation.set(Math.PI  / 5, 0 , 0); //(i / count) * Math.PI * 2

const radius = 1.4;
const count = 5;

for (let i = 0; i < count; i++) {
  const world = createWorld(i , 5, 1 ); //${Math.floor(i % 10) + 1}
  console.log("world", world.position);
  carousel.add(world);
}

scene.add(carousel);



// Mouse move event
var onMouseClick = (event) => {
    // console.log('onMouseMove', event);
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1; // -1 to 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; // -1 to 1
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (const intersect of intersects) {
      if (intersect.object.type === 'Mesh') {
        console.log('intersect mesh', intersect);
        intersect.object.material.color.set('#f00000');
        // Click event
        handleCardClick('/experiences/1-batiment/index.html');
  
      }
    }
}
// window.addEventListener('mousemove', onMouseMove);

// Chose documet over window as it is more performant
document.addEventListener('click', onMouseClick);


// TODO: Fix this to enable 'infinitely' scrolling
document.addEventListener('scroll', () => {
    carousel.rotation.y = -window.scrollY * (Math.PI * 2) / window.innerWidth;
});


// Render loop
const animate = () => {
  requestAnimationFrame(animate);

  // Handle scrolling
  rig.rotation.z = -window.scrollY * (Math.PI * 2) / window.innerHeight;

  // Render the scene
  renderer.render(scene, camera);

};

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// World
function  createWorld ( i, count , radius , ...props)  {
  console.log('WORLD CONTROL index ', i);
  var url = 'public/img1.jpg';
  const plane = createPlane(url, ...props);
  for (let i = 0; i < count; i++) {
    const box = new Box(i, radius);
    plane.add(box);
  };

  const world = new THREE.Group();
  console.log('WORLD CONTROL CREATED ', world);
  world.position.set(Math.sin((i / count) * Math.PI * 2) * radius, 0, Math.cos((i / count) * Math.PI * 2) * radius);
  console.log('WORLD CONTROL POSITION ', world.position);
  world.add(plane);
  console.log('WORLD CONTROL PLANE CREATED ', plane);
  return (
    // <group {...props}>
    //   <Plane />
    //   {Array.from({ length: count }, (_, i) => (
    //     <Box
    //       key={i}
    //       position={[Math.sin((i / count) * Math.PI * 2) * radius/2.5, .1, Math.cos((i / count) * Math.PI * 2) * radius /2.5]}
    //     />
    //   ))}
    // </group>
    world
  );
}

function createPlane(url , ...props ) {
  const geometry = new THREE.BoxGeometry(.5, .1, .5);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });
    
    const plane = new THREE.Mesh(geometry, material);
    const textureLoader = new THREE.TextureLoader();
    
    const texture = textureLoader.load(url);
    material.map = texture;

  return ( plane );
}


function Box(index, radius) {
    const geometry = new THREE.BoxGeometry(.1, .1, .1);
    const material = new THREE.MeshBasicMaterial({
      color:"red" ,
      side: THREE.DoubleSide,
      transparent: true,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.sin((index / count) * Math.PI * 2) * radius/3, .1, Math.cos((index / count) * Math.PI * 2) * radius /3);
    // const textureLoader = new THREE.TextureLoader();
    // const texture = textureLoader.load(url);
    // material.map = texture;

    // Add event listeners
    mesh.addEventListener('pointerover', () => hover(true));
    mesh.addEventListener('pointerout', () => hover(false));
    console.log('mesh', mesh);
  
    // Animations
    const hover = (isHovered) => {
      const targetScale = isHovered ? 1.15 : 1;
      const targetRadius = isHovered ? 0.25 : 0.1;
      const targetZoom = isHovered ? 1 : 1.5;
  
      easing(mesh.scale, targetScale, 0.1);
      easing(material, 'radius', targetRadius, 0.2);
      easing(material, 'zoom', targetZoom, 0.2);
    };
  
    return mesh;
  }
  function handleCardClick(url) {
    console.log('Clicked on card', url);
    // Redirect to the specified URL
     window.location.href = url;

  }
  
  
