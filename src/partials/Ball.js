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

      this.ballSpeed = 0.3; // Speed increment every time hits the paddle

      this.moveTo = {l:[]};

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

      
      this.moveTo['m'] = '';
      this.moveTo['l'] = [];
      
      // Reset the time when either player scores
      if (this.gameTime >= GameOptions.intervalGameTime ){ 
        this.gameTime = 0;
        this.collisionTime1 = 0;
        this.collisionTime2 = 0;
       }
    }

    wallCollision(){
      const hitTop = this.y - this.radius < 0;
      const hitBottom = this.y + this.radius > this.boardHeight;
      if (hitTop || hitBottom ){ this.vy *= -1; }
    }

    paddleCollision(player1, player2, objBall) {
      if (this.vx > 0) { // moving right
        // collision detection for player2
        if ((this.x + this.radius >= player2.x && this.x - this.radius <= player2.x + player2.width) &&
          (this.y >= player2.y && this.y <= player2.y + player2.height)){
            // add spins to the ball in response to the direction of a paddle
            let yDirection;
            if ( player2.keyState[38] ){ yDirection = -1; } 
            else if ( player2.keyState[40] ){ yDirection = 1; } 
            else { yDirection = 0; }

            this.fxCollision(yDirection, player2, objBall);

        }
      } else { // moving left
        // collision detection for player1
        if ((this.x + this.radius >= player1.x && this.x - this.radius <= player1.x + player1.width) &&
          (this.y >= player1.y && this.y <= player1.y + player1.height)){
            let yDirection;
            if ( player1.keyState[65] ){ yDirection = -1; } 
            else if ( player1.keyState[90] ){ yDirection = 1; } 
            else { yDirection = 0; }

            this.fxCollision(yDirection, player1, objBall);
            
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
            break;
          case KEYS.ballSlow:
              if ( this.vx > 0){ 
                this.vx = Math.max(this.vx - 1, BallOptions.minSpeed);
              } else { 
                this.vx = Math.min((Math.abs(this.vx) - 1) * -1, -BallOptions.minSpeed);
              }
            break;
        }

      });
    }

    logPlayerPosition(player, recordPos){
      recordPos.unshift(player.y);
      if (recordPos.length > 3){ recordPos.pop(); }
    }
    
    detectMovement(player, recordPos){
      const notMoved = recordPos.every(pos=> pos === recordPos[0])
      if (notMoved){ player.force = 0; }
    }

    // decrease the size of opponent's paddle
    dePaddle(paddle){
      return Math.max(paddle - 8, PaddleOptions.paddleMinHeight);
    }

    // functions of paddle collision
    fxCollision(direction, player, objBall){ 
      // reset the guideline
      this.moveTo['l'] = [];
      
      // speed up
      if (player.name === 'player1'){
        // detect paddle movement
        // if not moved, return force = 0
        this.detectMovement(player, this.paddlePosition1);
        this.vx = Math.min(Math.abs(this.vx) + this.ballSpeed, BallOptions.maxSpeed);
        
        // assign collisionTime for player
        this.collisionTime1 = this.gameTime + 10;
      
      } else {
        this.detectMovement(player, this.paddlePosition2);
        this.vx = Math.min(Math.abs(this.vx + this.ballSpeed), BallOptions.maxSpeed) * -1;

        this.collisionTime2 = this.gameTime + 10;
      } //* end if

      // adjust  angles and power to the ball
      this.vy += (direction * player.force) / 2;

      // play the sound when paddle hits the ball
      this.ping.play(); 

      // decrease size of the player's paddle 
      player.height = this.dePaddle(player.height);

      this.toggleGuideLine(objBall)
      
    } // end fxCollision();

    // toggle the guideline of the ball direction
    toggleGuideLine(objBall){
      Object.keys(objBall).forEach(key => {
        let startLineX = objBall[key].x,
            startLineY = objBall[key].y,
            ballGapWidth = this.radius + PaddleOptions.paddleWidth + PaddleOptions.boardGap,
            moveWidth = this.boardWidth - (2  * ballGapWidth),
            moveTime = Math.abs(moveWidth / this.vx),
            moveHeight = startLineY + (this.vy * moveTime),
            detectCollision;

        // Detect Collision
        if (
        (moveHeight < 0 + this.radius ) ||
        (moveHeight > this.boardHeight - this.radius )
        ) { detectCollision = true; } 
        else { detectCollision = false;}
        
        // Start coordinates of the guideline
        this.moveTo['m'] = `M${startLineX} ${startLineY}`;

        if ( detectCollision === false && this.vx < 0 ){
          // Move left without collisions
          this.moveTo['l'].push(`L${ballGapWidth} ${moveHeight}`);
        } else if ( detectCollision === false && this.vx > 0 ){
          // Move right without collisions
          this.moveTo['l'].push(`L${this.boardWidth - ballGapWidth} ${moveHeight}`);
        } else {
          // with collisions
          let timeCollisionFirst,
              timeCollisionLast,
              timeCollisionDefault,
              numCollision,
              lineX, lineY,
              vectorDirectionY = 1;
            
            if ( this.vy < 0){
              // Move up
              timeCollisionFirst = Math.abs((this.radius - startLineY) / this.vy);
            } else {
              // Move down
              timeCollisionFirst = Math.abs((this.boardHeight - this.radius - startLineY) / this.vy);
            }
            timeCollisionDefault = Math.abs((this.boardHeight - (2 * this.radius)) / this.vy);
            timeCollisionLast = (moveTime - timeCollisionFirst) % timeCollisionDefault;
            numCollision = Math.ceil((moveTime - timeCollisionFirst) / timeCollisionDefault);

            for ( let i=0; i < numCollision + 1; i++){
              switch (i){
                // first collision coordinates
                case 0 : 
                  lineX = startLineX + (this.vx * timeCollisionFirst);
                  lineY = startLineY + (this.vy * timeCollisionFirst);
                  this.moveTo['l'].push(`L${ lineX } ${ lineY }`);
                  break;

                // last collision coordinates
                case numCollision :
                  vectorDirectionY *= -1;
                  lineX = this.vx < 0 ? ballGapWidth : this.boardWidth - ballGapWidth;
                  lineY = Math.min( lineY + ( vectorDirectionY * timeCollisionLast * this.vy ), this.boardHeight - ( 2 * this.radius) )
                  this.moveTo['l'].push(`L${ lineX } ${ lineY }`);
                  break;

                default :
                  vectorDirectionY *= -1;
                  lineX = lineX + (timeCollisionDefault * this.vx);
                  lineY = Math.min( lineY + ( vectorDirectionY * timeCollisionDefault * this.vy ), this.boardHeight - ( 2 * this.radius) )
                  this.moveTo['l'].push(`L${ lineX } ${ lineY }`);
              } // end switch
            } // end forLoop
        } // end if
      }); // end Object forEach
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
      this.paddleCollision(player1, player2, objBall);

      document.addEventListener('keydown', e => {
        if (e.keyCode === KEYS.toggleGuideline){
          GameOptions.displayGuideline = !GameOptions.displayGuideline;
        };
      });
      if (GameOptions.displayGuideline === true){
        let path = document.createElementNS(SVG_NS, 'path');
          path.setAttributeNS(null, 'd', `${this.moveTo['m']} ${this.moveTo['l'].join(' ')}`);
          path.setAttributeNS(null, 'fill', 'none');
          path.setAttributeNS(null, 'stroke', 'rgba(255, 255, 255, 0.3)');
          path.setAttributeNS(null, 'stroke-width', 2);
          path.setAttributeNS(null, 'stroke-dasharray', [2, 8]);
          svg.appendChild(path);
      }

    } // end of render()
}