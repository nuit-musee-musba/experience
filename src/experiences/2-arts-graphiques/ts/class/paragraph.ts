export default class Paragraph {
  paragraphElement: HTMLParagraphElement;
  id: string;

  constructor(paragraphId: string) {
    const paragraph = document.querySelector<HTMLParagraphElement>(
      `#${paragraphId}`
    );

    if (!paragraph) {
      console.error(`unable to find #${paragraphId} in the dom`);
      return;
    }

    this.paragraphElement = paragraph;
    this.id = paragraphId;
  }
  changeText(text: string) {
    this.paragraphElement.innerText = text;
  }
}
