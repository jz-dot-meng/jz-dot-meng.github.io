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
  x: null,
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
    // check collision detection w/ mouse
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    // distance between centres
    let distance = Math.sqrt(dx*dx + dy*dy);
    // if distance between centres is less than the two radius combined
    if(distance < this.size + mouse.radius){
      // if mouse.x is less than this.x, mouse is to left of point, so push the point further right... etc
      // is there a neater way of doing this?
      if(mouse.x < this.x && this.x < canvas.width - this.size*10){
        this.x+=10;
      }
      if(mouse.x > this.x && this.x > this.size*10){
        this.x-=10;
      }
      if(mouse.y > this.y && this.y < canvas.height - this.size*10){
        this.y+=10;
      }
      if(mouse.y < this.y && this.y > this.size*10){
        this.y-=10;
      }
    }
    this.x += this.directionX;
    this.y += this.directionY;
    // draw particle
    this.draw();
  }
}

function init(){
  particlesArray = [];
  let numberOfParticles = canvas.height*canvas.width/9000;
  for(let i=0; i<numberOfParticles; i++){
    let size = 2;
    let x = (Math.random() * (window.innerWidth - size*2) - (size*2)) + size*2);
    let y = (Math.random() * (window.innerHeight - size*2) - (size*2)) + size*2);
    let directionX = Math.random()*2 - 1.0;
    let directionY = Math.random()*2 - 1.0;
    let color = "E62600";
    
    particlesArray.push(new Particle(x,y,directionX,directionY,size,color));
    
  }
  
  // animation loop
  function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    
    for(let i = 0; i < particlesArray.length; i++){
      particlesArray[i].update();
    }
  }
  
  init(); 
  animate();
