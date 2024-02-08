export class Frame {
  frame: HTMLDivElement;
  confirmationText: HTMLElement;
  id: string;

  constructor(frameId: string) {
    const frame = document.querySelector<HTMLDivElement>(`#${frameId}`);
    const confirmationText = document.querySelector<HTMLElement>('#painting-frame__confirmation');

    if (!frame) {
      console.error(`unable to find #${frameId} in the dom`);
      return;
    }

    if (!confirmationText) {
      console.error(`unable to find confirmationText in the dom`);
      return;
    }

    this.frame = frame;
    this.confirmationText = confirmationText;
    this.id = frameId;
  }
  addText(){
    this.confirmationText.innerText = "Êtes vous sûr·e de votre choix ?"
  }
  addOpacity() {
    this.frame.style.opacity = "50%";
  }
  removeOpacity() {
    this.frame.style.opacity = "100%";
  }
  addEventListener(callback: () => void) {
    this.frame.addEventListener("click", () => callback());
  }
}
