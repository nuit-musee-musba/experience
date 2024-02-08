import * as PIXI from "pixi.js";
import Button from "../class/button";
import Div from "../class/div";

let totalPixels: number;
let remainingPixels: number;

const Paint = async (
  target: HTMLCanvasElement,
  currentSectionNumber: number,
  backgroundFile: String,
  imageToRevealFile: String,
  brushImageFile: String,
  button: Button,
  options?: { getPercentage?: boolean; getPercentageAt?: number }
) => {
  let currentSection: HTMLElement | null = document.querySelector(
    `#section-${currentSectionNumber}`
  );

  let canvasPercentage: HTMLElement | null = currentSection
    ? currentSection.querySelector(".canvas_percentage")
    : null;

  if (canvasPercentage) {
    canvasPercentage.innerText = "0%";
  }

  button.button.disabled = true;

  let width = 1395;
  let height = 1801;

  const app: any = new PIXI.Application({
    width: width,
    height: height,
    backgroundAlpha: 0,
  });
  app.renderer.background.alpha = 0;

  target!.appendChild(app.view);

  // const brush = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 200);
  // const line = new PIXI.Graphics();

  let brushTexture = await PIXI.Texture.from(`/2-arts-graphiques/images/textures/${brushImageFile}`);
  // Créez un sprite PIXI à partir de l'image de pinceau
  const brush = new PIXI.Sprite(brushTexture);
  brush.anchor.set(0.5);

  let t1 = await PIXI.Assets.load(
    `/2-arts-graphiques/canvas/${backgroundFile}`
  );
  let t2 = await PIXI.Assets.load(
    `/2-arts-graphiques/canvas/${imageToRevealFile}`
  );
  setup();

  function setup() {
    const { width, height } = { width: 1395, height: 1801 };
    const stageSize = { width, height };

    const background = Object.assign(PIXI.Sprite.from(t1), stageSize);
    const imageToReveal = Object.assign(PIXI.Sprite.from(t2), stageSize);
    const renderTexture = PIXI.RenderTexture.create(stageSize);
    const renderTextureSprite = new PIXI.Sprite(renderTexture);

    const paintingText = new Div("#to-hide");
    const divToReveal = document.querySelectorAll(".to-reveal");

    imageToReveal.mask = renderTextureSprite;

    app.stage.addChild(background, imageToReveal, renderTextureSprite);

    app.stage.eventMode = "dynamic";
    app.stage.hitArea = app.screen;
    app.stage
      .on("pointerdown", pointerDown)
      .on("pointerup", pointerUp)
      .on("pointerupoutside", pointerUp)
      .on("pointermove", pointerMove);

    let dragging = false;
    // let lastDrawnPoint: PIXI.Point | null = null;

    totalPixels = background.width * background.height;

    function pointerMove({
      global: { x, y },
    }: {
      global: { x: number; y: number };
    }) {
      paintingText.addClassHide();
      divToReveal.forEach((element) => element.classList.remove("hide"));
      if (dragging) {
        brush.position.set(x, y);
        app.renderer.render(brush, {
          renderTexture,
          clear: false,
          skipUpdateTransform: false,
        });

        // if (lastDrawnPoint) {
        //   line
        //     .clear()
        //     .lineStyle({ width: 100, color: 0xffffff })
        //     .moveTo(lastDrawnPoint.x, lastDrawnPoint.y)
        //     .lineTo(x, y);
        //   app.renderer.render(line, {
        //     renderTexture,
        //     clear: false,
        //     skipUpdateTransform: false,
        //   });
        // }

        // lastDrawnPoint = lastDrawnPoint || new PIXI.Point();
        // lastDrawnPoint.set(x, y);
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
      if (canvasPercentage) {
        canvasPercentage.innerText = `${percentageRemaining.toFixed(2)}%`;
      }

      if (percentageRemaining >= getPercentageAt) {
        button.button.disabled = false;
      }
    }

    function pointerDown(event: any) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event: any) {
      dragging = false;
      // lastDrawnPoint = null;

      if (options && options!.getPercentage) {
        percentage(options!.getPercentageAt);
      }
    }
  }

  return app;
};

export default Paint;
