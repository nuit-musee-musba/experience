import * as PIXI from "pixi.js";

const Paint = () => {
  let width = 3000;
  let height = 2000;

  const app: any = new PIXI.Application({
    width: width,
    height: height,
  });

  console.log(app);

  document.body.appendChild(app.view);

  // prepare circle texture, that will be our brush
  const brush = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, 200);

  // Create a line that will interpolate the drawn points
  const line = new PIXI.Graphics();

  PIXI.Assets.add("t2", "/2-arts-graphiques/canvas/canvas1.png");
  PIXI.Assets.load(["t2"]).then(setup);

  function setup() {
    console.log(app.screen);

    const { width, height } = { width: 3000, height: 2000 };
    const stageSize = { width, height };

    const background = new PIXI.Graphics();
    background.beginFill(0xffffff);
    background.drawRect(0, 0, stageSize.width, stageSize.height);
    background.endFill();
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

    function pointerDown(event: any) {
      dragging = true;
      pointerMove(event);
    }

    function pointerUp(event: any) {
      dragging = false;
      lastDrawnPoint = null;
    }
  }

  return app;
};

export default Paint;
