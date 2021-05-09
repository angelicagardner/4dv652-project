import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as config from './config.json';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private posenet_frames: Observable<PosnetFrame[]>

  constructor(private http: HttpClient) {}

  get_posenet_frames() {
    return this.posenet_frames;
  }

  predictScore(pridictors: AimoPredictors) {
    return this.http
      .post<ScoreResponse>('http://127.0.0.1:8000/api/v2/scores', pridictors)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  savePosnetPoses(data: PosnetFrame[]) {
    this.posenet_frames = new Observable((observer)=>{
      observer.next(data)
    })
  }

  sendPosnetData(data: PosnetFrame[]) {

    return this.http
      .post<ModelResponse>('http://localhost:8000/api/v3/camupload/', {frames:data})
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  random(mean: number, standardDeviation: number): number {
    let result =
      mean +
      2.0 *
        standardDeviation *
        (Math.random() + Math.random() + Math.random() - 1.5);
    if (result < 0) return 0;
    if (result > 1) return 1;
    return result;
  }

  validatePredictors(predictors: AimoPredictors) {
    Object.keys(predictors).forEach((key) => {
      if (!predictors[key]) {
        predictors[key] = 0;
      } else {
        if (typeof predictors[key] == 'string') {
          predictors[key] = predictors[key].replace(',', '.');
        }
        predictors[key] = parseFloat(predictors[key]);
        if (isNaN(predictors[key])) {
          predictors[key] = 0;
        }
      }
    });
  }

  convertToPredictorObject(
    vars: String,
    seperator: string = ''
  ): AimoPredictors {
    let arr = [];
    let obj = {};
    if (seperator.length && vars && vars.length) {
      arr = vars
        .split(seperator)
        .map((item) => String.prototype.trim.apply(item));
    }

    for (let index = 0; index < config.labels.length; index++) {
      if (index < arr.length) {
        obj[config.labels[index]] = parseFloat(arr[index].replace(',', '.'));
        if (isNaN(obj[config.labels[index]])) {
          obj[config.labels[index]] = 0;
        }
      } else {
        obj[config.labels[index]] = 0;
      }
    }
    return <AimoPredictors>obj;
  }

  getRandomPredictors(): AimoPredictors {
    return <AimoPredictors>{
      No_1_Angle_Deviation: this.random(
        config.statistics.AD_1.mean,
        config.statistics.AD_1.std
      ),
      No_2_Angle_Deviation: this.random(
        config.statistics.AD_2.mean,
        config.statistics.AD_2.std
      ),
      No_3_Angle_Deviation: this.random(
        config.statistics.AD_3.mean,
        config.statistics.AD_3.std
      ),
      No_4_Angle_Deviation: this.random(
        config.statistics.AD_4.mean,
        config.statistics.AD_4.std
      ),
      No_5_Angle_Deviation: this.random(
        config.statistics.AD_5.mean,
        config.statistics.AD_5.std
      ),
      No_6_Angle_Deviation: this.random(
        config.statistics.AD_6.mean,
        config.statistics.AD_6.std
      ),
      No_7_Angle_Deviation: this.random(
        config.statistics.AD_7.mean,
        config.statistics.AD_7.std
      ),
      No_8_Angle_Deviation: this.random(
        config.statistics.AD_8.mean,
        config.statistics.AD_8.std
      ),
      No_9_Angle_Deviation: this.random(
        config.statistics.AD_9.mean,
        config.statistics.AD_9.std
      ),
      No_10_Angle_Deviation: this.random(
        config.statistics.AD_10.mean,
        config.statistics.AD_10.std
      ),
      No_11_Angle_Deviation: this.random(
        config.statistics.AD_11.mean,
        config.statistics.AD_11.std
      ),
      No_12_Angle_Deviation: this.random(
        config.statistics.AD_12.mean,
        config.statistics.AD_12.std
      ),
      No_13_Angle_Deviation: this.random(
        config.statistics.AD_13.mean,
        config.statistics.AD_13.std
      ),
      No_1_NASM_Deviation: this.random(
        config.statistics.ND_1.mean,
        config.statistics.ND_1.std
      ),
      No_2_NASM_Deviation: this.random(
        config.statistics.ND_2.mean,
        config.statistics.ND_2.std
      ),
      No_3_NASM_Deviation: this.random(
        config.statistics.ND_3.mean,
        config.statistics.ND_3.std
      ),
      No_4_NASM_Deviation: this.random(
        config.statistics.ND_4.mean,
        config.statistics.ND_4.std
      ),
      No_5_NASM_Deviation: this.random(
        config.statistics.ND_5.mean,
        config.statistics.ND_5.std
      ),
      No_6_NASM_Deviation: this.random(
        config.statistics.ND_6.mean,
        config.statistics.ND_6.std
      ),
      No_7_NASM_Deviation: this.random(
        config.statistics.ND_7.mean,
        config.statistics.ND_7.std
      ),
      No_8_NASM_Deviation: this.random(
        config.statistics.ND_8.mean,
        config.statistics.ND_8.std
      ),
      No_9_NASM_Deviation: this.random(
        config.statistics.ND_9.mean,
        config.statistics.ND_9.std
      ),
      No_10_NASM_Deviation: this.random(
        config.statistics.ND_10.mean,
        config.statistics.ND_10.std
      ),
      No_11_NASM_Deviation: this.random(
        config.statistics.ND_11.mean,
        config.statistics.ND_11.std
      ),
      No_12_NASM_Deviation: this.random(
        config.statistics.ND_12.mean,
        config.statistics.ND_12.std
      ),
      No_13_NASM_Deviation: this.random(
        config.statistics.ND_13.mean,
        config.statistics.ND_13.std
      ),
      No_14_NASM_Deviation: this.random(
        config.statistics.ND_14.mean,
        config.statistics.ND_14.std
      ),
      No_15_NASM_Deviation: this.random(
        config.statistics.ND_15.mean,
        config.statistics.ND_15.std
      ),
      No_16_NASM_Deviation: this.random(
        config.statistics.ND_16.mean,
        config.statistics.ND_16.std
      ),
      No_17_NASM_Deviation: this.random(
        config.statistics.ND_17.mean,
        config.statistics.ND_17.std
      ),
      No_18_NASM_Deviation: this.random(
        config.statistics.ND_18.mean,
        config.statistics.ND_18.std
      ),
      No_19_NASM_Deviation: this.random(
        config.statistics.ND_19.mean,
        config.statistics.ND_19.std
      ),
      No_20_NASM_Deviation: this.random(
        config.statistics.ND_20.mean,
        config.statistics.ND_20.std
      ),
      No_21_NASM_Deviation: this.random(
        config.statistics.ND_21.mean,
        config.statistics.ND_21.std
      ),
      No_22_NASM_Deviation: this.random(
        config.statistics.ND_22.mean,
        config.statistics.ND_22.std
      ),
      No_23_NASM_Deviation: this.random(
        config.statistics.ND_23.mean,
        config.statistics.ND_23.std
      ),
      No_24_NASM_Deviation: this.random(
        config.statistics.ND_24.mean,
        config.statistics.ND_24.std
      ),
      No_25_NASM_Deviation: this.random(
        config.statistics.ND_25.mean,
        config.statistics.ND_25.std
      ),
      No_1_Time_Deviation: this.random(
        config.statistics.TD_1.mean,
        config.statistics.TD_1.std
      ),
      No_2_Time_Deviation: this.random(
        config.statistics.TD_2.mean,
        config.statistics.TD_2.std
      ),
    };
  }
}

export interface ModelResponse {
  frames: KinectFrame[];
}

export interface PosnetData {
  frames: PosnetFrame[];
}

export interface PosnetFrame {
  left_ankle_score: number,
  left_ankle_x: number,
  left_ankle_y: number,
  left_ear_score: number,
  left_ear_x: number,
  left_ear_y: number,
  left_elbow_score: number,
  left_elbow_x: number,
  left_elbow_y: number,
  left_eye_score: number,
  left_eye_x: number,
  left_eye_y: number,
  left_hip_score: number,
  left_hip_x: number,
  left_hip_y: number,
  left_knee_score: number,
  left_knee_x: number,
  left_knee_y: number,
  left_shoulder_score: number,
  left_shoulder_x: number,
  left_shoulder_y: number,
  left_wrist_score: number,
  left_wrist_x: number,
  left_wrist_y: number,
  nose_score: number,
  nose_x: number,
  nose_y: number,
  right_ankle_score: number,
  right_ankle_x: number,
  right_ankle_y: number,
  right_ear_score: number,
  right_ear_x: number,
  right_ear_y: number,
  right_elbow_score: number,
  right_elbow_x: number,
  right_elbow_y: number,
  right_eye_score: number,
  right_eye_x: number,
  right_eye_y: number,
  right_hip_score: number,
  right_hip_x: number,
  right_hip_y: number,
  right_knee_score: number,
  right_knee_x: number,
  right_knee_y: number,
  right_shoulder_score: number,
  right_shoulder_x: number,
  right_shoulder_y: number,
  right_wrist_score: number,
  right_wrist_x: number,
  right_wrist_y: number
}

export interface KinectFrame {
  head_x: number,
  head_y: number,
  head_z: number,
  left_ankle_x: number,
  left_ankle_y: number,
  left_ankle_z: number,
  left_elbow_x: number,
  left_elbow_y: number,
  left_elbow_z: number,
  left_hip_x: number,
  left_hip_y: number,
  left_hip_z: number,
  left_knee_x: number,
  left_knee_y: number,
  left_knee_z: number,
  left_shoulder_x: number,
  left_shoulder_y: number,
  left_shoulder_z: number,
  left_wrist_x: number,
  left_wrist_y: number,
  left_wrist_z: number,
  right_ankle_x: number,
  right_ankle_y: number,
  right_ankle_z: number,
  right_elbow_x: number,
  right_elbow_y: number,
  right_elbow_z: number,
  right_hip_x: number,
  right_hip_y: number,
  right_hip_z: number,
  right_knee_x: number,
  right_knee_y: number,
  right_knee_z: number,
  right_shoulder_x: number,
  right_shoulder_y: number,
  right_shoulder_z: number,
  right_wrist_x: number,
  right_wrist_y: number,
  right_wrist_z: number
}

export interface ScoreResponse {
  score: number;
  weakest_link: string;
}

declare interface AimoPredictors {
  No_1_Angle_Deviation: number;
  No_2_Angle_Deviation: number;
  No_3_Angle_Deviation: number;
  No_4_Angle_Deviation: number;
  No_5_Angle_Deviation: number;
  No_6_Angle_Deviation: number;
  No_7_Angle_Deviation: number;
  No_8_Angle_Deviation: number;
  No_9_Angle_Deviation: number;
  No_10_Angle_Deviation: number;
  No_11_Angle_Deviation: number;
  No_12_Angle_Deviation: number;
  No_13_Angle_Deviation: number;
  No_1_NASM_Deviation: number;
  No_2_NASM_Deviation: number;
  No_3_NASM_Deviation: number;
  No_4_NASM_Deviation: number;
  No_5_NASM_Deviation: number;
  No_6_NASM_Deviation: number;
  No_7_NASM_Deviation: number;
  No_8_NASM_Deviation: number;
  No_9_NASM_Deviation: number;
  No_10_NASM_Deviation: number;
  No_11_NASM_Deviation: number;
  No_12_NASM_Deviation: number;
  No_13_NASM_Deviation: number;
  No_14_NASM_Deviation: number;
  No_15_NASM_Deviation: number;
  No_16_NASM_Deviation: number;
  No_17_NASM_Deviation: number;
  No_18_NASM_Deviation: number;
  No_19_NASM_Deviation: number;
  No_20_NASM_Deviation: number;
  No_21_NASM_Deviation: number;
  No_22_NASM_Deviation: number;
  No_23_NASM_Deviation: number;
  No_24_NASM_Deviation: number;
  No_25_NASM_Deviation: number;
  No_1_Time_Deviation: number;
  No_2_Time_Deviation: number;
  AimoScore: number;
  EstimatedScore: number;
}
