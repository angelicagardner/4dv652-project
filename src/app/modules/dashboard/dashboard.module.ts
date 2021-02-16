import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { importExpr } from '@angular/compiler/src/output/output_ast';

// Material
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';


// Services
import { ScoreService } from './score.service'
import { ModalComponent } from './modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
    ]),

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule
  ],
  declarations: [
    DashboardComponent,ModalComponent
  ],
  providers: [
    ScoreService
  ]
})

export class DashboardModule {
}
