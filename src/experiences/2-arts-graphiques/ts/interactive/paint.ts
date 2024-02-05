import * as PIXI from "pixi.js";

let totalPixels: number;
let remainingPixels: number;

const Paint = async (
  target: HTMLElement,
  currentSectionNumber: Number,
  backgroundFile: String,
  imageToRevealFile: String,
  options?: { getPercentage?: boolean; getPercentageAt?: number }) => {
  let currentSection : HTMLElement | null = document.querySelector(`#section-${currentSectionNumber}`)
  const btnNext: HTMLButtonElement | null = document.querySelector('#button');
  let canvasPercentage: HTMLElement | null = currentSection ? currentSection.querySelector('.canvas_percentage') : null

  canvasPercentage!.innerText = "0%";
  btnNext!.disabled = true;

  let width = 2000;
  let height = 2500;

  const app: any = new PIXI.Application({
    width: width,
    height: height,
    backgroundAlpha: 0
  });
  app.renderer.background.alpha = 0;

  target!.appendChild(app.view);

  const brush = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 200);
  const line = new PIXI.Graphics();

  let t1 = await PIXI.Assets.load(`/2-arts-graphiques/canvas/${backgroundFile}`);
  let t2 = await PIXI.Assets.load(`/2-arts-graphiques/canvas/${imageToRevealFile}`);
  setup()

  function setup() {
    const { width, height } = { width: 2000, height:2500 };
    const stageSize = { width, height };

    const background = Object.assign(PIXI.Sprite.from(t1), stageSize);
    const imageToReveal = Object.assign(PIXI.Sprite.from(t2), stageSize);
    const renderTexture = PIXI.RenderTexture.create(stageSize);
    const renderTextureSprite = new PIXI.Sprite(renderTexture);

    imageToReveal.mask = renderTextureSprite;

    app.stage.addChild(background, imageToReveal, renderTextureSprite);

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    app.stage
      .on("pointerdown", pointerDown)
      .on("pointerup", pointerUp)
      .on("pointerupoutside", pointerUp)
      .on("pointermove", pointerMove);

    let dragging = false;
    let lastDrawnPoint: PIXI.Point | null = null;

    totalPixels = background.width * background.height;

    function pointerMove({
      global: { x, y },
    }: {
      global: { x: number; y: number };
    }) {
      if (dragging) {
        brush.position.set(x, y);
        app.renderer.render(brush, {
          renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });

        if (lastDrawnPoint) {
          line
            .clear()
            .lineStyle({ width: 400, color: 0xffffff })
            .moveTo(lastDrawnPoint.x, lastDrawnPoint.y)
            .lineTo(x, y);
          app.renderer.render(line, {
            renderTexture,
            clear: false,
            skipUpdateTransform: false,
          });
        }

        lastDrawnPoint = lastDrawnPoint || new PIXI.Point();
        lastDrawnPoint.set(x, y);
      }
    }

    function percentage(getPercentageAt: number | any) {
      const pixels = app.renderer.extract.pixels(renderTexture);


      remainingPixels = pixels.reduce(
        (count: any, value: any, index: any) =>
          index % 4 === 3 && value !== 0 ? count + 1 : count,
        0
      );

      const percentageRemaining = (remainingPixels / totalPixels) * 100;
      canvasPercentage!.innerText = `Done : ${percentageRemaining.toFixed(2)}%`;

      if (percentageRemaining >= getPercentageAt) {
        console.log("Vous pouvez passer à la suite si vous le souhaitez");
        btnNext!.disabled = false;
      }
    }

    function pointerDown(event: any) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event: any) {
      dragging = false;
      lastDrawnPoint = null;

      if (options && options!.getPercentage) {
        percentage(options!.getPercentageAt);
      }
    }
  }

  return app;
};

export default Paint;
