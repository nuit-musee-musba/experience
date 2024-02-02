export class Section {
  section: HTMLDivElement;
  constructor(sectionId: string) {
    const section = document.querySelector<HTMLDivElement>(`#${sectionId}`);

    if (!section) {
      console.error(`unable to find #${sectionId} in the dom`);
      return;
    }
    this.section = section;
  }

  show() {
    this.section.style.display = "block";
  }

  hide() {
    this.section.style.display = "none";
  }
}
