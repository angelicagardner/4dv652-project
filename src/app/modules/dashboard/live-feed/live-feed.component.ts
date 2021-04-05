import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PosenetService } from 'src/app/modules/utils/posenet.service';
import { RendererService } from 'src/app/modules/utils/renderer.service';
import { CsvGeneratorService } from 'src/app/modules/utils/csv-generator.service';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrls: ['./live-feed.component.scss'],
})
export class LiveFeedComponent {
  @ViewChild('videofeed') videoElement: ElementRef;
  @ViewChild('canvas') canvasElement: ElementRef;
  private videoWidth = 600;
  private videoHeight = 500;
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
      outputStride: 32,
      inputResolution: 250,
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

  constructor(
    public posenetService: PosenetService,
    public renderer: RendererService,
    public csvService: CsvGeneratorService
  ) {}

  async ngAfterViewInit() {
    this.video = this.videoElement.nativeElement;
    this.canvas = this.canvasElement.nativeElement;

    this.posenet = await this.posenetService.getNet();

    this.setupCamera();

    this.video.onloadedmetadata = () => {
      this.detectPoseInRealTime();
    };
  }

  async setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available'
      );
    }

    this.video.width = this.videoWidth;
    this.video.height = this.videoHeight;

    const mobile = false;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: 'user',
        width: mobile ? undefined : this.videoWidth,
        height: mobile ? undefined : this.videoHeight,
      },
    });

    this.video.srcObject = stream;
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

  public start() {
    this.capture = true;
  }

  public stop() {
    this.capture = false;
    this.fps = 0;
    this.rendered = 0;
    this.csvService.download(
      this.generatePosesHeaders(),
      this.generatePosesItems(),
      'posenet'
    );
    this.poses = [];
  }

  generatePosesHeaders() {
    const headers = {};

    this.poses[0].forEach((target) => {
      let title = this.add_underscore(target.part);
      headers[title + '_x'] = title + '_x';
      headers[title + '_y'] = title + '_y';
    });

    return headers;
  }

  generatePosesItems() {
    const items = [];
    this.poses.forEach((pose) => {
      let item = {};
      pose.forEach((target) => {
        let title = this.add_underscore(target.part);
        item[title + '_x'] = target.position.x;
        item[title + '_y'] = target.position.y;
      });

      items.push(item);
    });

    return items;
  }

  add_underscore(label: string) {
    return label.replace(/[A-Z]/g, function (key) {
      return '_' + key.toLowerCase();
    });
  }
}
