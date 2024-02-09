import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import gsap from "gsap";
import * as THREE from "three";
import { onboardingContent, periods } from "./constants";
import { enableInactivityAnimation } from "./inactivity.ts";

// enableInactivityRedirection();
enableInactivityAnimation()
import {
  animatedScenes,
  camera,
  controls,
  loadModels,
  allPOI,
  renderer,
  scene,
} from "./scene.js";
import { updateAllMaterials } from "./utils";

const titleElm = document.querySelector("#date-title");
const subTitleElm = document.querySelector("#subTitle");
const mainTitleElm = document.querySelector(".main-title");
const subTitleNextButton = document.querySelector(".subTitle-next");
const wrapperSubTitleElm = document.querySelector(".wrapper-subTitle");

const loaderElm = document.querySelector(".loader")
const loaderIconElm = document.querySelector(".loader-icon")

let currentStep = 0;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sceneSetUp = async () => {
  document.oncontextmenu = function () {
    return false;
  };

  const clock = new THREE.Clock();
  let index = 0;
  let previousIndex = null;
  let previousTime = 0;
  let isShowingText = false;
  let isOnboarded = false
  const raycaster = new THREE.Raycaster();

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
            document.getElementById("poi-title-component").textContent =
              periods[i].poiText[j].title;
            document.getElementById("poi-text-component").innerHTML =
              periods[i].poiText[j].text;
          }

          const position = periods[i].poiPosition[j];
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
  const lastStep = document.getElementById("last-step");
  const component = document.getElementById("poi-component");
  // const containerSubTitle = document.getElementById("container-subTitle");

  const restart = () => {
    index = 0;
    handleFocusPeriod(periods[index]);
  };

  const showText = () => {
    isShowingText = true;
    component.style.display = "flex";
    // containerSubTitle.style.display = "flex";
  };

  const hideText = () => {
    isShowingText = false;
    component.style.display = "none";
    // containerSubTitle.style.display = "none";
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
      handleFocusPeriod(periods[index]);
    }
  };

  const nextStep = () => {
    if (index + 1 < periods.length) {
      index++;
      handleFocusPeriod(periods[index]);
    } else {
      endMenu.classList.remove('hidden')
      lastStep.style.display = "none";
    }
  };

  for (let i = 1; i <= 4; i++) {
    document.getElementById(`period${i}`).addEventListener("click", () => {
      index = i - 1;
      handleFocusPeriod(periods[i - 1]);
    });
    document
      .getElementById(`periodButton${i}`)
      .addEventListener("click", () => {
        index = i - 1;
        handleFocusPeriod(periods[i - 1]);
      });
  }

  const handleNext = async () => {

    console.log({ currentStep })
    titleElm.classList.add("date-title-hidden");
    if (currentStep === 3) {
      // debugger
      console.log("a", loaderElm.classList)
      loaderElm.classList.remove('loader-hidden')
      loaderIconElm.classList.remove('loader-hidden')


      titleElm.classList.remove("date-title-hidden");
      isOnboarded = true;
      subTitleNextButton.classList.add("hidden");

      wrapperSubTitleElm.classList.add("hidden");

      await wait(2000)

      console.log("b", loaderElm.classList)

      handleFocusPeriod(periods[0]);


    } else if (currentStep >= 0 && currentStep <= 2) {
      subTitleElm.textContent = onboardingContent[currentStep].subTitle;
      mainTitleElm.textContent = onboardingContent[currentStep].mainTitle;

      if (onboardingContent[currentStep].title) {
        titleElm.classList.remove("date-title-hidden");
        titleElm.textContent = onboardingContent[currentStep].title;
      }


      currentStep++;
    }
  };

  const handleStart = async () => {
    titleElm.classList.add("date-title-hidden");

    await loadModels();

    animatedScenes.forEach((animatedScene) => {
      animatedScene.finalState();
    });

    updateAllMaterials();

    controls.object.position.set(0, 6, 0);
    controls.target.set(2, 2, 0);

    await handleNext();
  };


  const handleFocusPeriod = async (step) => {


    if (!step) {
      return;
    }
    await loadModels();
    displayPOI(index);

    updateAllMaterials();

    for (let i = 0; i < animatedScenes.length; i++) {
      if (i <= index) {
        animatedScenes[i].play();
      } else {
        animatedScenes[i].reverse();
      }
    }

    const dateTitleElement = document.getElementById("date-title");
    document.querySelector('.chronology').classList.remove("hidden")
    wrapperSubTitleElm.classList.remove("hidden");


    dateTitleElement.textContent = "";

    dateTitleElement.appendChild(document.createTextNode(step.date));

    const selectedButtonId = `period${index + 1}`;
    const selectedPeriodButtonId = `periodButton${index + 1}`;
    const selectedButtonActive = `periodActive${index + 1}`;
    const selectedDashedButton = `dashed-border${index + 1}`;

    if (index === 0) {
      document.getElementById("prevButton").style.display = "none";
    } else {
      document.getElementById("prevButton").style.display = "block";
    }
    if (index === periods.length - 1) {
      document.getElementById("nextButton").style.display = "none";
      document.getElementById("last-step").style.display = "flex";
    } else {
      document.getElementById("nextButton").style.display = "block";
      document.getElementById("last-step").style.display = "none";
    }

    document.getElementById(selectedButtonId).style.fontSize = "8rem";
    document.getElementById(selectedButtonId).style.top = "-12rem";
    document.getElementById(selectedPeriodButtonId).style.width = "6rem";
    document.getElementById(selectedPeriodButtonId).style.height = "6rem";
    document.getElementById(selectedDashedButton).style.padding = "0.5rem";
    document.getElementById(selectedDashedButton).style.border =
      "5px dashed white";
    document.getElementById(selectedDashedButton).style.borderRadius = "100px";
    document.getElementById(selectedButtonActive).style.display = "block";

    for (let i = 1; i <= periods.length; i++) {
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

    const cameraPosition = targetPosition;

    document.getElementById("subTitle").textContent = step.subTitle[0];

    gsap.to(controls.target, {
      duration: 1,
      x: step.target.x,
      y: step.target.y,
      z: step.target.z,
      onComplete: () => {
        firstMovementFinished = true
      },
    });

    gsap.to(controls.object.position, {
      duration: 1,
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
      onComplete: () => {
        firstMovementFinished = true
      },
    });
  };

  async function startExperience() {
    await loadModels();
    handleFocusPeriod(periods[index]);
  }

  if (!isOnboarded) {
    await handleStart();
  } else {
    animatedScenes.forEach((animatedScene) => {
      animatedScene.setup();
      animatedScene.resetAnimations();
    });

    startExperience();
  }

  subTitleNextButton.addEventListener("click", handleNext);
  document.getElementById("restart-button").addEventListener("click", restart);
  document.getElementById("prevButton").addEventListener("click", prevStep);
  document.getElementById("nextButton").addEventListener("click", nextStep);
  document.getElementById("last-step").addEventListener("click", nextStep);
  document
    .getElementById("interestButton")
    .addEventListener("click", toggleInfo);
};

sceneSetUp();
