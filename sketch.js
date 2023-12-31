
//declaring variables, combining from both source documents
let img;
let numSegments = 80;
let segments;
let particles = [];
let attractors = [];
let nParticles = 1000;//number of particles

//loading the original image jpg
function preload() {
  img = loadImage('assets/Edvard_Munch_The_Scream.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  let segmentWidth = img.width / numSegments;//width and height of each segment
  let segmentHeight = img.height / numSegments;	

  segments = make2Darray(numSegments, numSegments);
//objects for segments
  for (let y = 0; y < numSegments; y++) {
    for (let x = 0; x < numSegments; x++) {
      let segXPos = x * segmentWidth;
      let segYPos = y * segmentHeight;
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      segments[y][x] = new ImageSegment(segXPos, segYPos, segmentWidth, segmentHeight, segmentColour);
    }
  }

//particles added  
  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(0);
  // Render the 3D block effect
  for (let y = 0; y < segments.length; y++) {
    for (let x = 0; x < segments[y].length; x++) {
      segments[y][x].draw();
    }
  }

  // Update and display particles
  strokeWeight(attractors.length * 5);//increasing stroke weight to 5
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }

  // Update attractors' lifetime
  for (let i = 0; i < attractors.length; i++) {
    attractors[i].lifeTime--;
    if (attractors[i].lifeTime <= 0) {
      attractors.splice(i, 1);
    }
  }
}

//create 2D array
function make2Darray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

//adding new attractor to attractor array when clicking mouse
function mousePressed() {
  attractors.push(new Attractor(mouseX, mouseY));
}

class ImageSegment {
  constructor(srcImgSegXPosInPrm, srcImgSegYPosInPrm, srcImgSegWidthInPrm, srcImgSegHeightInPrm, srcImgSegColourInPrm) {
    this.srcImgSegXPos = srcImgSegXPosInPrm;
    this.srcImgSegYPos = srcImgSegYPosInPrm;
    this.srcImgSegWidth = srcImgSegWidthInPrm;
    this.srcImgSegHeight = srcImgSegHeightInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
  }

  draw() {
    //shadow and highlight colours
    let depth = 3;    
    let shadowColor = color(red(this.srcImgSegColour) * 0.8, green(this.srcImgSegColour) * 0.8, blue(this.srcImgSegColour) * 0.8);
    let highlightColor = color(red(this.srcImgSegColour) * 1.2, green(this.srcImgSegColour) * 1.2, blue(this.srcImgSegColour) * 1.2);

    // Main block color
    fill(this.srcImgSegColour);
    noStroke();
    rect(this.srcImgSegXPos, this.srcImgSegYPos, this.srcImgSegWidth, this.srcImgSegHeight);

    // Top highlight
    fill(highlightColor);
    beginShape();
    vertex(this.srcImgSegXPos, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth, this.srcImgSegYPos);
    vertex(this.srcImgSegXPos + this.srcImgSegWidth - depth, this.srcImgSegYPos - depth);
    vertex(this.srcImgSegXPos - depth, this.srcImgSegYPos - depth);
    endShape(CLOSE);

    let bumpDiameter = min(this.srcImgSegWidth, this.srcImgSegHeight) * 0.4;
    // Shadow for bump
    fill(0, 0, 0, 100); // semi-transparent black for shadow
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5 + 2, this.srcImgSegYPos + this.srcImgSegHeight * 0.5-0.5, bumpDiameter, bumpDiameter);

    // Lego bump
    fill(220);
    ellipse(this.srcImgSegXPos + this.srcImgSegWidth * 0.5, this.srcImgSegYPos + this.srcImgSegHeight * 0.5-2, bumpDiameter, bumpDiameter);
  }
}


