import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard.component';

export interface DialogData {
    score: string;
  }
  
@Component({
    selector: 'app-dashboard-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})

export class ModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<DashboardComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
}