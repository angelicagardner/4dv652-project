import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PosenetService } from '../../utils/posenet.service';
import { RendererService } from '../../utils/renderer.service';
import { Upload, UploadService } from '../../utils/upload.service';

@Component({
  selector: 'app-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss']
})
export class UploadVideoComponent implements OnDestroy {
  file: File | null = null
  upload: Upload | undefined
  @ViewChild('videofeed') videoElement: ElementRef;
  @ViewChild('canvas') canvasElement: ElementRef;
  private videoWidth = 960;
  private videoHeight = 540;
  private video = null;
  private canvas = null;
  private posenet;

  private capture = false;
  public fps = 0;
  public rendered = 0;
  public poses = [];

  private state = {
    algorithm: 'single-pose',
    input: {
      architecture: 'ResNet50',
      outputStride: 16,
      inputResolution: 600,
      multiplier: 1,
      quantBytes: 2,
    },
    singlePoseDetection: {
      minPoseConfidence: 0.1,
      minPartConfidence: 0.5,
    },
    multiPoseDetection: {
      maxPoseDetections: 5,
      minPoseConfidence: 0.15,
      minPartConfidence: 0.1,
      nmsRadius: 30.0,
    },
    output: {
      showVideo: true,
      showSkeleton: true,
      showPoints: true,
      showBoundingBox: false,
    },
    net: null,
  };

  private subscription: Subscription | undefined

  constructor(public posenetService: PosenetService,
              public renderer: RendererService,
              public uploads: UploadService) {}

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file = files.item(0)
    }
  }

  async detectPoseInRealTime() {
    const ctx = this.canvas.getContext('2d');
    let srartTime: number = Date.now();

    // since images are being fed from a webcam, we want to feed in the
    // original image and then just flip the keypoints' x coordinates. If instead
    // we flip the image, then correcting left-right keypoint pairs requires a
    // permutation on all the keypoints.
    const flipPoseHorizontal = true;

    this.canvas.width = this.videoWidth;
    this.canvas.height = this.videoHeight;

    const that = this;

    async function poseDetectionFrame() {
      let poses = [];
      let minPoseConfidence;
      let minPartConfidence;

      const pose = await that.posenet.estimatePoses(that.video, {
        flipHorizontal: flipPoseHorizontal,
        decodingMethod: 'single-person',
      });

      poses = poses.concat(pose);

      minPoseConfidence = +that.state.singlePoseDetection.minPoseConfidence;
      minPartConfidence = +that.state.singlePoseDetection.minPartConfidence;

      ctx.clearRect(0, 0, that.videoWidth, that.videoHeight);

      if (that.state.output.showVideo) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-that.videoWidth, 0);
        ctx.drawImage(that.video, 0, 0, that.videoWidth, that.videoHeight);
        ctx.restore();
      }

      // For each pose (i.e. person) detected in an image, loop through the poses
      // and draw the resulting skeleton and keypoints if over certain confidence
      // scores
      poses.forEach(({ score, keypoints }) => {
        if (score >= minPoseConfidence) {
          // capture pose objects in a list
          if (that.capture) {
            that.rendered++;
            that.poses.push(keypoints);

            if (that.rendered % 5 === 0) {
              that.fps = 5 / ((Date.now() - srartTime) / 1000);
              srartTime = Date.now();
            }
          }
          // Show points on canvas
          if (that.state.output.showPoints) {
            that.renderer.drawKeypoints(keypoints, minPartConfidence, ctx);
          }
          // Draw skeleton on canvas
          if (that.state.output.showSkeleton) {
            that.renderer.drawSkeleton(
              that.posenetService.getAdjacentKeyPoints(
                keypoints,
                minPartConfidence
              ),
              ctx
            );
          }
          // Draw bounding box on canvas
          if (that.state.output.showBoundingBox) {
            that.renderer.drawBoundingBox(
              that.posenetService.getBoundingBox(keypoints),
              ctx
            );
          }
        }
      });

      requestAnimationFrame(poseDetectionFrame);
    }

    poseDetectionFrame();
  }

  onSubmit() {
    if (this.file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        // The file reader gives us an ArrayBuffer:
        let buffer = e.target.result;
        console.log(this.file);

        // We have to convert the buffer to a blob:
        if( typeof buffer != 'string'){
          let videoBlob = new Blob([new Uint8Array(buffer)], { type: this.file.type });

          // The blob gives us a URL to the video file:
          let url = window.URL.createObjectURL(videoBlob);

          this.videoElement.nativeElement.src = url;

          this.video = this.videoElement.nativeElement;
          this.canvas = this.canvasElement.nativeElement;

          this.posenet = await this.posenetService.getNet({
            width: this.videoWidth / 2,
            height: this.videoHeight / 2
          });

          this.video.width = this.videoWidth;
          this.video.height = this.videoHeight;

          await this.video.load()

          this.video.addEventListener('loadeddata', () => {
            console.log('start capturing');
            this.capture = true;
            this.detectPoseInRealTime();
          });

          this.video.addEventListener('ended', (event) => {
            console.log('Stop capturing');
            this.capture = false;

            console.log(this.poses);
            this.poses = [];

          });
        }
      }
      reader.readAsArrayBuffer(this.file)

    //   this.subscription = this.uploads.upload(this.file)
    //     .subscribe((upload) => {
    //       this.upload = upload
    //       if( upload.body ){
    //         window.open(upload.body.file, '_blank');
    //       }
    //     })
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
