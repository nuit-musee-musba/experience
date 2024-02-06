export class Frame {
  frame: HTMLDivElement;
  id: string;

  constructor(frameId: string) {
    const frame = document.querySelector<HTMLDivElement>(`#${frameId}`);

    if (!frame) {
      console.error(`unable to find #${frameId} in the dom`);
      return;
    }

    this.frame = frame;
    this.id = frameId;
  }

  addBackground() {
    this.frame.style.borderColor = "red";
    this.frame.style.borderWidth = "thick";
    this.frame.style.borderStyle = "solid";
  }
  removeBackground() {
    this.frame.style.border = "none";
  }
  addEventListener(callback: () => void) {
    this.frame.addEventListener("click", () => callback());
  }
}
