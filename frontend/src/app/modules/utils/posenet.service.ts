import { Injectable } from '@angular/core';
// Tensorflow released 2.0.0, and now you must choose either tfjs-backend-webgl, tfjs-backend-cpu, or tfjs-backend-wasm to run the model.
import '@tensorflow/tfjs-backend-webgl';
import * as posenet from '@tensorflow-models/posenet';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PosenetService {
  constructor() {}

  async getNet(resolution={ width: 257, height: 200 }) {
    return posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: resolution,
      quantBytes: 2,
    });
  }

  getAdjacentKeyPoints(keypoints, minConfidence) {
    return posenet.getAdjacentKeyPoints(keypoints, minConfidence);
  }

  getBoundingBox(keypoints) {
    return posenet.getBoundingBox(keypoints);
  }
}
