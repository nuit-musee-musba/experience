export default class Image {
  image: HTMLImageElement;
  id: string;

  constructor(imageId: string) {
    const image = document.querySelector<HTMLImageElement>(`${imageId}`);

    if (!image) {
      console.error(`unable to find ${imageId} in the dom`);
      return;
    }

    this.image = image;
    this.id = imageId;
  }
  changeSource(source: string) {
    this.image.src = source;
  }
}
