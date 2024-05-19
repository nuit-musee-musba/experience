import { makeCarousel } from "./carousel/carousel";
import { Experience, experiences } from "./carousel/experiences";
import { indexFromYRotation } from "./carousel/rotation";
import { makeScene } from "./carousel/scene";
import * as ui from "./carousel/ui";

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
ui.onBackBtnClick((e) => {
  ui.hideDetails();
  carousel.unFocusExperience();
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

  ui.toggleShowBtnVisibility(carousel.isMoving());

  renderer.render(scene, camera);
};

animate();
