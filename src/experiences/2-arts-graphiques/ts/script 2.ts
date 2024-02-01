import Experience from "./Experience/Experience";

const canvas = document.querySelector<HTMLCanvasElement>("canvas.webgl");

if (!canvas) {
  console.error(
    "Canvas with a class of 'webgl' is required in order for the experience to work"
  );
  throw new Error(
    "Canvas with a class of 'webgl' is required in order for the experience to work"
  );
}

const experience = new Experience(canvas);
