interface Paint {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  init(): void;
  draw(): void;
  paint(canvas: HTMLCanvasElement, event: TouchEvent): void;
  brush(x: number, y: number, diameter: number): void;
}

const paint: Paint = {
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  ctx: null,

  init() {
    this.draw()
    // this.canvas.addEventListener("mousemove", (event) => this.paint(this.canvas, event));
    this.canvas.addEventListener("touchmove", (event) => this.paint(this.canvas, event));
  },

  draw() {
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.ctx!.fillStyle = "#FFFFFF";
    this.ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  paint(canvas, event) {
    const bounding = canvas.getBoundingClientRect();

    for (let i = 0; i < event.touches.length; i++) {
      const x = event.touches[i].clientX - bounding.left;
      const y = event.touches[i].clientY - bounding.top;
      this.brush(x, y, 90);
    }
  },

  brush(x, y, diameter) {
    let radius = diameter / 2;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {

        if (dx * dx + dy * dy <= radius * radius) {
          let currentX = x + dx + Math.random() * 2 - 1;
          let currentY = y + dy + Math.random() * 2 - 1;

          if (currentX >= 0 && currentX < this.canvas.width && currentY >= 0 && currentY < this.canvas.height) {

            let pixelData = this.ctx!.getImageData(currentX, currentY, 1, 1);
            pixelData.data[3] = 0;
            this.ctx!.putImageData(pixelData, currentX, currentY);
          }
        }
      }
    }
  }
};

export default paint;
