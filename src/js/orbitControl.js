import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";

window.experience = window.experience || {};

const { camera, canvas } = window.experience;
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 1;
controls.enableZoom = false;
controls.enablePan = false;

function focusOnCurrentIsland() {
  gsap.to(controls.target, {
    duration: 0.5,
    x: 0,
    y: 0.15,
    z: -0.52,
    onUpdate: controls.update.bind(controls),
  });
}

function update() {
  if (window.experience.canRotate) {
    controls.enabled = false;
  } else {
    controls.enabled = true;
    controls.minAzimuthAngle = Math.PI * -1.2;
    controls.maxAzimuthAngle = Math.PI * 1.2;
    controls.minPolarAngle = Math.PI * 0.42;
    controls.maxPolarAngle = Math.PI * 0.48;
    focusOnCurrentIsland();
  }
  controls.update();
}

const animate = () => {
  requestAnimationFrame(animate);
  update();
};

animate();
