import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RendererService {
  private color = 'aqua';
  private boundingBoxColor = 'red';
  private lineWidth = 2;

  constructor() {}

  toTuple({ y, x }): [any, any] {
    return [y, x];
  }

  drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * Draws a line on a canvas, i.e. a joint
   */
  drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  /**
   * Draws a pose skeleton by looking up all adjacent keypoints/joints
   */
  drawSkeleton(adjacentKeyPoints, ctx, scale = 1) {
    adjacentKeyPoints.forEach((keypoints) => {
      this.drawSegment(
        this.toTuple(keypoints[0].position),
        this.toTuple(keypoints[1].position),
        this.color,
        scale,
        ctx
      );
    });
  }

  /**
   * Draw pose keypoints onto a canvas
   */
  drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];

      if (keypoint.score < minConfidence) {
        continue;
      }

      const { y, x } = keypoint.position;
      this.drawPoint(ctx, y * scale, x * scale, 3, this.color);
    }
  }

  /**
   * Draw the bounding box of a pose. For example, for a whole person standing
   * in an image, the bounding box will begin at the nose and extend to one of
   * ankles
   */
  drawBoundingBox(boundingBox, ctx) {
    ctx.rect(
      boundingBox.minX,
      boundingBox.minY,
      boundingBox.maxX - boundingBox.minX,
      boundingBox.maxY - boundingBox.minY
    );

    ctx.strokeStyle = this.boundingBoxColor;
    ctx.stroke();
  }

  /**
   * Converts an arary of pixel data into an ImageData object
   */
  async renderToCanvas(a, ctx) {
    const [height, width] = a.shape;
    const imageData = new ImageData(width, height);

    const data = await a.data();

    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      const k = i * 3;

      imageData.data[j + 0] = data[k + 0];
      imageData.data[j + 1] = data[k + 1];
      imageData.data[j + 2] = data[k + 2];
      imageData.data[j + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Draw an image on a canvas
   */
  renderImageToCanvas(image, size, canvas) {
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0);
  }
}
