import Transition from "./transition";
import Button from "./button";
import { ExperienceType } from "../script";

export default class Modal {
  modal: HTMLDialogElement;
  id: string;
  transition: Transition;

  constructor(modalId: string, experience: ExperienceType) {
    const transition = experience.transition;
    const modal = document.querySelector<HTMLDialogElement>(`#${modalId}`);
    const button = new Button("close-modal", () => this.close());
    if (!modal) {
      console.error(`unable to find #${modalId} in the dom`);
      return;
    }
    if (!button) {
      console.error("unable to find #close-modal in the dom");
      return;
    }

    this.modal = modal;
    this.id = modalId;
    if (transition) {
      this.transition = transition;
    }

    // button.addEventListener("click", () => this.close());
  }

  open() {
    this.modal.showModal();
  }

  close() {
    this.transition.next();
    this.modal.close();
  }
}
