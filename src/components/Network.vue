<template>
  <div ref="canvasContainer"></div>
</template>

<script>
import p5 from "p5";

export default {
  data() {
    return {
      p5Instance: null,
      balls: [],
      numBalls: 10
    };
  },
  mounted() {
    this.p5Instance = new p5(this.sketch, this.$refs.canvasContainer);
  },
  beforeDestroy() {
    this.p5Instance.remove();
  },
  methods: {
    sketch(p) {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        for (let i = 0; i < this.numBalls; i++) {
          this.balls.push(new Ball(p, p.random(p.width * .2, p.width * .9), p.random(p.height * .2, p.height * .9)));
        }
      };

      p.draw = () => {
        p.background(255);

        for (let ball of this.balls) {
          ball.move();
          ball.display();
        }

        for (let i = 0; i < this.balls.length; i++) {
          for (let j = i + 1; j < this.balls.length; j++) {
            if (p.abs(this.balls[i].x - this.balls[j].x) < p.width * .3) {
              p.line(this.balls[i].x, this.balls[i].y, this.balls[j].x, this.balls[j].y);
            }
          }
        }
      };

      p.mousePressed = () => {
        this.balls.push(new Ball(p, p.mouseX, p.mouseY));
      };
    }
  }
};

class Ball {
  constructor(p, x, y) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.xSpeed = p.random(-2,);
    this.ySpeed = p.random(-2, 2);
    this.diameter = p.random(20, 50);
    this.color = p.color(p.random(255), p.random(255), p.random(255));
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.x + this.diameter / 2 > this.p.width || this.x - this.diameter / 2 < 0) {
      this.xSpeed *= -1;
      this.color = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255));
    }
    if (this.y + this.diameter / 2 > this.p.height * .92 || this.y - this.diameter / 2 < 0) {
      this.ySpeed *= -1;
      this.color = this.p.color(this.p.random(255), this.p.random(255), this.p.random(255));
    }
  }

  display() {
    this.p.fill(this.color);
    this.p.ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
</script>

<style scoped></style>
