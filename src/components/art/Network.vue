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
      numBalls: 8 
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
        
        this.balls.forEach(ball => {
            ball.move();
            ball.display();
        });

        for (let i = 0; i < this.balls.length - 1; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                let distance = p.dist(this.balls[i].x, this.balls[i].y, this.balls[j].x, this.balls[j].y);
                
                let biggerDiam = this.balls[i].diameter;
                if (this.balls[j].diameter > this.balls[i].diameter) {
                  biggerDiam = this.balls[j].diameter;
                } 

                if (distance < p.width * .15) {   
                  let blackColor = p.color(0, 0, 0);
            let yellowColor = p.color(255, 255, 0);
            let baseColor = p.color('#ff3366');
            let factor = p.map(distance, 0, p.width * .15, 0, 1);

            // Determine the interpolated color based on distance
            let interpolatedColor;
            if (factor < 0.5) {
                let localFactor = p.map(factor, 0, 0.5, 0, 1);
                interpolatedColor = p.lerpColor(baseColor, yellowColor, localFactor);
            } else {
                let localFactor = p.map(factor, 0.5, 1, 0, 1);
                interpolatedColor = p.lerpColor(yellowColor, blackColor, localFactor);
            }

            p.stroke(interpolatedColor);
            
            // Adjust the stroke weight based on the distance
            let weight = p.map(distance, 0, p.width * .15, biggerDiam, 0);
            p.strokeWeight(weight);

            p.line(this.balls[i].x, this.balls[i].y, this.balls[j].x, this.balls[j].y);

            // Reset stroke color and weight for other drawings
            p.stroke(255, 255, 255);
            p.strokeWeight(1);
                }  
               
            }
        } //last for
 


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
    this.xSpeed = p.random(-2, 2);
    this.ySpeed = p.random(-2, 2);
    this.diameter = p.random(20,50);
    this.color = p.color(p.random(255), p.random(255), p.random(255));
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.x + this.diameter / 2 > this.p.width || this.x - this.diameter / 2 < 0) {
        this.xSpeed *= -1;
    }
    if (this.y + this.diameter / 2 > this.p.height * .92 || this.y - this.diameter / 2 < 0) {
        this.ySpeed *= -1;
    }
  }

  display() {
    this.p.fill(this.color);
    this.p.ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}
</script>

<style scoped></style>
