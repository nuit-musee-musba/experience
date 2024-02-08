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
