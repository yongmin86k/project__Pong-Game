import Init from "./Init";
import Board from "./Board";
import Net from "./Net";
import Paddle from "./Paddle";
import Ball from "./Ball";
import Score from "./Score";
import ModeSingle from "./ModeSingle";
import Winner from "./Winner";
import { SVG_NS, KEYS, PaddleOptions, BallOptions } from "../settings";

export default class Game {
  constructor(element, width, height) {
    this.element = element;
    this.width = width;
    this.height = height;
    
    // SVG container
    this.gameElement = document.getElementById(this.element);
    
    // initiate the first screen of game
    this.initFirstScr();

    // create the board and net with same size of the SVG container
    this.board = new Board(this.width, this.height);
    this.net = new Net(this.width, this.height);

    // create single-play mode notice
    this.singlePlay = new ModeSingle(this.width, this.height);

    // create new paddles for the each players
    this.player1 = new Paddle(
      'player1',
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      PaddleOptions.boardGap,
      ((this.height - PaddleOptions.paddleHeight) / 2),
      0,
      PaddleOptions.player1Color,
      KEYS.a,
      KEYS.z,
    );
    this.player2 = new Paddle(
      'player2',
      this.height,
      PaddleOptions.paddleWidth,
      PaddleOptions.paddleHeight,
      this.width - (PaddleOptions.paddleWidth + PaddleOptions.boardGap),
      ((this.height - PaddleOptions.paddleHeight) / 2),
      0,
      PaddleOptions.player2Color,
      KEYS.up,
      KEYS.down,
    );

    // create scores for players
    this.score1 = new Score(this.width / 2 - 40, 40, 32);
    this.score2 = new Score(this.width / 2 + 40, 40, 32);

    // switch between first screen and game screen
    this.showFirstScreen = true;
    
    // keys of switches which affect gameplay
    document.addEventListener('keydown', event => {
      switch(event.keyCode){
        case KEYS.right:
          if ( this.showFirstScreen === true ){
            this.isMulti = !this.isMulti;
          }
          break;
        case KEYS.left:
          if ( this.showFirstScreen === true ){
            this.isMulti = !this.isMulti;
          }
          break;
        case KEYS.spaceBar:
          this.pause = !this.pause;
          break;
        case KEYS.enter:
          this.startPlay =!this.startPlay;
          this.showFirstScreen = true; // return to the first screen
          // reset the game properties
          this.resetGame();
          break;
          
        // change the number of balls
        case KEYS.ballPlus:
          if (this.isMulti){
            BallOptions.number = Math.min(BallOptions.number + 1, BallOptions.maxBallNum);
          
            let index = BallOptions.number -1;
            let rdmIndex1 = Math.floor(Math.random() * 4);
            let rdmIndex2 = Math.floor(Math.random() * 4);
            
            this.ball[`new_${index}`] = new Ball(
              [index],
              this.width,
              this.height,
              BallOptions.ballSize[rdmIndex1],
              BallOptions.ballColor[rdmIndex2]
            );
            break;
          }
        case KEYS.ballMinus:
          if (this.isMulti){
            if (BallOptions.number > 1){
              BallOptions.number = Math.max(BallOptions.number - 1, BallOptions.minBallNum);
              let index = BallOptions.number;
              delete this.ball[`new_${index}`];
            }
          }
          break;
      }
    }); // end of keypress Event

    // new Object and instance for the winner
    this.winner;
    this.displayWinner = new Winner(this.width);

  } /* 
    // end of constructor
    */

  initFirstScr(){
    this.initPlayer1 = new Init(
      (this.width / 2) - 100, 
      (this.height / 2) + 8, 
      '> Single',
    );
    this.initPlayer2 = new Init(
      (this.width / 2) + 100, 
      (this.height / 2) + 8, 
      '> Multi',
    );
    this.caption = new Init(
      this.width / 2,
      this.height - 20,
      'Press <- or -> to select the mode and hit <Enter>',
      12
    );
  }
  
  multiPlay(svg){
    // Render the net
    this.net.render(svg);
    
    // Render the paddles
    this.player1.render(svg);
    this.player2.render(svg);
    
    // Render the ball
    let i = 0;
    for (i; i < BallOptions.number; i++){
      this.ball[`new_${i}`].render(svg, this.player1, this.player2, this.ball);
    }

    // Update scores
    this.score1.render(svg, this.player1.score);
    this.score2.render(svg, this.player2.score);

    let lastBall = `new_${i - 1}`;
    if (this.ballSize[KEYS.ballBig]) {
      this.ballBig(this.ball[lastBall]);
    }
    if (this.ballSize[KEYS.ballSmall]){
      this.ballSmall(this.ball[lastBall]);
    }
  } // end of multiPlay()

  // change the size of balls
  changeSize(){
    document.addEventListener('keydown', event => {
      this.ballSize[event.keyCode] = true;
    });
    document.addEventListener('keyup', event => {
      this.ballSize[event.keyCode] = false;
    })
  }
  ballBig(ball){
    ball.radius = Math.min( ball.radius + 2, BallOptions.maxBallsize );
  }
  ballSmall(ball){
    ball.radius = Math.max( ball.radius - 2, BallOptions.minBallsize );
  }

  resetGame(){
    // reset number of balls
    BallOptions.number = 1;
    // create a new ball for the game
    this.ball = {};
    for (let i = 0; i < BallOptions.number; i++){
      this.ball[`new_${i}`] = new Ball(
        [i], // nth of the  ball
        this.width, // width of the Board
        this.height, // width of the Board
        BallOptions.ballSize[i], // size of each balls in settings.js (Default: 8)
        BallOptions.ballColor[i] // color of each balls in settings.js (Default: white)
        );
    }   
    // reset speed of balls
    BallOptions.speed = 3.5;
    
    // reset the winner
      this.winner = undefined;   
    // the paddle properties
    this.player1.x = PaddleOptions.boardGap;
    this.player1.y = ((this.height - PaddleOptions.paddleHeight) / 2);
    this.player1.height = PaddleOptions.paddleHeight;
    this.player2.x = this.width - (PaddleOptions.paddleWidth + PaddleOptions.boardGap);
    this.player2.y = ((this.height - PaddleOptions.paddleHeight) / 2);
    this.player2.height = PaddleOptions.paddleHeight;
    // the scores
    this.player1.score = 0;
    this.player2.score = 0; 
    
    this.ballSize = {};
    this.changeSize();
  } // end of resetGame()

  render() {
    // if pause === true, render stop
    if ( this.pause ) { return }
    
    // hide the first screen when game begins
    if ( this.startPlay === true ){ this.showFirstScreen = false; }
    
    // properties for SVG tag
    this.gameElement.innerHTML = ''; // Clear the html before appending to fix a render bug 👾
    let svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttributeNS(null, "width", this.width);
    svg.setAttributeNS(null, "height", this.height);
    svg.setAttributeNS(null, "viewBox", [0, 0, this.width, this.height]);
    this.gameElement.appendChild(svg);

    // Render the board
    this.board.render(svg);
    
    // Render first screen contents
    if (this.showFirstScreen === true){
      this.initPlayer1.render(svg, !this.isMulti);
      this.initPlayer2.render(svg, this.isMulti);
      this.caption.render(svg);
    }
    
    // Assign who is the winner
    this.winner = this.displayWinner.winnerIs(this.player1.score, this.player2.score);
  
    // Display the winner of the game
    if ( this.winner ) {
      this.displayWinner.render(svg, this.winner);
      return
    }
    
    // Render game contents
    if ( this.startPlay === true ){
      // Play single-player mode
      if ( !this.isMulti ){ 
        this.singlePlay.render(svg); 
      }
      // Play muti-players mode
      else { 
        this.multiPlay(svg);
       }
    }
  } // end of render()
}