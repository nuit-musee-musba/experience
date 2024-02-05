import * as PIXI from "pixi.js";

const Paint = () => {
  let width = 2000;
  let height = 2500;
  const target: Element | null =  document.querySelector('.canvas__container');
  const canvas1Percentage: HTMLElement | null = document.querySelector('#canvas1_percentage')

  const app: any = new PIXI.Application({
    width: width,
    height: height,
    backgroundAlpha: 0
  });
  app.renderer.background.alpha = 0;

  target!.appendChild(app.view);

  const brush = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 200);
  const line = new PIXI.Graphics();

  PIXI.Assets.add("t1", "/2-arts-graphiques/canvas/stains.png");
  PIXI.Assets.add("t3", "/2-arts-graphiques/canvas/stains_mask.png");
  PIXI.Assets.add("t2", "/2-arts-graphiques/canvas/canvas1.jpeg");
  PIXI.Assets.load(["t1", "t2"]).then(setup);

  let totalPixels: number;
  let remainingPixels: number;

  function setup() {
    console.log(app.screen);

    const { width, height } = { width: 2000, height:2500 };
    const stageSize = { width, height };

    const background = Object.assign(PIXI.Sprite.from("t1"), stageSize);
    // const background = new PIXI.Graphics();
    // background.beginFill(0xffffff);
    // background.drawRect(0, 0, stageSize.width, stageSize.height);
    // background.endFill();

    const imageToReveal = Object.assign(PIXI.Sprite.from("t2"), stageSize);
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

    function percentage() {
      const pixels = app.renderer.extract.pixels(renderTexture);
      remainingPixels = pixels.reduce(
        (count : any, value : any, index: any) => (index % 4 === 3 && value !== 0 ? count + 1 : count),
        0
      );

      const percentageRemaining = (remainingPixels / totalPixels) * 100;
      // console.log(`Pourcentage de pixel transparent: ${percentageRemaining.toFixed(2)}%`);
      canvas1Percentage!.innerText = `Done : ${percentageRemaining.toFixed(2)}%`;
    }

    function pointerDown(event: any) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event: any) {
      dragging = false;
      lastDrawnPoint = null;

      percentage()
    }
  }

  return app;
};

export default Paint;
