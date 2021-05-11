import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss']
})
export class SkeletonComponent implements OnInit {
  @ViewChild('canvas') canvasElement: ElementRef;
  private analysis: Observable<any>; 
  private poses: Observable<any>;;
  private horizontal_zoom = 1024;
  private vertical_zoom = 1024;
  private horizontal_offset = 512;
  private vertical_offset = 512;
  private depth_offset = 5; // focal length
  private vertex_radius = 60;
  private edge_width = 1;
  private vertex_color = 'rgba(255,165,0,1)';
  private edge_color = 'rgba(25,25,25,1)'; // not working

  private canvas
  private vertices = []
  private edges = []
  private pause = false
  private zr = 3.1415
  private xr = 0
  private yr = 0

  private kinect = []

  constructor(public route: ActivatedRoute, public service:ScoreService) {

  }

  sliderUpdate(value){
    this.yr = value
  }
  ngAfterViewInit():void {
    this.service.get_posenet_frames().subscribe((data)=> {
      this.service.sendPosnetData(data).subscribe((resp)=>{
        this.kinect = resp.frames
        this.canvas = this.canvasElement.nativeElement;
        this.render(this.kinect)
      })
    })
  }

  ngOnInit(): void {}


  draw() {
    const ctx_draw = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = this.edge_color;
      ctx.lineWidth = this.edge_width;
      for (let j = 0; j < this.edges.length; j++) {
        var edge_start = this.vertices[this.edges[j][0]];
        var edge_end = this.vertices[this.edges[j][1]];
        var lineStartX = edge_start[0] * this.horizontal_zoom / (this.depth_offset - edge_start[2]) + this.horizontal_offset;
        var lineStartY = edge_start[1] * this.vertical_zoom / (this.depth_offset - edge_start[2]) + this.vertical_offset;
        var lineEndX = edge_end[0] * this.horizontal_zoom / (this.depth_offset - edge_end[2]) + this.horizontal_offset;
        var lineEndY = edge_end[1] * this.vertical_zoom / (this.depth_offset - edge_end[2]) + this.vertical_offset;
        ctx.beginPath();
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.fillStyle = this.vertex_color;
      for (let i = 0; i < this.vertices.length; i++) {
        var point = this.vertices[i];
        ctx.beginPath();
        ctx.arc(point[0] * this.horizontal_zoom / (this.depth_offset - point[2]) + this.horizontal_offset, point[1] * this.vertical_zoom / (this.depth_offset - point[2]) + this.vertical_offset, this.vertex_radius / (this.depth_offset - point[2]) / 2, 0, Math.PI * 2, true);
        ctx.fill();
      }
      reqanim = window.requestAnimationFrame(ctx_draw);
    }

    if (this.canvas.getContext) {
      var ctx = this.canvas.getContext('2d');
      var reqanim;

      var mouse_x = 0;
      var mouse_y = 0;

      var mouse_down = false;

      const that = this

      ctx_draw();

      this.canvas.addEventListener('mouseover', function (e) {
        reqanim = window.requestAnimationFrame(ctx_draw);
      });

      this.canvas.addEventListener('mouseout', function (e) {
        window.cancelAnimationFrame(reqanim);
      });
      this.canvas.addEventListener('mousedown', function (e) {
        mouse_down = true;
        that.pause = true
      });
      this.canvas.addEventListener('mouseup', function (e) {
        mouse_down = false;
        that.pause = false
      });
      function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
      this.canvas.addEventListener('mousemove', function (e) {
        var mousePos = getMousePos(that.canvas, e);

        var mouse_x_prev = mouse_x;
        var mouse_y_prev = mouse_y;

        mouse_x = mousePos.x;
        mouse_y = mousePos.y;

        if (mouse_down) {
          that.set_xr((mouse_x_prev - mouse_x) / 100);
          that.set_yr((mouse_y_prev - mouse_y) / 100);
        }
      });


    }
  }

  rotateZ(theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    for (let i = 0; i < this.vertices.length; i++) {
      var x = this.vertices[i][0];
      var y = this.vertices[i][1];

      this.vertices[i][0] = x * cosTheta - y * sinTheta;
      this.vertices[i][1] = y * cosTheta + x * sinTheta;
    }
  }

  rotateY(theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    for (let i = 0; i < this.vertices.length; i++) {
      var x = this.vertices[i][0];
      var z = this.vertices[i][2];

      this.vertices[i][0] = x * cosTheta - z * sinTheta;
      this.vertices[i][2] = z * cosTheta + x * sinTheta;
    }
  }

  rotateX(theta) {
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    for (let i = 0; i < this.vertices.length; i++) {
      var y = this.vertices[i][1];
      var z = this.vertices[i][2];

      this.vertices[i][1] = y * cosTheta - z * sinTheta;
      this.vertices[i][2] = z * cosTheta + y * sinTheta;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get_vertices(frame) {
    let v = []
    v.push([frame.head_x, frame.head_y, frame.head_z])  // 0
    v.push([frame.left_shoulder_x, frame.left_shoulder_y, frame.left_shoulder_z]) // 1
    v.push([frame.left_elbow_x, frame.left_elbow_y, frame.left_elbow_z]) // 2
    v.push([frame.right_shoulder_x, frame.right_shoulder_y, frame.right_shoulder_z]) // 3
    v.push([frame.right_elbow_x, frame.right_elbow_y, frame.right_elbow_z]) // 4
    v.push([frame.left_hand_x, frame.left_hand_y, frame.left_hand_z]) // 5
    v.push([frame.right_hand_x, frame.right_hand_y, frame.right_hand_z]) // 6
    v.push([frame.left_hip_x, frame.left_hip_y, frame.left_hip_z]) // 7
    v.push([frame.right_hip_x, frame.right_hip_y, frame.right_hip_z]) // 8
    v.push([frame.left_knee_x, frame.left_knee_y, frame.left_knee_z]) // 9
    v.push([frame.right_knee_x, frame.right_knee_y, frame.right_knee_z]) // 10
    v.push([frame.left_foot_x, frame.left_foot_y, frame.left_foot_z]) // 11
    v.push([frame.right_foot_x, frame.right_foot_y, frame.right_foot_z]) // 12

    return v
  }

  set_xr(r) {
    this.xr = r
  }

  set_yr(r) {
    this.yr = r
  }

  async render(frames) {
    let loop = 15
    while (loop > 0) {
      for (const frame of frames) {
        while (this.pause) {
          await this.sleep(100)
        }

        this.vertices = this.get_vertices(frame);

        this.edges = [
          [1, 3],
          [1, 2],
          [3, 4],
          [4, 6],
          [2, 5],
          [3, 8],
          [1, 7],
          [7, 8],
          [8, 10],
          [7, 9],
          [9, 11],
          [10, 12]
        ];



        this.draw();

        this.rotateZ(this.zr);
        this.rotateY(this.yr);

        await this.sleep(75)

      }
      loop--
    }
  }

}
