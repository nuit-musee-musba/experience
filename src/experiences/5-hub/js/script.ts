import "@lottiefiles/lottie-player";
import { makeCarousel } from "./carousel/carousel";
import { Experience, experiences } from "./carousel/experiences";
import { indexFromYRotation } from "./carousel/rotation";
import { makeScene } from "./carousel/scene";
import * as ui from "./carousel/ui";
import { enableInactivityAnimation } from "./inactivity";

let currentExperienceIndex = 0;
const currentExperience = () => experiences[currentExperienceIndex];

document.addEventListener("DOMContentLoaded", function () {
  ui.updateExperienceInfos(currentExperience());
});

const { renderer, camera, scene, carouselGroup } = makeScene();

const carousel = makeCarousel({
  scene,
  camera,
  carouselGroup,
});

const focusExperience = (experience: Experience) => {
  ui.displayDetails();
  carousel.focusExperience(experience);
};

carousel.onExperienceClick((experience) => focusExperience(experience));
ui.onShowBtnClick(() => focusExperience(currentExperience()));
ui.onStartBtnClick(() => {
  const canOpenNewTab = window.opener != null || window.history.length == 1;
  if (canOpenNewTab) {
    window.open(currentExperience().path);
    window.close();
  } else {
    window.location.href = currentExperience().path;
  }
});
ui.onBackBtnClick((e) => {
  ui.hideDetails();
  carousel.unFocusExperience();
});

enableInactivityAnimation({
  isFocusingExperience: carousel.isFocusingExperience,
});

const animate = () => {
  requestAnimationFrame(animate);

  carousel.updateGroupRotation();

  const oldExperienceIndex = currentExperienceIndex;
  currentExperienceIndex = indexFromYRotation(carouselGroup.rotation.y);

  const experienceHasChanged = oldExperienceIndex !== currentExperienceIndex;
  if (experienceHasChanged) {
    ui.updateExperienceInfos(currentExperience());
  }

  renderer.render(scene, camera);
};

animate();
