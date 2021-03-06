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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

// Services
import { ScoreService } from './score.service';
import { ModalComponent } from './modal.component';
import { CommaSeparatedFormComponent } from './comma-separated-form/comma-separated-form.component';
import { NewlineSeparatedFormComponent } from './newline-separated-form/newline-separated-form.component';
import { DefaultPredictorFormComponent } from './default-predictor-form/default-predictor-form.component';
import { LiveFeedComponent } from './live-feed/live-feed.component';
import { ParameterFeedComponent } from './parameter-feed/parameter-feed.component';
import { OptionCardComponent } from './option-card/option-card.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent },
      { path: 'params', component: ParameterFeedComponent },
      { path: 'webcam', component: LiveFeedComponent },
      { path: 'video', component: UploadVideoComponent },
      { path: 'skeleton', component: SkeletonComponent },
    ]),

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSliderModule
  ],
  declarations: [
    DashboardComponent,
    ModalComponent,
    CommaSeparatedFormComponent,
    NewlineSeparatedFormComponent,
    DefaultPredictorFormComponent,
    LiveFeedComponent,
    ParameterFeedComponent,
    OptionCardComponent,
    UploadVideoComponent,
    SkeletonComponent,
  ],
  providers: [ScoreService],
})
export class DashboardModule {}
