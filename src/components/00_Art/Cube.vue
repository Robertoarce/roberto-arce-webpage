
<template>
  <div class="relative">
    <div ref="scene"></div>
    <Typing class="z-40" />
  </div>
</template>
<script>
import p5 from 'p5';
import Typing from './Typing.vue';
export default {
  data() {
    return {
      p5Instance: null,
      balls: [],
      cubeColor: [150, 150, 0],
      nextColorChangeTime: 0,
      draggedBall: null,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
      rotationX: Math.PI / 6,
      rotationZ: Math.PI / 4,
      cubePos: { x: 0, y: 0, z: 0 },
      cubeSize: 100,
      collisionsEnabled: false,
      balls_count: 30,
    };
  },
  mounted() {
    this.p5Instance = new p5(this.sketch, this.$refs.scene);
  },
  beforeDestroy() {
    this.p5Instance.remove();
  },
  methods: {
    sketch(p) {
      class Ball {
        constructor(p, x = p.random(-1, 1), y = p.random(-1, 1), z = p.random(-1, 1),
          radius = p.random(21, 51)) {
          this.p = p;
          this.pos = p.createVector(x, y, z);
          this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1), p.random(-1, 1));
          this.acc = p.createVector(0, 0, 0);
          this.color = p.color(p.random(255), p.random(255), p.random(255));
          this.radius = radius;
        }
        applyForce(force) {
          this.acc.add(force);
        }

        resolveCollision(other) {
          const normal = p5.Vector.sub(other.pos, this.pos);
          const overlap = (this.radius + other.radius) - normal.mag();
          normal.normalize();
          normal.mult(overlap / 2);  // Assuming equal mass for simplicity
          other.pos.add(normal);
          this.pos.sub(normal);
          // Assuming perfectly elastic collision and equal mass for simplicity
          const relativeVelocity = p5.Vector.sub(this.vel, other.vel);
          const force = normal.copy().mult(relativeVelocity.dot(normal));
          this.applyForce(force);
          other.applyForce(force.mult(-4));
        };

        resolveCollisionCube(cubePos) {
          const normal = p5.Vector.sub(this.pos, p.createVector(cubePos.x, cubePos.y, cubePos.z));
          normal.normalize();
          normal.mult(-0.1);  // Adjusted force magnitude here
          this.applyForce(normal);
        }
        checkCollision(balls, index, cubePos, cubeSize) {
          if (this.p.collisionsEnabled) {  // Check the collisionsEnabled flag
            for (let i = 0; i < balls.length; i++) {
              if (i !== index) {
                let other = balls[i];
                let distance = this.pos.dist(other.pos);
                if (distance < this.radius + other.radius) {
                  this.resolveCollision(other);  // Resolve collision with other balls
                }
              }
            }
            // Check for collision with the cube outside the loop
            let distanceToCube = this.pos.dist(p.createVector(cubePos.x, cubePos.y, cubePos.z));
            if (distanceToCube < this.radius + cubeSize / 2) {
              this.resolveCollisionCube(cubePos);  // Resolve collision with cube
            }
          }
        }
        moveToCube(cubePos) {
          const force = p5.Vector.sub(p.createVector(cubePos.x, cubePos.y, cubePos.z), this.pos);
          force.mult(0.005);  // Adjusted force magnitude here
          this.applyForce(force);
        }
        update() {
          this.vel.add(this.acc);
          this.vel.mult(1);  // reduce velocity over time
          if (this.vel > 100) {
            this.vel = 1; // limit the velocity
          }
          this.pos.add(this.vel);
          this.acc.mult(0);
        }
        display() {
          this.p.push();
          this.p.translate(this.pos.x, this.pos.y, this.pos.z);
          this.p.ambientMaterial(this.color);
          this.p.sphere(this.radius);
          this.p.pop();
        }
      }
      p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        for (let i = 0; i < this.balls_count; i++) {
          this.balls.push(new Ball(p));
        }
        this.nextColorChangeTime = p.millis() + p.random(1000, 15000);
      };
      p.draw = () => {
        p.clear();
        p.ambientLight(150);  // Adding ambient light
        p.directionalLight(255, 255, 255, 0, 1, -1);  // Adding directional light

        if (p.millis() > this.nextColorChangeTime) {
          this.cubeColor = [p.random(255), p.random(255), p.random(255)];
          this.nextColorChangeTime = p.millis() + p.random(1000, 15000);
        }
        p.rotateX(this.rotationX);
        p.rotateZ(this.rotationZ);
        p.push();
        p.stroke(0);
        p.fill(...this.cubeColor);
        p.box(100, 100, 100);
        p.pop();
        this.balls.forEach((ball, i) => {
          ball.checkCollision(this.balls, i, this.cubePos, this.cubeSize);  // Modified to include cubeSize
          ball.update();
          ball.display();
        });
      };
      p.mousePressed = () => {
        this.isDragging = true;
        this.lastMouseX = p.mouseX;
        this.lastMouseY = p.mouseY;
        const d = p.dist(p.mouseX - p.width / 2, p.mouseY - p.height / 2, this.cubePos.x, this.cubePos.y);
        if (d < this.cubeSize / 2) {
          this.balls.forEach(ball => {
            ball.moveToCube(this.cubePos);  // Corrected method call
          });
          this.collisionsEnabled = true;  // Enable collisions when the cube is clicked
        }
      };
      p.mouseReleased = () => {
        this.isDragging = false;
      };
      p.mouseDragged = () => {
        if (this.isDragging) {
          const dx = p.mouseX - this.lastMouseX;
          const dy = p.mouseY - this.lastMouseY;
          this.rotationX += dy * 0.01;
          this.rotationZ += dx * 0.01;
          this.lastMouseX = p.mouseX;
          this.lastMouseY = p.mouseY;
        };
      };
    },
  },
};
</script>
<style scoped>
div {
  position: static;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: #0F2027;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #2C5364, #203A43, #0F2027);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #1e6280, #203A43, #0F2027);
  z-index: 0;
}
</style> 
