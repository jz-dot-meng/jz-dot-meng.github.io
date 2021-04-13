// based off code from Franks laboratory

const canvas = document.getElementById("canvas1");
// remembering const (for static) and let (for manipulable) are currently more accepted than var
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// initialise array of particles
let particlesArray;

// get mouse position as dictionary
let mouse = {
  x: null - 60, // account for margin
  y: null,
  radius: (canvas.height/100)*(canvas.width/100),
}

// event listener
window.addEventListener("mousemove", function(event){mouse.x = event.x; mouse.y = event.y;});

// class creation - 'js classes are "syntactical sugar" over prototype-based inheritance (object constructor vs class object?)
class Particle {
  constructor(x,y,directionX,directionY,size,color){
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    // personally want pointsize to be uniform, but nice to have a variable
    this.size = size;
    this.color = color;
  }
  // methods for drawing particles
  draw(){
    // beginPath() begins a path, or resets current path
    ctx.beginPath();
    // arc draws a circle, params(x,y,rad,startAng,endAng,counterclockwise)
    ctx.arc(this.x,this.y,this.size, 0, Math.PI*2, false);
    ctx.fillStyle = "E62600";
    ctx.fill();
  }
  // check particle pos, mouse pos, move particle pos and draw
  update(){
    // first check if particle is still within the canvas; reverse direction if outside bounds
    if(this.x > canvas.width || this.x < 0){
      this.directionX = -this.directionX;
    }
    if(this.y > canvas.height || this.y < 0){
      this.directionY = -this.directionY;
    }
    this.x += this.directionX;
    this.y += this.directionY;
    // draw particle
    connectparticles();
    this.draw();
  }
}

function init(){
  particlesArray = [];
  let numberOfParticles = canvas.height*canvas.width/9000;
  for(let i=0; i<numberOfParticles; i++){
      let size = 2;
      let x = (Math.random() * ((window.innerWidth - size*2) - size*2) + size*2);
      let y = (Math.random() * ((window.innerHeight - size*2) - size*2) + size*2);
      let directionX = Math.random()*2 - 1.0;
      let directionY = Math.random()*2 - 1.0;
      let color = "E62600";
      
      particlesArray.push(new Particle(x,y,directionX,directionY,size,color));
  };
}
  
  // animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    
    for(let i = 0; i < particlesArray.length; i++){
      particlesArray[i].update();
    }
}

// check if particles are close enough to draw line
function connectparticles(){
  for(let a = 0; a < particlesArray.length;a++){
    for(let b = a; b < particlesArray.length;b++){
      let distance = ( (particlesArray[a].x - particlesArray[b].x)*(particlesArray[a].x - particlesArray[b].x) + (particlesArray[a].y - particlesArray[b].y)*(particlesArray[a].y - particlesArray[b].y) );
      if(distance < (canvas.width/16)*(canvas.height/16)){
        ctx.strokeStyle= "rgba(240, 240, 240, 1)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}
  
init(); 
animate();
