import * as THREE from "three";
import gsap from "gsap";
import { period } from "./period";
import { enableInactivityRedirection } from "/global/js/inactivity.ts";

import {
  renderer,
  camera,
  controls,
  scene,
  animatedScenes,
  cube,
} from "./scene.js";

const sceneSetUp = async () => {
  document.oncontextmenu = function () {
    return false;
  };

  const clock = new THREE.Clock();
  let index = 0;
  let previousTime = 0;
  let isShowingText = false;
  const raycaster = new THREE.Raycaster();

  enableInactivityRedirection();

  const getCameraPositionForTarget = (position) => {
    return { x: position.x + 0, y: position.y + 3, z: position.z + 1 };
  };

  //MOUSE

  const mouse = new THREE.Vector2();

  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object === cube) {
        showText();
        break;
      } else {
        hideText();
      }
    }
  }

  // let restetDeltaTime = false;

  // window.addEventListener("click", (event) => {
  //   restetDeltaTime = true;
  // });

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    animatedScenes.forEach((animatedScene) => {
      animatedScene.update(deltaTime);
    });

    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  const endMenu = document.getElementById("end-menu");
  const component = document.getElementById("component");

  // const audioContent = document.getElementById("audio-content");
  // const audio = document.getElementById("audio");

  // let isAudioPlaying = false;

  // audioContent.addEventListener("click", () => {
  //   if (isAudioPlaying) {
  //     audio.src = "./assets/icons/audio.svg";
  //   } else {
  //     audio.src = "./assets/icons/audioNone.svg";
  //   }

  //   isAudioPlaying = !isAudioPlaying;
  // });

  const restart = () => {
    index = 0;
    handleFocusPeriod(period[index]);
    endMenu.style.display = "none";
  };

  const showText = () => {
    isShowingText = true;
    component.style.display = "flex";
  };

  const hideText = () => {
    isShowingText = false;
    component.style.display = "none";
  };
  window.addEventListener("click", onMouseClick, false);
  window.addEventListener("mousedown", hideText(), false); // Doesnt work wtf

  const toggleInfo = () => {
    if (!isShowingText) {
      showText();
      return;
    }
    if (isShowingText) {
      hideText();
      return;
    }
  };

  const nextStep = () => {
    if (index + 1 < period.length) {
      index++;
      handleFocusPeriod(period[index]);
    } else {
      endMenu.style.display = "flex";
    }
  };

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`period${i}`).addEventListener("click", () => {
      index = i - 1;
      handleFocusPeriod(period[i - 1]);
    });
  }

  function handleFocusPeriod(step) {
    if (!step) {
      return;
    }

    animatedScenes[index].play();

    const dateTitleElement = document.getElementById("date-title");
    dateTitleElement.textContent = "";

    dateTitleElement.appendChild(document.createTextNode(step.date));

    const selectedButtonId = `period${index + 1}`;

    document.getElementById(selectedButtonId).style.fontSize = "8rem";

    for (let i = 1; i <= period.length; i++) {
      if (i - 1 !== index) {
        document.getElementById(`period${i}`).style.fontSize = "4rem";
      }
    }

    const targetPosition = step.position;

    const cameraPosition = getCameraPositionForTarget(targetPosition);

    document.getElementById("title-component").textContent = step.title;
    document.getElementById("text-component").innerHTML = step.description
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");

    cube.position.set(
      step.cubePosition.x,
      step.cubePosition.y,
      step.cubePosition.z
    );

    // camera.lookAt(cube.position);

    cube.cursor = "pointer";

    const rayOrigin = new THREE.Vector3(camera.position);
    const rayDirection = new THREE.Vector3(cube.position);
    raycaster.set(rayOrigin, rayDirection);
    rayDirection.normalize();

    raycaster.setFromCamera(mouse, camera);

    cube.material.color.set("#0000ff");

    gsap.to(controls.step, {
      duration: 1,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    });

    // controls.target = cube.position;

    gsap.to(controls.object.position, {
      duration: 1,
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
    });
  }
  handleFocusPeriod(period[index]);

  document.getElementById("restart-button").addEventListener("click", restart);
  // document.getElementById("nextButton").addEventListener("click", nextStep);
  // document.getElementById("interestButton").addEventListener("click", toggleInfo);
  // controls.target = cube.position;
};

sceneSetUp();
