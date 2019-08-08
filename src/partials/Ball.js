import { SVG_NS, KEYS, PaddleOptions, BallOptions, GameOptions } from "../settings";
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
      this.collisionTime1 = 0;
      this.collisionTime2 = 0;

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
      this.vx = this.direction * Math.random() * BallOptions.speed;
      this.vy = 0;
      while ( this.vy === 0 ){
        this.vy = this.upOrDown * this.vx;
      }
      
      // Reset the time when either player scores
      if (this.gameTime >= GameOptions.intervalGameTime ){ 
        this.gameTime = 0;
        this.collisionTime1 = 0;
        this.collisionTime2 = 0;
       }
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

            // decrease size of the other player's paddle 
            player1.height = this.dePaddle(player1.height);

            // assign collisionTime for player 2
            this.collisionTime2 = this.gameTime + 10;

        }
      } else { // moving left
        // collision detection for left paddle
        if ( this.x - this.radius >= player1.x && // left edge of the ball is
          this.x - this.radius <= player1.x + player1.width &&
          (this.y >= player1.y && this.y <= player1.y + player1.height) 
          ){
            this.vx *= -1;
            this.ping.play();

            // decrease size of the other player's paddle 
            player2.height = this.dePaddle(player2.height);

            // assign collisionTime for player 1
            this.collisionTime1 = this.gameTime + 10;
          }
      }
      
      // // changes paddle color
      if (this.gameTime < this.collisionTime1){
        player1.color = 'white';
      } else {
        player1.color = PaddleOptions.player1Color;
      }

      if (this.gameTime < this.collisionTime2){
        player2.color = 'white';
      } else {
        player2.color = PaddleOptions.player2Color;
      }
      
    } // end of paddleCollision()
    
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

    // decrease the size of opponent's paddle
    dePaddle(paddle){
      return Math.max(paddle - 8, PaddleOptions.paddleMinHeight);
    }

    render(svg, player1, player2){
      this.gameTime++;
      
      // initiate the ball moving after intervalGameTime(settings.js)
      if (this.gameTime < GameOptions.intervalGameTime){
        this.reset();
      } else {
        this.x += this.vx; 
        this.y += this.vy;  
      } 

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
    
      // bounce when the ball hits the walls
      this.wallCollision(this.gameTime);
      
      // reflect when the ball hits the paddle
      this.paddleCollision(player1, player2);

      // console.log( `ball number: ${Number(this.index) + 1} | size: ${this.radius} | color: ${this.color} | speed: ${ Math.ceil( Math.abs(this.vx) + Math.abs(this.vy) ) / 2}`);

    } // end of render()
}