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
  loadModels,
  allPOI,
} from "./scene.js";
import { updateAllMaterials } from "./utils";

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
  let intersectedObjectName;
  function poiClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    let poiClicked = false;

    for (let i = 0; i < intersects.length; i++) {
      const intersectedObject = intersects[i].object;

      if (allPOI.flat().includes(intersectedObject)) {
        intersectedObjectName = intersectedObject.name;
        displayPOI(index);
        showText();
        poiClicked = true;
        break;
      }
    }

    if (!poiClicked) {
      hideText();
    }
  }

  const displayPOI = (index) => {
    for (let i = 0; i < allPOI.length; i++) {
      if (i !== index) {
        for (let j = 0; j < allPOI[i].length; j++) {
          allPOI[i][j].visible = false;
        }
      } else {
        for (let j = 0; j < allPOI[i].length; j++) {
          allPOI[index][j].visible = true;
          if (intersectedObjectName === (i + j).toString()) {
            document.getElementById("title-component").textContent =
              period[i].poiText[j].title;
            document.getElementById("text-component").innerHTML =
              period[i].poiText[j].text;
          }

          const position = period[i].poiPosition[j];
          allPOI[i][j].position.set(position.x, position.y, position.z);
        }
      }
    }
  };

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
  window.addEventListener("click", poiClick, false);
  window.addEventListener("mousedown", hideText(), false);

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

  const prevStep = () => {
    if (index - 1 >= 0) {
      index--;
      handleFocusPeriod(period[index]);
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
    document
      .getElementById(`periodButton${i}`)
      .addEventListener("click", () => {
        index = i - 1;
        handleFocusPeriod(period[i - 1]);
      });
  }

  const handleFocusPeriod = async (step) => {
    if (!step) {
      return;
    }
    await loadModels();
    displayPOI(index);

    updateAllMaterials();

    animatedScenes[index].play();

    const dateTitleElement = document.getElementById("date-title");
    dateTitleElement.textContent = "";

    dateTitleElement.appendChild(document.createTextNode(step.date));

    const selectedButtonId = `period${index + 1}`;
    const selectedPeriodButtonId = `periodButton${index + 1}`;
    const selectedButtonActive = `periodActive${index + 1}`;
    const selectedDashedButton = `dashed-border${index + 1}`;

    document.getElementById(selectedButtonId).style.fontSize = "8rem";
    document.getElementById(selectedButtonId).style.top = "-12rem";
    document.getElementById(selectedPeriodButtonId).style.width = "6rem";
    document.getElementById(selectedPeriodButtonId).style.height = "6rem";
    document.getElementById(selectedDashedButton).style.padding = "0.5rem";
    document.getElementById(selectedDashedButton).style.border =
      "5px dashed white";
    document.getElementById(selectedDashedButton).style.borderRadius = "100px";
    document.getElementById(selectedButtonActive).style.display = "block";

    for (let i = 1; i <= period.length; i++) {
      if (i - 1 !== index) {
        document.getElementById(`period${i}`).style.fontSize = "4rem";
        document.getElementById(`period${i}`).style.top = "-8rem";
        document.getElementById(`periodButton${i}`).style.width = "5rem";
        document.getElementById(`periodButton${i}`).style.height = "5rem";
        document.getElementById(`periodActive${i}`).style.display = "none";
        document.getElementById(`dashed-border${i}`).style.padding = "0";
        document.getElementById(`dashed-border${i}`).style.border = "0px";
      }
    }

    const targetPosition = step.position;

    const cameraPosition = getCameraPositionForTarget(targetPosition);

    gsap.to(controls.step, {
      duration: 1,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
    });

    gsap.to(controls.object.position, {
      duration: 1,
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
    });
  };
  handleFocusPeriod(period[index]);

  document.getElementById("restart-button").addEventListener("click", restart);
  document.getElementById("prevButton").addEventListener("click", prevStep);
  document.getElementById("nextButton").addEventListener("click", nextStep);
  document
    .getElementById("interestButton")
    .addEventListener("click", toggleInfo);
};

sceneSetUp();
