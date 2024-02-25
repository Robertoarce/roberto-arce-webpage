//Planet.js

export class Particle {
  constructor(p){
    this.p = p;
    this.x = p.random(0, p.width);
    this.y = p.random(0, p.height);
    this.r = p.random(13,20);
    this.xSpeed = p.random(-2,2);
    this.ySpeed = p.random(-1,1.5);

    this.color = 'rgba(200,169,169,0.5)';
  }

  createParticle() {
    this.p.noStroke();
    this.p.fill(this.color); 
    this.p.circle(this.x, this.y, this.r * 2);
  }

  moveParticle() {
    if(this.x < 0 || this.x > this.p.width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > this.p.height)
      this.ySpeed*=-1;
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

  checkCollision(particles) {
    for (let i = 0; i < particles.length; i++) {
        let dis = this.p.dist(this.x, this.y, particles[i].x, particles[i].y);
        let combinedRadii = this.r + particles[i].r;
        if (dis < combinedRadii && dis > 0) {
            this.handleCollision(particles[i], particles);
        }
    }
} 
 

  handleCollision(otherParticle, particles) {
    if (this.color === 'blue' && otherParticle.color === 'blue') {
      // Merge two blue balls into one orange ball
      this.mergeBalls(otherParticle, particles, 'orange');
    } else if (this.color === 'orange' && otherParticle.color === 'orange') {
      // Check for a third orange ball
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].color === 'orange' && particles[i] !== this && particles[i] !== otherParticle) {
          // Merge three orange balls into one default color ball
          
          this.mergeBalls(otherParticle, particles, 'default', particles[i]);
          break;
        }
      }
    }
  }

  mergeBalls(otherParticle, particles, newColor, thirdParticle = null) {
    // Sum up the diameters
    let combinedRadii = this.r + otherParticle.r;
    
    newParticle.r = combinedRadii;
    if (thirdParticle) {
      newDiameter += thirdParticle.r;
    }

    // Create a new ball at the average position
    let newX = (this.x + otherParticle.x) / 2;
    let newY = (this.y + otherParticle.y) / 2;

    // Remove the original balls from the particles array
    particles.splice(particles.indexOf(this), 1);
    particles.splice(particles.indexOf(otherParticle), 1);
    if (thirdParticle) {
      particles.splice(particles.indexOf(thirdParticle), 1);
    }

    // Add a new ball with the summed diameter and new color
  let newParticle = new Particle(this.p);
  newParticle.x = newX;
  newParticle.y = newY;
  newParticle.r = newDiameter;
  
  if (newColor === 'default') {
    newParticle.color = 'rgba(200,169,169,0.5)';
  } else {
    newParticle.color = newColor;
  }
  
  particles.push(newParticle);
}
}
  

export class ExplosionParticle {
  constructor(p, x, y) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.r = p.random(1, 3);
    this.xSpeed = p.random(-3, 3);
    this.ySpeed = p.random(-3, 3);
    this.alpha = 255;  // Max alpha value
  }

  createParticle() {
    let redValue = this.p.map(this.alpha, 255, 0, 255, 0);
    let greenValue = this.p.map(this.alpha, 255, 127, 165, 0);  // Adjusted threshold to 127 for orange transition
    let currentRadius = this.p.map(this.alpha, 255, 0, this.r * 2, this.r);
    
    this.p.noStroke();
    this.p.fill(redValue, greenValue, 0, this.alpha);  // Use redValue and greenValue here
    this.p.circle(this.x, this.y, currentRadius);  // Use currentRadius here
  }

  moveParticle() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.alpha -= 5;  // Fade out over time
    if (this.alpha < 0) {  // Ensure alpha doesn't go below 0
      this.alpha = 0;
    }
  }
}

  export function mousePressed(p, particles, explosionParticles) {
    let shockwaveRadius = 50;
    let explosionParticleCount = 50; 
    
    
    for(let i = 0; i < particles.length; i++) {
      let d = p.dist(p.mouseX, p.mouseY, particles[i].x, particles[i].y);
      if (d < shockwaveRadius) {
        let angle = p.atan2(particles[i].y - p.mouseY, particles[i].x - p.mouseX);
        let force = p.map(d, 0, shockwaveRadius, 5, 0);
        
        particles[i].color = 'rgba(255,0,0,0.5)';

        particles[i].xSpeed += force * p.cos(angle);
        particles[i].ySpeed += force * p.sin(angle);
      }
    }
    for(let i = 0; i < explosionParticleCount; i++) {
      explosionParticles.push(new ExplosionParticle(p, p.mouseX, p.mouseY));
    }
  }