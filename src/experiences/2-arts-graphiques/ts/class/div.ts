export default class Div {
  div: HTMLDivElement;
  className: string;

  constructor(divClassName: string) {
    const div = document.querySelector<HTMLDivElement>(`${divClassName}`);

    if (!div) {
      console.error(`unable to find ${divClassName} in the dom`);
      return;
    }

    this.div = div;
    this.className = divClassName;
  }

  addClassHide() {
    this.div.classList.add("hide");
  }
  removeClassHide() {
    this.div.classList.remove("hide");
  }
}
