import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as analysis from './analysis.json';
import { ScoreService } from './score.service';
import { ModalComponent } from './modal.component';
import { MatDialog } from '@angular/material/dialog';

const labels = [
  'No_1_Angle_Deviation',
  'No_2_Angle_Deviation',
  'No_3_Angle_Deviation',
  'No_4_Angle_Deviation',
  'No_5_Angle_Deviation',
  'No_6_Angle_Deviation',
  'No_7_Angle_Deviation',
  'No_8_Angle_Deviation',
  'No_9_Angle_Deviation',
  'No_10_Angle_Deviation',
  'No_11_Angle_Deviation',
  'No_12_Angle_Deviation',
  'No_13_Angle_Deviation',
  'No_1_NASM_Deviation',
  'No_2_NASM_Deviation',
  'No_3_NASM_Deviation',
  'No_4_NASM_Deviation',
  'No_5_NASM_Deviation',
  'No_6_NASM_Deviation',
  'No_7_NASM_Deviation',
  'No_8_NASM_Deviation',
  'No_9_NASM_Deviation',
  'No_10_NASM_Deviation',
  'No_11_NASM_Deviation',
  'No_12_NASM_Deviation',
  'No_13_NASM_Deviation',
  'No_14_NASM_Deviation',
  'No_15_NASM_Deviation',
  'No_16_NASM_Deviation',
  'No_17_NASM_Deviation',
  'No_18_NASM_Deviation',
  'No_19_NASM_Deviation',
  'No_20_NASM_Deviation',
  'No_21_NASM_Deviation',
  'No_22_NASM_Deviation',
  'No_23_NASM_Deviation',
  'No_24_NASM_Deviation',
  'No_25_NASM_Deviation',
  'No_1_Time_Deviation',
  'No_2_Time_Deviation',
];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  singleValueForm: FormGroup;
  commaSeparatedForm: FormGroup;
  newLineSeparatedForm: FormGroup;
  animal: string;
  name: string;

  onSubmit(formItem, fornNo: number) {
    switch (fornNo) {
    case 2:
      formItem = this.convertToPredictorObject(formItem.allValues, '\n');
      break;
    case 3:
      formItem = this.convertToPredictorObject(formItem.allValues, ',');
      break;
    default:
      break;
    }

    this.validatePredictors(formItem);

    this.scoreService.predictScore(formItem).subscribe((data) => {
      this.openDialog(data);
    });
  }

  validatePredictors(predictors) {
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

  convertToPredictorObject(vars: String, seperator: string = '') {
    let arr = [];
    let obj = {};
    if (seperator.length && vars && vars.length) {
      arr = vars
        .split(seperator)
        .map((item) => String.prototype.trim.apply(item));
    }

    for (let index = 0; index < labels.length; index++) {
      if (index < arr.length) {
        obj[labels[index]] = parseFloat(arr[index].replace(',', '.'));
        if (isNaN(obj[labels[index]])) {
          obj[labels[index]] = 0;
        }
      } else {
        obj[labels[index]] = 0;
      }
    }
    return obj;
  }

  onGenerateDemo(fornNo: number) {
    let allValues = this.getRandomPredictors();
    let allValuesArray = [];
    Object.keys(allValues).forEach((item) => {
      allValuesArray.push(allValues[item]);
    });
    switch (fornNo) {
    case 1:
      this.singleValueForm.patchValue(allValues);
      break;
    case 2:
      this.newLineSeparatedForm.patchValue({
        allValues: allValuesArray.join('\n'),
      });
      break;
    case 3:
      this.commaSeparatedForm.patchValue({
        allValues: allValuesArray.join(' ,  '),
      });
      break;
    default:
      break;
    }
  }

  onClear() {
    this.clearForms();
  }

  getRandomPredictors() {
    return {
      No_1_Angle_Deviation: this.random(analysis.AD_1.mean, analysis.AD_1.std),
      No_2_Angle_Deviation: this.random(analysis.AD_2.mean, analysis.AD_2.std),
      No_3_Angle_Deviation: this.random(analysis.AD_3.mean, analysis.AD_3.std),
      No_4_Angle_Deviation: this.random(analysis.AD_4.mean, analysis.AD_4.std),
      No_5_Angle_Deviation: this.random(analysis.AD_5.mean, analysis.AD_5.std),
      No_6_Angle_Deviation: this.random(analysis.AD_6.mean, analysis.AD_6.std),
      No_7_Angle_Deviation: this.random(analysis.AD_7.mean, analysis.AD_7.std),
      No_8_Angle_Deviation: this.random(analysis.AD_8.mean, analysis.AD_8.std),
      No_9_Angle_Deviation: this.random(analysis.AD_9.mean, analysis.AD_9.std),
      No_10_Angle_Deviation: this.random(
        analysis.AD_10.mean,
        analysis.AD_10.std
      ),
      No_11_Angle_Deviation: this.random(
        analysis.AD_11.mean,
        analysis.AD_11.std
      ),
      No_12_Angle_Deviation: this.random(
        analysis.AD_12.mean,
        analysis.AD_12.std
      ),
      No_13_Angle_Deviation: this.random(
        analysis.AD_13.mean,
        analysis.AD_13.std
      ),
      No_1_NASM_Deviation: this.random(analysis.ND_1.mean, analysis.ND_1.std),
      No_2_NASM_Deviation: this.random(analysis.ND_2.mean, analysis.ND_2.std),
      No_3_NASM_Deviation: this.random(analysis.ND_3.mean, analysis.ND_3.std),
      No_4_NASM_Deviation: this.random(analysis.ND_4.mean, analysis.ND_4.std),
      No_5_NASM_Deviation: this.random(analysis.ND_5.mean, analysis.ND_5.std),
      No_6_NASM_Deviation: this.random(analysis.ND_6.mean, analysis.ND_6.std),
      No_7_NASM_Deviation: this.random(analysis.ND_7.mean, analysis.ND_7.std),
      No_8_NASM_Deviation: this.random(analysis.ND_8.mean, analysis.ND_8.std),
      No_9_NASM_Deviation: this.random(analysis.ND_9.mean, analysis.ND_9.std),
      No_10_NASM_Deviation: this.random(
        analysis.ND_10.mean,
        analysis.ND_10.std
      ),
      No_11_NASM_Deviation: this.random(
        analysis.ND_11.mean,
        analysis.ND_11.std
      ),
      No_12_NASM_Deviation: this.random(
        analysis.ND_12.mean,
        analysis.ND_12.std
      ),
      No_13_NASM_Deviation: this.random(
        analysis.ND_13.mean,
        analysis.ND_13.std
      ),
      No_14_NASM_Deviation: this.random(
        analysis.ND_14.mean,
        analysis.ND_14.std
      ),
      No_15_NASM_Deviation: this.random(
        analysis.ND_15.mean,
        analysis.ND_15.std
      ),
      No_16_NASM_Deviation: this.random(
        analysis.ND_16.mean,
        analysis.ND_16.std
      ),
      No_17_NASM_Deviation: this.random(
        analysis.ND_17.mean,
        analysis.ND_17.std
      ),
      No_18_NASM_Deviation: this.random(
        analysis.ND_18.mean,
        analysis.ND_18.std
      ),
      No_19_NASM_Deviation: this.random(
        analysis.ND_19.mean,
        analysis.ND_19.std
      ),
      No_20_NASM_Deviation: this.random(
        analysis.ND_20.mean,
        analysis.ND_20.std
      ),
      No_21_NASM_Deviation: this.random(
        analysis.ND_21.mean,
        analysis.ND_21.std
      ),
      No_22_NASM_Deviation: this.random(
        analysis.ND_22.mean,
        analysis.ND_22.std
      ),
      No_23_NASM_Deviation: this.random(
        analysis.ND_23.mean,
        analysis.ND_23.std
      ),
      No_24_NASM_Deviation: this.random(
        analysis.ND_24.mean,
        analysis.ND_24.std
      ),
      No_25_NASM_Deviation: this.random(
        analysis.ND_25.mean,
        analysis.ND_25.std
      ),
      No_1_Time_Deviation: this.random(analysis.TD_1.mean, analysis.TD_1.std),
      No_2_Time_Deviation: this.random(analysis.TD_2.mean, analysis.TD_2.std),
    };
  }

  random(m, s) {
    let r = m + 2.0 * s * (Math.random() + Math.random() + Math.random() - 1.5);
    if (r < 0) return 0;
    if (r > 1) return 1;
    return r;
  }

  clearForms() {
    this.commaSeparatedForm = new FormGroup({
      allValues: new FormControl(),
    });
    this.newLineSeparatedForm = new FormGroup({
      allValues: new FormControl(),
    });
    this.singleValueForm = new FormGroup({
      No_1_Angle_Deviation: new FormControl(),
      No_2_Angle_Deviation: new FormControl(),
      No_3_Angle_Deviation: new FormControl(),
      No_4_Angle_Deviation: new FormControl(),
      No_5_Angle_Deviation: new FormControl(),
      No_6_Angle_Deviation: new FormControl(),
      No_7_Angle_Deviation: new FormControl(),
      No_8_Angle_Deviation: new FormControl(),
      No_9_Angle_Deviation: new FormControl(),
      No_10_Angle_Deviation: new FormControl(),
      No_11_Angle_Deviation: new FormControl(),
      No_12_Angle_Deviation: new FormControl(),
      No_13_Angle_Deviation: new FormControl(),
      No_1_NASM_Deviation: new FormControl(),
      No_2_NASM_Deviation: new FormControl(),
      No_3_NASM_Deviation: new FormControl(),
      No_4_NASM_Deviation: new FormControl(),
      No_5_NASM_Deviation: new FormControl(),
      No_6_NASM_Deviation: new FormControl(),
      No_7_NASM_Deviation: new FormControl(),
      No_8_NASM_Deviation: new FormControl(),
      No_9_NASM_Deviation: new FormControl(),
      No_10_NASM_Deviation: new FormControl(),
      No_11_NASM_Deviation: new FormControl(),
      No_12_NASM_Deviation: new FormControl(),
      No_13_NASM_Deviation: new FormControl(),
      No_14_NASM_Deviation: new FormControl(),
      No_15_NASM_Deviation: new FormControl(),
      No_16_NASM_Deviation: new FormControl(),
      No_17_NASM_Deviation: new FormControl(),
      No_18_NASM_Deviation: new FormControl(),
      No_19_NASM_Deviation: new FormControl(),
      No_20_NASM_Deviation: new FormControl(),
      No_21_NASM_Deviation: new FormControl(),
      No_22_NASM_Deviation: new FormControl(),
      No_23_NASM_Deviation: new FormControl(),
      No_24_NASM_Deviation: new FormControl(),
      No_25_NASM_Deviation: new FormControl(),
      No_1_Time_Deviation: new FormControl(),
      No_2_Time_Deviation: new FormControl(),
    });
  }

  ngOnInit() {
    this.clearForms();
  }

  constructor(private scoreService: ScoreService, public dialog: MatDialog) {}

  openDialog(score): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '50vh',
      data: { score: score.score[0], weakest_link: score.weakest_link },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.clearForms();
    });
  }
}
