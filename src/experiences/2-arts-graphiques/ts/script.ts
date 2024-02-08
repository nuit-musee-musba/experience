import { enableInactivityRedirection } from "@/global/js/inactivity.ts";
import landmark from "./animation/landmark";
import Modal from "./class/modal";
import Transition from "./class/transition";
import Frames from "./interactive/paintingFrame";

enableInactivityRedirection();

export type ExperienceType = {
  transition?: Transition;
  frames?: Frames;
  modal?: Modal;
};
const experience: ExperienceType = {};

window.addEventListener("load", () => {
  experience.transition = new Transition();
  experience.frames = new Frames(experience.transition.buttonSection7);
  experience.modal = new Modal("modal", experience);
  experience.modal.open();
  landmark.init(experience.transition.sections.length);
});

export default experience;
