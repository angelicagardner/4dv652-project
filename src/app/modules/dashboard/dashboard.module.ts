import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { importExpr } from '@angular/compiler/src/output/output_ast';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

// Services
import { ScoreService } from './score.service';
import { ModalComponent } from './modal.component';
import { CommaSeparatedFormComponent } from './comma-separated-form/comma-separated-form.component';
import { NewlineSeparatedFormComponent } from './newline-separated-form/newline-separated-form.component';
import { DefaultPredictorFormComponent } from './default-predictor-form/default-predictor-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
  ],
  declarations: [
    DashboardComponent,
    ModalComponent,
    CommaSeparatedFormComponent,
    NewlineSeparatedFormComponent,
    DefaultPredictorFormComponent,
  ],
  providers: [ScoreService],
})
export class DashboardModule {}
