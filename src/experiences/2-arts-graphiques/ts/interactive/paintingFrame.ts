class Frame {
  frames: HTMLDivElement[];
  selectedFrame: HTMLDivElement;

  constructor() {
    const frame1 = document.querySelector<HTMLDivElement>("#frame-1");
    const frame2 = document.querySelector<HTMLDivElement>("#frame-2");
    const frame3 = document.querySelector<HTMLDivElement>("#frame-3");
  }
  selectFrame() {}
}
