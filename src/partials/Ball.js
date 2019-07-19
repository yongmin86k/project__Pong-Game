import { SVG_NS } from "../settings";
import pingSound from "../../public/sounds/pong-01.wav";

export default class Ball {
    constructor(radius, color = '#FFFFFF', boardWidth, boardHeight) {
      this.radius = radius;
      this.color = color;
      this.boardWidth = boardWidth;
      this.boardHeight = boardHeight;
      this.direction = 1;

      this.ping = new Audio(pingSound);
      
      this.reset();
    } // end of constructor

    reset(){
      this.x = this.boardWidth / 2;
      this.y = this.boardHeight / 2;
      
      this.vy = 0;
      while(this.vy === 0){  // this.vy won't show 0 output
      // this.vy = 0.1;
        this.vy = Math.floor(Math.random() * 10 - 5); // determines the angle of the ball
      } 
      this.vx = this.direction * (6 - Math.abs(this.vy));
      // this.vx = this.direction * 2; // determines the speed of the ball
    }

    wallCollision(){
      const hitLeft = this.x - this.radius <= 0;
      const hitRight = this.x + this.radius >= this.boardWidth;
      const hitTop = this.y - this.radius <= 0;
      const hitBottom = this.y + this.radius >= this.boardHeight;
      if (hitLeft || hitRight ){ this.vx *= -1; } // this.vx = -this.vx;
      if (hitTop || hitBottom ){ this.vy *= -1; }
    }

    paddleCollision(player1, player2) {
      if (this.vx > 0) { // moving right
        // collision detection for right paddle
        if ( this.x + this.radius >= player2.x && 
          this.x + this.radius <= player2.x + player2.width &&
          ( this.y >= player2.y && this.y <= player2.y + player2.height )
          ){
            // if true then there's a collision
            this.vx *= -1;
            this.ping.play(); // play the sound when paddle hits the ball
        }

      } else { // moving left
        // collision detection for left paddle
        if ( this.x - this.radius >= player1.x && // left edge of the ball is
          this.x - this.radius <= player1.x + player1.width &&
          (this.y >= player1.y && this.y <= player1.y + player1.height) 
          ){
            this.vx *= -1;
            this.ping.play();
          }
      }
    }

    goal(player) {
      player.score++;
      this.reset();
    }

    render(svg, player1, player2){
      // ball moves randomly when it resets
      this.x +=  this.vx;
      this.y += this.vy;

      this.wallCollision();
      this.paddleCollision(player1, player2);

        let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'fill', this.color);
        circle.setAttributeNS(null, 'cx', this.x);
        circle.setAttributeNS(null, 'cy', this.y);

        svg.appendChild(circle);

        const rightGoal = this.x + this.radius >= this.boardWidth;
        const leftGoal = this.x - this.radius <= 0;

        if ( rightGoal ) {
          this.goal(player1);
          this.direction = 1;
        } else if ( leftGoal ){
          this.goal(player2);
          this.direction = -1;
        }
    }
}