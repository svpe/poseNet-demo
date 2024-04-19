let video;
let poses = [];
let canvas;
let w = window.innerWidth;
let h = window.innerHeight;
const options = {
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'multiple',
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2,
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);


  video = createCapture(VIDEO);
  video.elt.setAttribute('playsinline', '');

  video.hide();
  const poseNet = ml5.poseNet(video, options, modelLoaded);
  // fullscreen(true);
  function modelLoaded() {
    console.log("hooray, model loaded!");
  }
  poseNet.on('pose', (results) => {
    poses = results;
  });

}

function draw() {
  frameRate(60);
  console.log(poses);
  background(0);


  // image(video, 0, 0);
  // image(video, -displayWidth, -displayHeight, displayWidth * 2, displayHeight * 2);
  fill(255, 0, 0);
  noStroke();
  rectMode(CENTER);
  if (poses.length > 0) {
    drawKeypoints();
    drawSkeleton();
  }

  function drawKeypoints() {
    push();
    fill(255, 0, 0);
    stroke(0, 0, 0);
    strokeWeight(2);
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      const { pose } = poses[i];
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        const keypoint = pose.keypoints[j];
        // Only draw a circle if the pose probability is bigger than 0.1
        if (keypoint.score > 0.1) {
          circle(keypoint.position.x, keypoint.position.y, 10);
          circle(keypoint.position.x, keypoint.position.y, 10);
        }
      }
    }
    pop();
  }
}
function drawSkeleton() {
  const {
    leftShoulder: ls,
    rightShoulder: rs,
    rightWrist: rw,
    leftWrist: lw,
    leftElbow: le,
    rightElbow: re,
    leftHip: lh,
    rightHip: rh,
    leftKnee: lk,
    rightKnee: rk,
    leftAnkle: la,
    rightAnkle: ra,
  } = poses[0].pose;


  // console.log(rw);
  // console.log(lw);
  stroke(0, 255, 0);
  noFill();
  if (le.confidence > .2 && lw.confidence > .2) { line(le.x, le.y, lw.x, lw.y); }
  if (re.confidence > .2 && rw.confidence > .2) { line(re.x, re.y, rw.x, rw.y); }
  if (le.confidence > .2 && ls.confidence > .2) { line(le.x, le.y, ls.x, ls.y); }
  if (re.confidence > .2 && rs.confidence > .2) { line(re.x, re.y, rs.x, rs.y); }
  if (lh.confidence > .2 && rh.confidence > .2 && rs.confidence > .2 && ls.confidence > .2) {
    beginShape();

    vertex(ls.x, ls.y);
    vertex(rs.x, rs.y);
    vertex(rh.x, rh.y);
    vertex(lh.x, lh.y);
    vertex(ls.x, ls.y);
    endShape();
  }

}
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}