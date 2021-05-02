import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Upload, UploadService } from '../../utils/upload.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnDestroy {
  file: File | null = null
  upload: Upload | undefined

  private subscription: Subscription | undefined

  constructor(private uploads: UploadService) {}

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0)
    }
  }

  onSubmit() {
    if (this.file) {
      this.subscription = this.uploads.upload(this.file)
                                      .subscribe((upload) => {
                                        this.upload = upload
                                        if( upload.body ){
                                          window.open(upload.body.file, '_blank');
                                        }
                                      })
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
