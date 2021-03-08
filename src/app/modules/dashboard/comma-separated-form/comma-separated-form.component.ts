import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScoreService } from '../score.service';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'app-comma-separated-form',
  templateUrl: './comma-separated-form.component.html',
  styleUrls: ['./comma-separated-form.component.scss'],
})
export class CommaSeparatedFormComponent implements OnInit {
  commaSeparatedForm: FormGroup;

  constructor(
    private scoreService: ScoreService,
    public dialogService: DialogService
  ) {}

  onSubmit(formItem) {
    let predictors = this.scoreService.convertToPredictorObject(
      formItem.allValues,
      ','
    );

    this.scoreService.validatePredictors(predictors);

    this.scoreService.predictScore(predictors).subscribe((data) => {
      let dialog = this.dialogService.openDialog(data);

      dialog.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        this.clear();
      });
    });
  }

  onGenerateDemo() {
    let allValues = this.scoreService.getRandomPredictors();
    let allValuesArray = [];

    Object.keys(allValues).forEach((item) => {
      allValuesArray.push(allValues[item]);
    });

    this.commaSeparatedForm.patchValue({
      allValues: allValuesArray.join(' ,  '),
    });
  }

  onClear() {
    this.clear();
  }

  ngOnInit() {
    this.clear();
  }

  clear() {
    this.commaSeparatedForm = new FormGroup({
      allValues: new FormControl(),
    });
  }
}
