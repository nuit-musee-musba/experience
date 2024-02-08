import { Frame } from "../class/frame";
import { texts } from "../utils/texts";
import Button from "../class/button";
import Image from "../class/image";

export default class Frames {
  frames: Frame[];
  selectedFrameId: string;
  button: Button;
  images: NodeListOf<HTMLImageElement>;

  constructor(button: Button) {
    const frame1 = new Frame("frame-1");
    const frame2 = new Frame("frame-2");
    const frame3 = new Frame("frame-3");

    const images =
      document.querySelectorAll<HTMLImageElement>(".selected-painting");

    this.frames = [frame1, frame2, frame3];
    this.button = button;
    this.images = images;

    frame1.addEventListener(() => this.selectFrame(frame1));
    frame2.addEventListener(() => this.selectFrame(frame2));
    frame3.addEventListener(() => this.selectFrame(frame3));

    this.handleTextAndButton();
    this.button.button.disabled = true;
  }
  selectFrame(selectedFrame: Frame) {
    this.button.button.disabled = false;
    this.selectedFrameId = selectedFrame.id;

    this.handleTextAndButton();

    this.frames.forEach((frame) => {
      if (this.selectedFrameId === frame.id) {
        const selectedImage = frame.frame.children[0] as HTMLImageElement;
        this.images.forEach((element) => (element.src = selectedImage.src));
        frame.removeOpacity();
      } else {
        frame.addOpacity();
        frame.addText();
      }
    });
  }
  handleTextAndButton() {
    const text = document.querySelector<HTMLParagraphElement>(".frame-step");
    const button = document.querySelector<HTMLButtonElement>("#button");
    if (!this.selectedFrameId && text && button) {
      text.innerText = texts.section5.step1;
      return;
    }
    if (this.selectedFrameId && text && button) {
      text.innerText = texts.section5.step2;
      return;
    }
  }
}
