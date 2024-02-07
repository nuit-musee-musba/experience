export default class Button {
  button: HTMLButtonElement;
  id: string;
  click: any;

  constructor(buttonName: string, onClick: any) {
    const button = document.querySelector<HTMLButtonElement>(`.${buttonName}`);
    if (!button) {
      console.error(`unable to find .${buttonName} in the dom`);
      return;
    }

    this.button = button;
    this.id = buttonName;
    this.click = () => onClick();

    this.button.addEventListener("click", () => {
      this.click();
    });
  }
}
