import * as math from "mathjs";
import * as PIXI from "pixi.js";
import { Bezier } from "bezier-js";

export default class Connector {
  constructor(
    target,
    node1,
    node2,
    onClick = () => {},
    changeStyleOnClick = true,
    style = {
      bending: 20,
      lineOptions: { color: 0x1976d2, width: 3, alpha: 1 },
      fillOptions: { color: 0x1976d2 },
    },
    styleDisabled = {
      bending: 20,
      lineOptions: { color: 0xaecae6, width: 3, alpha: 1 },
      fillOptions: { color: 0xaecae6 },
    }
  ) {
    this.node1 = node1;
    this.node2 = node2;
    this.style = style;
    this.styleDisabled = styleDisabled;
    this.changeStyleOnClick = changeStyleOnClick;
    this.onClick = onClick;
    this.isActive = true;
    this.target = null; // see this.draw(target)

    this.graphics = new PIXI.Graphics();
    // enable interaction and set call function
    this.graphics.interactive = true;
    this.graphics.buttonMode = true;
    this.graphics.on("pointertap", (e) => this._onClick(this, e));
    target.addChild(this.graphics);
  }

  _onClick(self, e) {
    if (this.isActive) {
      if (this.changeStyleOnClick) {
        console.log("A");
        this._draw(this.target, this.styleDisabled);
      }
      this.isActive = false;
    } else {
      if (this.changeStyleOnClick) {
        console.log("B");
        this._draw(this.target, this.style);
      }
      this.isActive = true;
    }

    this.onClick();
  }

  _moveOnNormal(vert1, vert2, t, d) {
    let moveOnLine = (d) => {
      return math
        .chain(vert1)
        .subtract(vert2)
        .multiply(d)
        .add(vert2)
        .done();
    };

    let normalLoc = moveOnLine(t);
    let offset = math
      .chain(vert1)
      .subtract(vert2)
      .divide(math.norm(math.subtract(vert1, vert2)))
      .rotate(math.pi / 2)
      .multiply(d)
      .done();

    return math.add(normalLoc, offset);
  }

  draw(target) {
    this._draw(target, this.style);
    this.target = target; // buffer target, used for onClick
  }

  _draw(target, style) {
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
    let centerOnBezier = bezier.compute(0.35);

    let offsetSide1 = bezier.offset(0.5, 12);
    let offsetSide2 = bezier.offset(0.5, -12);

    // draw the arrow
    let p1 = centerOnBezier;
    let p2 = offsetSide1;
    let p3 = offsetSide2;

    graphics.beginFill(style.fillOptions.color);
    graphics.moveTo(p1.x, p1.y);
    graphics.lineTo(p3.x, p3.y);
    graphics.lineTo(p2.x, p2.y);
    graphics.lineTo(p1.x, p1.y);
    graphics.closePath();
    graphics.endFill();
  }
}
