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

      this.paddlePosition1 = [];
      this.paddlePosition2 = [];

      this.ballSpeed = 0.3;

      this.reset();
      this.changeSpeed();
      
    } // end of constructor

    reset(){
      this.x = this.boardWidth / 2;
      this.y = this.boardHeight / 2;
      this.vx = 0;
      this.vy = 0;

      this.vx = this.direction * BallOptions.speed;
      this.vy = 0;

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

    paddleCollision(player1, player2, objBall) {
      if (this.vx > 0) { // moving right
        // collision detection for player2
        if ( this.x + this.radius >= player2.x && 
          this.x + this.radius <= player2.x + player2.width &&
          ( this.y >= player2.y && this.y <= player2.y + player2.height )
          ){
            // add spins to the ball in response to the direction of a paddle
            let yDirection;
            if ( player2.keyState[38] ){ yDirection = -1; } 
            else if ( player2.keyState[40] ){ yDirection = 1; } 
            else { yDirection = 0; }

            this.fxCollision(yDirection, player2);

            // detect paddle movement
            // if not moved, return force = 0
            this.detectMovement(player2, this.paddlePosition2);

        }
      } else { // moving left
        // collision detection for player1
        if ( this.x - this.radius >= player1.x && 
          this.x - this.radius <= player1.x + player1.width &&
          (this.y >= player1.y && this.y <= player1.y + player1.height) 
          ){
            let yDirection;
            if ( player1.keyState[65] ){ yDirection = -1; } 
            else if ( player1.keyState[90] ){ yDirection = 1; } 
            else { yDirection = 0; }

            this.fxCollision(yDirection, player1);

            this.detectMovement(player1, this.paddlePosition1);

            this.vy += (yDirection * player1.force) / 2;
            // speed up
            this.vx = Math.min(Math.abs(this.vx) + this.ballSpeed, 8.5);
            this.ping.play();

            player1.height = this.dePaddle(player1.height);

            this.collisionTime1 = this.gameTime + 10;
            
          }
      }
      
      // changes paddle color
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
      // this.reset();
    }

    // change the speed of balls
    changeSpeed(){
      document.addEventListener('keydown', event => {
        switch(event.keyCode){
          case KEYS.ballFast:
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

    logPlayerPosition(player, recordPos){
      recordPos.unshift(player.y);
      if (recordPos.length > 5){ recordPos.pop(); }
    }
    
    detectMovement(player, recordPos){
      const notMoved = recordPos.every(pos=> pos === recordPos[0])
      if (notMoved){ player.force = 0; }
    }

    // functions of paddle collision
    fxCollision(direction, player){
      this.vy += (direction * player.force) / 2;
      // speed up
      console.log(player);
      if (player.name === 'player1'){
        this.vx = Math.min(Math.abs(this.vx) + this.ballSpeed, 8.5);
      } else {
        this.vx = Math.min(Math.abs(this.vx + this.ballSpeed), 8.5) * -1;
      }

      this.ping.play(); // play the sound when paddle hits the ball          

      // decrease size of the player's paddle 
      player.height = this.dePaddle(player.height);

      // assign collisionTime for player 2
      this.collisionTime2 = this.gameTime + 10;
    }

    // decrease the size of opponent's paddle
    dePaddle(paddle){
      return Math.max(paddle - 8, PaddleOptions.paddleMinHeight);
    }

    showGuideline(svg, objBall){   
      Object.keys(objBall).forEach(key=>{
        // console.log(objBall[key].x, objBall[key].y, objBall[key].vx, objBall[key].vy);
      });
      
      // console.log(objBall, this.boardWidth, this.boardHeight);
    }

    render(svg, player1, player2, objBall){
      this.gameTime++;
      this.logPlayerPosition(player1, this.paddlePosition1);
      this.logPlayerPosition(player2, this.paddlePosition2);
      
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
      if (rightGoal || leftGoal){
        this.reset();

        // reset the position of paddles only the number of balls is greater than 1
        if ( Object.keys(objBall).length === 1){
          player1.y = ((this.boardHeight - PaddleOptions.paddleHeight) / 2);
          player1.height = PaddleOptions.paddleHeight;

          player2.y = ((this.boardHeight - PaddleOptions.paddleHeight) / 2);
          player2.height = PaddleOptions.paddleHeight;
        }
      }
    
      // bounce when the ball hits the walls
      this.wallCollision(this.gameTime);
      
      // reflect when the ball hits the paddle
      this.paddleCollision(player1, player2, objBall, svg);

      // show the guideline of the ball direction
      this.showGuideline(svg, objBall);

    } // end of render()
}