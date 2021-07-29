import * as math from "mathjs";
import * as PIXI from "./pixi.js";
import { Bezier } from "bezier-js";


export default class ConnectorC {
  constructor(
    target,
    node1,
    node2,
    onClick = (self, e) => {},
    // old color 0x1976d2
    style = {
      bending: 35,
      tipLength: 25,
      arrowWidth: 11,
      lineOptions: { color: 0x1976d2, width: 2, alpha: 1 },
      fillOptions: { color: 0x1976d2 },
    },
    // old color 0xaecae6
    styleDisabled = {
      bending: 35,
      tipLength: 25,
      arrowWidth: 11,
      lineOptions: { color: 0xaecae6, width: 2, alpha: 1 },
      fillOptions: { color: 0xaecae6 },
    },
    styleActive = {
      bending: 35,
      tipLength: 25,
      arrowWidth: 12,
      lineOptions: { color: 0x4caf50, width: 4, alpha: 1 },
      fillOptions: { color: 0x4caf50 },
    }
  ) {
    this.node1 = node1;
    this.node2 = node2;
    this.style = style;
    this.styleDisabled = styleDisabled;
    this.styleActive = styleActive;
    this.onClick = onClick;
    this.target = null; // see this.draw(target)

    this._state = "default";

    this.graphics = new PIXI.Graphics();
    // enable interaction and set call function
    this.graphics.interactive = true;
    // this.graphics.buttonMode = true;
    this.graphics.on("pointertap", (e) => this.onClick(this, e));
    target.addChild(this.graphics);
  }

  set state(newState) {
    if (
      !(
        newState === "active" ||
        newState === "disabled" ||
        newState === "default"
      )
    ) {
      throw "Invalid state, only state default, disabled and active are supported";
    }
    this._state = newState; // validation could be checked here such as only allowing non numerical values
  }

  get state() {
    return this._state;
  }

  _moveOnNormal(vert1, vert2, t, d) {
    let moveOnLine = (d) => {
      return math.chain(vert1)
        .subtract(vert2)
        .multiply(d)
        .add(vert2)
        .done();
    };

    let normalLoc = moveOnLine(t);
    let offset = math.chain(vert1)
      .subtract(vert2)
      .divide(math.norm(math.subtract(vert1, vert2)))
      .rotate(math.pi / 2)
      .multiply(d)
      .done();

    return math.add(normalLoc, offset);
  }

  draw() {
    let style = null;
    switch (this._state) {
      case "default":
        style = this.style;
        break;
      case "active":
        style = this.styleActive;
        break;
      case "disabled":
        style = this.styleDisabled;
        break;
    }
    this._draw(style);
  }

  _draw(style) {
    let vert1 = this.node1.location;
    let vert2 = this.node2.location;
    let graphics = this.graphics;

    graphics.clear();

    //  draw the bezier
    graphics.lineStyle(style.lineOptions);

    let controlPt = this._moveOnNormal(vert1, vert2, 0.5, style.bending);

    graphics.moveTo(vert1[0], vert1[1]);
    graphics.bezierCurveTo(
      controlPt[0],
      controlPt[1],
      controlPt[0],
      controlPt[1],
      vert2[0],
      vert2[1]
    );

    // math representation of the drawn bezier curve
    let bezier = new Bezier(
      vert1[0],
      vert1[1],
      controlPt[0],
      controlPt[1],
      controlPt[0],
      controlPt[1],
      vert2[0],
      vert2[1]
    );

    // now calculate the three points for the arrow
    // point in the center of the bezier curve
    let bezierLength = bezier.length();
    let centerOnBezier = bezier.compute(0.5 + style.tipLength / bezierLength);

    let offsetSide1 = bezier.offset(0.5, style.arrowWidth / 2);
    let offsetSide2 = bezier.offset(0.5, -style.arrowWidth / 2);

    // draw the arrow
    let p1 = centerOnBezier;
    let p2 = offsetSide1;
    let p3 = offsetSide2;

    graphics.lineStyle(style.lineOptions);
    graphics.beginFill(style.fillOptions.color);
    graphics.moveTo(p1.x, p1.y);
    graphics.lineTo(p3.x, p3.y);
    graphics.lineTo(p2.x, p2.y);
    graphics.lineTo(p1.x, p1.y);
    graphics.closePath();
    graphics.endFill();

    //make interaction a bit easier on mobile devices by increasing touchable area at the arrow
    let centerOfArrow = bezier.compute(
      0.5 + style.tipLength / (2 * bezierLength)
    );

    // graphics.beginFill(0xffffff);
    // graphics.lineStyle(2, 0x0);
    // graphics.drawCircle(centerOfArrow.x, centerOfArrow.y, 20); //TODO hard coded
    // graphics.endFill();
    graphics.hitArea = new PIXI.Circle(centerOfArrow.x, centerOfArrow.y, 20);
  }
}
