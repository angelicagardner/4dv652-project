import { Injectable } from '@angular/core';
import { ModalComponent } from '../dashboard/modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  openDialog(data): MatDialogRef<ModalComponent, any> {
    return this.dialog.open(ModalComponent, {
      width: '50vh',
      data,
    });
  }
}
