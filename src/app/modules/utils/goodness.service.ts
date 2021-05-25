import { Injectable } from '@angular/core';
// Tensorflow released 2.0.0, and now you must choose either tfjs-backend-webgl, tfjs-backend-cpu, or tfjs-backend-wasm to run the model.
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';

const input_mean = JSON.parse(
  '[447.4085795536514, 160.564910279625, 0.9844401315333382, 418.13796732074064, 195.16697248034515, 0.9965523065498643, 479.9224305827426, 194.7847881693191, 0.9960330081998517, 387.57777633991736, 177.78962353894505, 0.9837366548314993, 509.34240263138895, 175.46155639869536, 0.9795160551208217, 380.3872280013316, 142.83448953401785, 0.958887442930546, 513.7822287385541, 144.43822275852457, 0.9689374198692259, 427.75805288694835, 304.06922299138006, 0.9959810641752367, 469.8845737147361, 303.73770176619075, 0.9929781382960025, 418.4094493135407, 379.83275710095563, 0.994574891574197, 481.57125534808785, 379.9182251662123, 0.9949753654676625, 418.9531077292291, 459.19011852350485, 0.9853540904068269, 480.3370779256798, 459.91191094815355, 0.9849481183470524, 0.9638205979501552]'
);
const input_std = JSON.parse(
  '[58.119380210441385, 61.450874137952766, 0.0428878634753696, 47.68588783183292, 54.01011340893817, 0.010428059902364768, 42.06021140703599, 56.298919252895836, 0.012464934517960827, 47.79845465108941, 56.15612369023575, 0.03842937907071492, 51.53412984029371, 59.124709835575594, 0.05473829928465765, 60.36729357822876, 76.70654196450381, 0.08722922681538715, 45.994083664135495, 81.25031427247106, 0.08506054925799474, 42.92843437155214, 47.84379208265801, 0.009450819932575474, 38.68576951442147, 48.84502755574921, 0.011734164565377615, 42.95263723260006, 31.721997740482383, 0.024279474558917536, 46.48501480221475, 31.762420193515442, 0.02465375218318445, 41.73603492048218, 41.5041202373728, 0.05008724442510417, 51.0686728631138, 41.90415512884606, 0.052685682379460155, 0.030508522330609644]'
);
const output_mean = JSON.parse('[0.9299093592913685, 3.419257387132124]');
const outut_std = JSON.parse('[0.05431714821136632, 1.0159109395283752]');

@Injectable({
  providedIn: 'root',
})
export class GoodnessService {
  model = null;
  constructor() {}

  async loadModel() {
    this.model = await tf.loadLayersModel(
      './assets/models/GoodnessModel/model.json'
    );
    console.log('model loaded');
  }

  make_prediction(frame) {
    const input_xs = tf.tensor2d(this.preparedData(frame));
    const output = this.model.predict(input_xs).dataSync();
    return [
      output[0] * outut_std[0] + output_mean[0],
      output[1] * outut_std[1] + output_mean[1],
    ];
  }

  preparedData(frame) {
    return [
      [
        (frame.keypoints[0].position.x - input_mean[0]) / input_std[0],
        (frame.keypoints[0].position.y - input_mean[1]) / input_std[1],
        (frame.keypoints[0].score - input_mean[2]) / input_std[2],
        (frame.keypoints[5].position.x - input_mean[3]) / input_std[3],
        (frame.keypoints[5].position.y - input_mean[4]) / input_std[4],
        (frame.keypoints[5].score - input_mean[5]) / input_std[5],
        (frame.keypoints[6].position.x - input_mean[6]) / input_std[6],
        (frame.keypoints[6].position.y - input_mean[7]) / input_std[7],
        (frame.keypoints[6].score - input_mean[8]) / input_std[8],
        (frame.keypoints[7].position.x - input_mean[9]) / input_std[9],
        (frame.keypoints[7].position.y - input_mean[10]) / input_std[10],
        (frame.keypoints[7].score - input_mean[11]) / input_std[11],
        (frame.keypoints[8].position.x - input_mean[12]) / input_std[12],
        (frame.keypoints[8].position.y - input_mean[13]) / input_std[13],
        (frame.keypoints[8].score - input_mean[14]) / input_std[14],
        (frame.keypoints[9].position.x - input_mean[15]) / input_std[15],
        (frame.keypoints[9].position.y - input_mean[16]) / input_std[16],
        (frame.keypoints[9].score - input_mean[17]) / input_std[17],
        (frame.keypoints[10].position.x - input_mean[18]) / input_std[18],
        (frame.keypoints[10].position.y - input_mean[19]) / input_std[19],
        (frame.keypoints[10].score - input_mean[20]) / input_std[20],
        (frame.keypoints[11].position.x - input_mean[21]) / input_std[21],
        (frame.keypoints[11].position.y - input_mean[22]) / input_std[22],
        (frame.keypoints[11].score - input_mean[23]) / input_std[23],
        (frame.keypoints[12].position.x - input_mean[24]) / input_std[24],
        (frame.keypoints[12].position.y - input_mean[25]) / input_std[25],
        (frame.keypoints[12].score - input_mean[26]) / input_std[26],
        (frame.keypoints[13].position.x - input_mean[27]) / input_std[27],
        (frame.keypoints[13].position.y - input_mean[28]) / input_std[28],
        (frame.keypoints[13].score - input_mean[29]) / input_std[29],
        (frame.keypoints[14].position.x - input_mean[30]) / input_std[30],
        (frame.keypoints[14].position.y - input_mean[31]) / input_std[31],
        (frame.keypoints[14].score - input_mean[32]) / input_std[32],
        (frame.keypoints[15].position.x - input_mean[33]) / input_std[33],
        (frame.keypoints[15].position.y - input_mean[34]) / input_std[34],
        (frame.keypoints[15].score - input_mean[35]) / input_std[35],
        (frame.keypoints[16].position.x - input_mean[36]) / input_std[36],
        (frame.keypoints[16].position.y - input_mean[37]) / input_std[37],
        (frame.keypoints[16].score - input_mean[38]) / input_std[38],
        (frame.score - input_mean[39]) / input_std[39],
      ],
    ];
  }
}
