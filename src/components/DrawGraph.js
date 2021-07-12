/* eslint-disable no-unused-vars */
import * as PIXI from "pixi.js";
import * as math from "mathjs";

export default function drawGraph(app) {
  const stage = app.stage;
  let graphics = new PIXI.Graphics();

  let vertices = getVertices(app.screen.width / 6, {
    x: app.screen.width / 2,
    y: app.screen.height / 2,
  });
  graphics.beginFill(0xde3249);
  for (const cor of vertices) {
    graphics.drawCircle(cor[0], cor[1], 10);
  }
  graphics.endFill();

  drawConnections(stage, vertices[0], vertices[1]);
  stage.addChild(graphics);

  // eslint-disable-next-line no-unused-vars
  function getVertices(
    radius,
    center = { x: 0, y: 0 },
    rot = 0,
    vertCount = 5
  ) {
    let vertices = [];
    for (let k = 0; k < 5; k++) {
      let x = center.x + radius * Math.cos(rot + (k * 2 * Math.PI) / vertCount);
      let y = center.y + radius * Math.sin(rot + (k * 2 * Math.PI) / vertCount);
      vertices.push([x, y]);
    }
    return vertices;
  }

  function drawConnections(target, vert1, vert2, bending = 20) {
    let moveOnNormal = (normalLocD, d) => {
        let moveOnLine = (d) => {
          return math
            .chain(vert1)
            .subtract(vert2)
            .multiply(d)
            .add(vert2)
            .done();
        };
        
        let normalLoc = moveOnLine(normalLocD);
        let offset = math
          .chain(vert1)
          .subtract(vert2)
          .divide(math.norm(math.subtract(vertices[1], vertices[0])))
          .rotate(math.pi / 2)
          .multiply(d)
          .done();
  
        return math.add(normalLoc, offset);
    };

    let graphics = new PIXI.Graphics();
    //  draw the bezier
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.moveTo(vert1[0], vert1[1]);



    let controlPt = moveOnNormal(0.5, bending);
    graphics.bezierCurveTo(
      controlPt[0],
      controlPt[1],
      controlPt[0],
      controlPt[1],
      vertices[1][0],
      vertices[1][1]
    );




    // draw the arrow
    let p1 = moveOnNormal(1,20);
    let p2 = moveOnNormal(1,20);
    let p3 = moveOnNormal(0.5,0);

    // // draw a shape
    // graphics.beginFill(0xFF3300);
    // graphics.lineStyle(4, 0xffd900, 1);
    // graphics.moveTo(p1[0], p1[1]);
    // graphics.lineTo(p3[0], p3[1]);
    // graphics.lineTo(p2[0], p2[1]);
    // graphics.lineTo(p1[0], p1[1]);
    // graphics.closePath();
    // graphics.endFill();


    target.addChild(graphics);
  }
}
