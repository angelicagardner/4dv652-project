import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScoreService } from '../score.service';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'app-default-predictor-form',
  templateUrl: './default-predictor-form.component.html',
  styleUrls: ['./default-predictor-form.component.scss'],
})
export class DefaultPredictorFormComponent implements OnInit {
  singleValueForm: FormGroup;

  constructor(
    private scoreService: ScoreService,
    public dialogService: DialogService
  ) {}

  onSubmit(formItem) {
    this.scoreService.validatePredictors(formItem);

    this.scoreService.predictScore(formItem).subscribe((data) => {
      let dialog = this.dialogService.openDialog(data);

      dialog.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        this.clear();
      });
    });
  }

  onGenerateDemo() {
    let allValues = this.scoreService.getRandomPredictors();

    this.singleValueForm.patchValue(allValues);
  }

  onClear() {
    this.clear();
  }

  clear() {
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
    this.clear();
  }
}
