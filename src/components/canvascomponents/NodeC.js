import * as PIXI from "./pixi.js";

export default class NodeC {
  constructor(
    targetStage,
    name,
    location,
    style = {
      radius: 20,
      lineOptions: {},
      fillOptions: { color: 0x1976d2 },
      textStyle: new PIXI.TextStyle({fill: 0xffffff}),
      zIndex: 1
    },
    styleActive = {
      radius: 20,
      lineOptions: {},
      fillOptions: { color: 0x4CAF50 },
      textStyle: new PIXI.TextStyle({fill: 0x658c14}),
      zIndex: 1
    }
  ) {
    this.target = targetStage;
    this.name = name;
    this.location = location;
    this.style = style;
    this.styleActive = styleActive;
    this._state = "default";
    this.connectorCs = [];

    //
    this.container = new PIXI.Container();
    this.graphics = new PIXI.Graphics();

    this.nameText = new PIXI.Text(this.name, this.style.textStyle);
    this.nameText.zIndex = this.style.zIndex;
    
    this.container.zIndex = this.style.zIndex;
    this.container.sortableChildren = true;
    this.container.addChild(this.graphics);
    this.container.addChild(this.nameText);

    this.target.addChild(this.container);
  }

  set state(newState) {
    if(!(newState === "default" || newState === "active")) {
        throw "Invalid state, only state default and active are supported"
    }
    this._state = newState; // validation could be checked here such as only allowing non numerical values
  }

  get state() {
    return this._state;
  }

  draw() {
    this.graphics.clear();
    let style = (this._state === "default") ? this.style : this.styleActive;

    const boundingBox = this.nameText.getBounds();
    this.nameText.x = (2 * style.radius - boundingBox.width) / 2;
    this.nameText.y = (2 * style.radius - boundingBox.height) / 2;
    this.container.addChild(this.nameText);

    this.graphics.beginFill(style.fillOptions.color);
    this.graphics.drawCircle(
      style.radius,
      style.radius,
      style.radius
    );
    this.graphics.endFill();
    this.container.x = this.location[0] - style.radius;
    this.container.y = this.location[1] - style.radius;

    
  }
}
