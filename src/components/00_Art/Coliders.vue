<template>
  <div ref="canvasContainer"></div>
</template>

<script>
export default {
  data() {
    return {
      p5Instance: null,
      balls: [],
      max_balls: 20,
    };
  },
  async mounted() {
    // Dynamically import p5.js only when this component is mounted
    const p5Module = await import('p5');
    const p5 = p5Module.default;
    this.p5Instance = new p5(this.sketch, this.$refs.canvasContainer);
  },
  beforeDestroy() {
    this.p5Instance.remove();
  },
  methods: {
    sketch(p) {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight * .92);
        for (let i = 0; i < 20; i++) {
          this.balls.push(new Ball(p, p.random(p.width), p.random(p.height), p.random(2, 50)));
        }
      };

      p.draw = () => {
        p.background(255);
        for (let i = 0; i < this.balls.length; i++) {
          for (let j = i + 1; j < this.balls.length; j++) {
            let force = this.balls[i].calculateGravityForce(this.balls[j]);
            this.balls[j].applyForce(force);
            this.balls[i].checkCollision(this.balls[j]);
          }
          this.balls[i].update();
          this.balls[i].checkEdges();
          this.balls[i].display();
        }
      };

      p.mousePressed = () => {
        for (let ball of this.balls) {
          ball.clicked(p.mouseX, p.mouseY);
        }
      };

      p.mouseReleased = () => {
        for (let ball of this.balls) {
          ball.stopDragging();
        }
      };
    },
  },
};

class Ball {
  constructor(p, x, y, r) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.r = r;
    this.mass = Math.PI * this.r * this.r;  // Area = πr^2
    this.color = p.color(p.random(255), p.random(255), p.random(255));
    this.dragging = false;
    this.rollover = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  calculateGravityForce(other) {
    let force = p5.Vector.sub(this.pos, other.pos);
    let distance = this.p.constrain(force.mag(), 5, 25);
    force.normalize();
    let strength = (0.001 * this.mass * other.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }

  update() {
    if (this.dragging) {
      this.pos.x = this.p.mouseX + this.offsetX;
      this.pos.y = this.p.mouseY + this.offsetY;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  checkEdges() {
    if (this.pos.x > this.p.width - this.r) {
      this.pos.x = this.p.width - this.r;
      this.vel.x *= -1;
      this.changeColor();
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
      this.changeColor();
    }
    if (this.pos.y > this.p.height - this.r) {  // updated here
      this.pos.y = this.p.height - this.r;  // updated here
      this.vel.y *= -1;
      this.changeColor();
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
      this.changeColor();
    }
  }
  changeColor() {
    this.color = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255));

  }

  display() {
    this.p.fill(this.color);
    this.p.ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }

  clicked(mx, my) {
    let d = this.p.dist(mx, my, this.pos.x, this.pos.y);

    if (d < this.r) {
      this.dragging = true;
      this.offsetX = this.pos.x - mx;
      this.offsetY = this.pos.y - my;
    }
  }

  stopDragging() {
    this.dragging = false;
  }

  checkCollision(other) {
    let d = this.p.dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.r + other.r) {
      let vectorBetween = p5.Vector.sub(other.pos, this.pos);  // vector from this ball to the other
      let distanceBetween = vectorBetween.mag();
      let overlap = (this.r + other.r) - distanceBetween;  // amount of overlap between balls
      let correction = vectorBetween.copy().normalize().mult(overlap / 2);  // correction vector
      this.pos.sub(correction);  // move this ball out of collision
      other.pos.add(correction);  // move other ball out of collision
    }
  }
}


</script>
<style ></style>