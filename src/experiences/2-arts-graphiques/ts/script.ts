import Transition from "./class/transition";
import Frames from "./interactive/paintingFrame";
import Modal from "./class/modal";

export type ExperienceType = {
  transition?: Transition;
  frames?: Frames;
  modal?: Modal;
};
const experience: ExperienceType = {};

window.addEventListener("load", () => {
  experience.transition = new Transition();
  experience.frames = new Frames();
  experience.modal = new Modal("modal", experience);
  experience.modal.open();
});

export default experience;
