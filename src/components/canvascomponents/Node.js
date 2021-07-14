import * as PIXI from "pixi.js";

export default class Node {
  constructor(
    ID,
    location,
    style = {
      radius: 20,
      lineOptions: {},
      fillOptions: { color: 0x1976d2 },
      textStyle: new PIXI.TextStyle({fill: 0xffffff}),
      zIndex: 1
    }
  ) {
    this.ID = ID;
    this.location = location;
    this.style = style;
  }

  draw(target) {
    const container = new PIXI.Container();
    const IDText = new PIXI.Text(this.ID, this.style.textStyle);
    const graphics = new PIXI.Graphics();

    const boundingBox = IDText.getBounds();
    IDText.x = (2 * this.style.radius - boundingBox.width) / 2;
    IDText.y = (2 * this.style.radius - boundingBox.height) / 2;

    graphics.beginFill(this.style.fillOptions.color);
    graphics.drawCircle(
      this.style.radius,
      this.style.radius,
      this.style.radius
    );
    graphics.endFill();
    container.x = this.location[0] - this.style.radius;
    container.y = this.location[1] - this.style.radius;

    container.addChild(graphics);
    container.addChild(IDText);
    container.zIndex = this.style.zIndex;
    target.addChild(container);
  }
}
