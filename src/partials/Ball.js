import { SVG_NS, KEYS, BallOptions, GameOptions } from "../settings";
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

      this.gameTime = 0; // Time for game play in FPS

      this.reset();
      this.changeSpeed();

    } // end of constructor

    reset(){
      this.x = this.boardWidth / 2;
      this.y = this.boardHeight / 2;
      this.vx = 0;
      this.vy = 0;

      // Randomize ball direction of going up or down
      this.upOrDown = Math.round(Math.random() * 10) <= 5 ? 1 : -1;
      this.vx = this.direction * BallOptions.speed;
      this.vy = this.upOrDown * BallOptions.speed;
        // console.log( `ball number: ${Number(this.index) + 1} | size: ${this.radius} | color: ${this.color} | speed: ${ Math.ceil( Math.abs(this.vx) + Math.abs(this.vy) ) / 2}`);
      
      // Reset the time when either player scores
      if (this.gameTime >= GameOptions.intervalGameTime ){ this.gameTime = 0; }
    }

    wallCollision(){
      const hitTop = this.y - this.radius <= 0;
      const hitBottom = this.y + this.radius >= this.boardHeight;
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

    // change the speed of balls
    changeSpeed(){
      document.addEventListener('keydown', event => {
        switch(event.key){
          case KEYS.ballFast:
              BallOptions.speed = Math.min(BallOptions.speed + 1, BallOptions.maxSpeed);
              if ( this.vx > 0){ 
                this.vx = Math.min(this.vx + 1, BallOptions.maxSpeed);
              } else { 
                this.vx = Math.max((Math.abs(this.vx) + 1) * -1, -BallOptions.maxSpeed);
              }
              if ( this.vy > 0){ 
                this.vy = Math.min(this.vy + 1, BallOptions.maxSpeed);
              } else { 
                this.vy = Math.max((Math.abs(this.vy) + 1) * -1, -BallOptions.maxSpeed);
              }
            break;
          case KEYS.ballSlow:
              BallOptions.speed = Math.max(BallOptions.speed - 1, BallOptions.minSpeed);
              if ( this.vx > 0){ 
                this.vx = Math.max(this.vx - 1, BallOptions.minSpeed);
              } else { 
                this.vx = Math.min((Math.abs(this.vx) - 1) * -1, -BallOptions.minSpeed);
              }
              if ( this.vy > 0){ 
                this.vy = Math.max(this.vy - 1, BallOptions.minSpeed);
              } else { 
                this.vy = Math.min((Math.abs(this.vy) - 1) * -1, -BallOptions.minSpeed);
              }
            break;
        }
      });
    }

    render(svg, player1, player2){
      this.gameTime++;
      
      if (this.gameTime < GameOptions.intervalGameTime){
        this.reset();
      }
      
      // create a ball
      let circle = document.createElementNS(SVG_NS, 'circle');
        circle.setAttributeNS(null, 'r', this.radius);
        circle.setAttributeNS(null, 'fill', this.color);
        circle.setAttributeNS(null, 'cx', this.x);
        circle.setAttributeNS(null, 'cy', this.y);

        svg.appendChild(circle);
        
      // initiate the ball moving after intervalGameTime(settings.js)
      if (this.gameTime >= GameOptions.intervalGameTime) {
        this.x += this.vx; 
        this.y += this.vy;  
      }

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
    
      // bounce when the ball hits the walls
      this.wallCollision(this.gameTime);
      
      // reflect when the ball hits the paddle
      this.paddleCollision(player1, player2);
    } // end of render()
}