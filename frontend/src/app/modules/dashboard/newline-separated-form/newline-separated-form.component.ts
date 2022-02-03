import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ScoreService } from '../score.service';
import { DialogService } from '../../utils/dialog.service';

@Component({
  selector: 'app-newline-separated-form',
  templateUrl: './newline-separated-form.component.html',
  styleUrls: ['./newline-separated-form.component.scss'],
})
export class NewlineSeparatedFormComponent implements OnInit {
  newLineSeparatedForm: FormGroup;

  constructor(
    private scoreService: ScoreService,
    public dialogService: DialogService
  ) {}

  onSubmit(formItem) {
    let predictors = this.scoreService.convertToPredictorObject(
      formItem.allValues,
      '\n'
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

    this.newLineSeparatedForm.patchValue({
      allValues: allValuesArray.join('\n'),
    });
  }

  onClear() {
    this.clear();
  }

  ngOnInit() {
    this.clear();
  }

  clear() {
    this.newLineSeparatedForm = new FormGroup({
      allValues: new FormControl(),
    });
  }
}
