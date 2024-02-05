import { Frame } from "../frame";

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
  }
  selectFrame(selectedFrame: Frame) {
    this.selectedFrameId = selectedFrame.id;

    this.frames.forEach((frame) => {
      if (this.selectedFrameId === frame.id) {
        frame.addBackground();
      } else {
        frame.removeBackground();
      }
    });
  }
}
