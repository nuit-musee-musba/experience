import { ExperienceType } from "../script";
import Button from "./button";
import Transition from "./transition";

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

    this.modal = modal;
    this.id = modalId;
    if (transition) {
      this.transition = transition;
    }
  }

  open() {
    this.modal.showModal();
  }

  close() {
    this.transition.next();
    this.modal.close();
  }
}
