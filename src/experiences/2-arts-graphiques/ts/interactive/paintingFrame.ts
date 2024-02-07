import { Frame } from "../class/frame";
import { texts } from "../utils/texts";

export default class Frames {
  frames: Frame[];
  selectedFrameId: string;

  constructor() {
    const frame1 = new Frame("frame-1");
    const frame2 = new Frame("frame-2");
    const frame3 = new Frame("frame-3");

    this.frames = [frame1, frame2, frame3];

    frame1.addEventListener(() => this.selectFrame(frame1));
    frame2.addEventListener(() => this.selectFrame(frame2));
    frame3.addEventListener(() => this.selectFrame(frame3));

    this.handleTextAndButton();
  }
  selectFrame(selectedFrame: Frame) {
    this.selectedFrameId = selectedFrame.id;
    this.handleTextAndButton();

    this.frames.forEach((frame) => {
      if (this.selectedFrameId === frame.id) {
        frame.addBackground();
      } else {
        frame.removeBackground();
      }
    });
  }
  handleTextAndButton() {
    const text = document.querySelector<HTMLParagraphElement>(".frame-step");
    const button = document.querySelector<HTMLButtonElement>("#button");
    if (!this.selectedFrameId && text && button) {
      text.innerText = texts.section5.step1;
      // button.disabled = true;
      return;
    }
    if (this.selectedFrameId && text && button) {
      text.innerText = texts.section5.step2;
      // button.disabled = false;:
      return;
    }
  }
}
