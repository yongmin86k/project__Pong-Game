import { SVG_NS, BallOptions } from "../settings";
import pingSound from "../../public/sounds/pong-01.wav";

export default class Ball {
    constructor(index, boardWidth, boardHeight, radius = 8, color = '#FFFFFF') {
      this.index = index;
      this.boardWidth = boardWidth;
      this.boardHeight = boardHeight;
      this.radius = radius;
      this.color = color;
      this.direction = 1;

      this.ping = new Audio(pingSound);
      
      this.reset();
    } // end of constructor

    reset(){
      this.x = this.boardWidth / 2;
      this.y = this.boardHeight / 2;
      
      this.vx = 0;
      this.vy = 0;

      // start the game
      this.vx = this.direction * BallOptions.speed;
      this.vy = BallOptions.speed;
      console.log( `ball number: ${Number(this.index) + 1} | size: ${this.radius} | color: ${this.color} | speed: ${ Math.ceil( Math.abs(this.vx) + Math.abs(this.vy) ) / 2}`);
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
      // initiate the ball moving
      this.x += this.vx;
      // this.x += this.vx;
      this.y += this.vy;

      // bounce when the ball hits the walls
      this.wallCollision();

      // reflect when the ball hits the paddle
      this.paddleCollision(player1, player2);

      // create a ball
      let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'fill', this.color);
        circle.setAttributeNS(null, 'cx', this.x);
        circle.setAttributeNS(null, 'cy', this.y);

        svg.appendChild(circle);

        // change ball direction when a player scores
      const rightGoal = this.x + this.radius >= this.boardWidth;
      const leftGoal = this.x - this.radius <= 0;

        if ( rightGoal ) {
          this.direction = 1;
          this.goal(player1);
        } else if ( leftGoal ){
          this.direction = -1;
          this.goal(player2);
        }
    }
}