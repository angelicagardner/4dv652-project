const color = "aqua";
const boundingBoxColor = "red";
const lineWidth = 2;

function toTuple({ y, x }) {
  return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
function drawBoundingBox(keypoints, ctx) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX,
    boundingBox.minY,
    boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY
  );

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
}

/**
 * Converts an arary of pixel data into an ImageData object
 */
async function renderToCanvas(a, ctx) {
  const [height, width] = a.shape;
  const imageData = new ImageData(width, height);

  const data = await a.data();

  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;

    imageData.data[j + 0] = data[k + 0];
    imageData.data[j + 1] = data[k + 1];
    imageData.data[j + 2] = data[k + 2];
    imageData.data[j + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Draw an image on a canvas
 */
function renderImageToCanvas(image, size, canvas) {
  canvas.width = size[0];
  canvas.height = size[1];
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);
}

const state = {
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
  files:null
};

const videoWidth = 960;
const videoHeight = 540;
let fIndex = 0;
const reader = new FileReader()
let video
let poses = [];

reader.onload = async (e) => {
  // The file reader gives us an ArrayBuffer:
  let buffer = e.target.result;

  // We have to convert the buffer to a blob:
  if( typeof buffer != 'string'){
    let videoBlob = new Blob([new Uint8Array(buffer)], { type: 'mp4' });

    // The blob gives us a URL to the video file:
    let url = window.URL.createObjectURL(videoBlob);

    video.src = url;
    video.load()
  }
}

function generatePosesHeaders(poses) {
  const headers = {};
  poses[0].keypoints.forEach((target) => {
    let title = this.add_underscore(target.part);
    headers[title + '_x'] = title + '_x';
    headers[title + '_y'] = title + '_y';
    headers[title + '_score'] = title + '_score';
  });

  headers['score'] = 'score'

  return headers;
}

function generatePosesItems(poses) {
  const items = [];
  poses.forEach((pose) => {
    let item = {};
    pose.keypoints.forEach((target) => {
      let title = add_underscore(target.part);
      item[title + '_x'] = target.position.x;
      item[title + '_y'] = target.position.y;
      item[title + '_score'] = target.score;
    });

    item['score'] = pose.score
    items.push(item);
  });
  return items;
}

function add_underscore(label) {
  return label.replace(/[A-Z]/g, function (key) {
    return '_' + key.toLowerCase();
  });
}

function convertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ',';

      line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = this.convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', exportedFilenmae);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function download(headers, items, fileTitle) {
  this.exportCSVFile(headers, items, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}
let frame =1
async function detectPoseInRealTime(video) {
  const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.
  const flipPoseHorizontal = true;

  canvas.width = videoWidth;
  canvas.height = videoHeight;

  async function poseDetectionFrame() {
    let minPoseConfidence = 0;
    let minPartConfidence = 0;

    const pose = await state.net.estimatePoses(video, {
      flipHorizontal: flipPoseHorizontal,
      decodingMethod: "single-person",
    });

    poses = poses.concat(pose);

    // minPoseConfidence = +state.singlePoseDetection.minPoseConfidence;
    // minPartConfidence = +state.singlePoseDetection.minPartConfidence;

    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (state.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    pose.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
        if (state.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (state.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (state.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });
    requestAnimationFrame(poseDetectionFrame);
  }

  await poseDetectionFrame();
}

async function run(){
  if (fIndex < state.files.length) {
    const vFile = state.files[fIndex]
    reader.readAsArrayBuffer(vFile)
  }
  else{
    location.reload();
  }
}

async function intialProcess() {
  state.net = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: {
        width: videoWidth / 2,
        height: videoHeight / 2
      },
      quantBytes: 2,
  });

  fIndex=0

  run()
}



(()=>{
  document.querySelector('#parsebtn').addEventListener('click', ()=>{
    video = document.getElementById("video");
    video.width = videoWidth;
    video.height = videoHeight;

    video.addEventListener('loadeddata', async () => {
      console.log('start capturing');
      await detectPoseInRealTime(video, state.net);
    });


    video.addEventListener('ended', () => {
      console.log('Stop capturing');
      // Save poses
      const regex = /\..*/i;
      exportCSVFile(
        this.generatePosesHeaders(poses),
        this.generatePosesItems(poses),
        state.files[fIndex].name.replace(regex, ''))

      poses = [];
      fIndex++
      setTimeout(() => {
        run()
      }, 500);
    });

    state.files = document.querySelector('#videoFiles').files
    intialProcess()
    console.log('done');
  })
})()

